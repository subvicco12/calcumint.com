"""Review-only provisioning for the exact previously qualified Node and Git."""
import argparse
import hashlib
import os
from pathlib import Path
import re
import subprocess
import tarfile
import tempfile
from urllib.request import HTTPRedirectHandler, Request, build_opener

ARCHIVE_SHA = "469fb733a7ae0adb8d39e7c22b60be47f5685d7c3cfeb28b1c8e183e06a5f696"
ARCHIVE_SIZE = 101018031
NODE_SHA = "94efd062ed066c1a0b332e18249859c905e920eeada5df55d24c99b919629a90"
GIT_SHA = "9dae295c1a4ffae4ee772e6205fcf22b26e1bfeeb5ee98f278b5139bda7ca22f"


def verify_file(path, expected):
    with path.open("rb") as stream:
        if hashlib.file_digest(stream, "sha256").hexdigest() != expected:
            raise ValueError("Unexpected " + path.name + " digest")


class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl):
        raise ValueError("Runtime download redirect refused")


def download(path):
    file_id = os.environ.get("BOOTSTRAP_RUNTIME_FILE_ID", "")
    token = os.environ.get("BOOTSTRAP_DRIVE_TOKEN", "")
    if not token or not re.fullmatch(r"[A-Za-z0-9_-]+", file_id):
        raise ValueError("Missing protected runtime artifact or Drive access")
    request = Request("https://www.googleapis.com/drive/v3/files/" + file_id + "?alt=media",
                      headers={"Authorization": "Bearer " + token})
    written = 0
    with build_opener(NoRedirect).open(request, timeout=30) as response, path.open("xb") as stream:
        while chunk := response.read(1024 * 1024):
            written += len(chunk)
            if written > ARCHIVE_SIZE:
                raise ValueError("Runtime archive exceeds exact size")
            stream.write(chunk)


def provision(archive, destination):
    if archive.stat().st_size != ARCHIVE_SIZE:
        raise ValueError("Unexpected runtime archive size")
    verify_file(archive, ARCHIVE_SHA)
    with tarfile.open(archive, "r:gz") as source:
        source.extractall(destination, filter="data")
    root = destination / "runtime"
    node, git = root / "bin/node", root / "bin/git"
    verify_file(node, NODE_SHA)
    verify_file(git, GIT_SHA)
    helpers = root / "libexec/git-core"
    verify_file(helpers / "git-upload-pack", GIT_SHA)
    env = {"PATH": str(root / "bin") + ":/usr/bin:/bin", "HOME": str(destination),
           "GIT_EXEC_PATH": str(helpers), "GIT_CONFIG_GLOBAL": "/dev/null", "GIT_CONFIG_NOSYSTEM": "1"}
    for exe in (node, git, helpers / "git-remote-https"):
        output = subprocess.check_output(["/usr/bin/ldd", exe], env=env, text=True, timeout=10)
        if "not found" in output:
            raise ValueError("Runtime library missing for " + exe.name)
    if subprocess.check_output([git, "--exec-path"], env=env, text=True, timeout=10).strip() != str(helpers):
        raise ValueError("Git helper directory differs")
    subprocess.run([node, "-e", """
const {execFileSync}=require('node:child_process');
if(process.version!=='v22.23.4')process.exit(1);
const output=execFileSync('git',['--version'],{stdio:['ignore','pipe','pipe']});
if(output.toString().trim()!=='git version 2.52.0')process.exit(1);
"""], env=env, check=True, timeout=10)
    return node, git, helpers


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, required=True)
    parser.add_argument("--local-archive", type=Path)
    args = parser.parse_args()
    destination = Path(tempfile.mkdtemp(prefix="calcumint-pinned-", dir=args.root.resolve(strict=True)))
    try:
        archive = args.local_archive
        if archive is None:
            archive = destination / "runtime.tar.gz"
            download(archive)
        node, git, helpers = provision(archive, destination)
        if args.local_archive is None:
            archive.unlink()
            with Path(os.environ["GITHUB_ENV"]).open("a", encoding="utf-8") as env:
                env.write(f"BOOTSTRAP_NODE={node}\nBOOTSTRAP_GIT={git}\nGIT_EXEC_PATH={helpers}\n")
        print("Exact runtime hashes, Git helpers, loader dependencies and fresh process passed.")
    except Exception as error:
        raise SystemExit(f"Runtime provisioning refused ({type(error).__name__})") from None


if __name__ == "__main__":
    main()
