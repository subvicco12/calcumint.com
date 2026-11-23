"""External owner-bound verifier for isolated CalcuMint bootstrap preparation."""
import hashlib
import io
import json
import os
from pathlib import Path
import re
import subprocess
import tarfile
from tempfile import TemporaryDirectory
from urllib.request import Request, urlopen

REPO = "subvicco12/calcumint.com"
WORKFLOW = ".github/workflows/trusted-source-bootstrap.yml"
REF = "refs/heads/engineering/trusted-bootstrap-runtime-20261123"
ENVIRONMENT = "calcumint-source-bootstrap-runtime"
DOCUMENT = "1KU7fGtv86RQz_n3HCdl9HscTyN2Z7SlXz8U8EF3f3MY"
COMMENT = "doco.99YAEt3IFT2z1P1SzIkt5A"
OWNER = "Subrata Singha Roy"
COMMIT = "fb91016fd550baeea05e02e030fe5d3772aeb2f1"
TREE = "ee986a2dff362a46e9aa09015c3e555fb3ab1a70"
ARCHIVE = "e7cf709bf9cdeda00b034d44001ba48e0f8ffd13787be4d27de7906554981009"
PACKET = "1344776613bce4b1c3e07449b6e57b5258694b385a8d0bac37955705bfab1c36"


def require(condition, message):
    if not condition:
        raise ValueError(message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def identity(data, expected, label):
    require(digest(data) == expected, f"{label} digest differs")
    return data


def verify_context(env):
    expected = env.get("TRUSTED_WORKFLOW_SHA", "")
    require(re.fullmatch("[0-9a-f]{40}", expected), "Missing protected workflow SHA")
    require(env.get("GITHUB_REPOSITORY") == REPO, "Unauthorized repository")
    require(env.get("GITHUB_EVENT_NAME") == "workflow_dispatch", "Unauthorized event")
    require(env.get("GITHUB_REF") == REF and env.get("GITHUB_REF_PROTECTED") == "true",
            "Unauthorized workflow reference")
    require(env.get("GITHUB_WORKFLOW_REF") == f"{REPO}/{WORKFLOW}@{REF}" and
            env.get("GITHUB_WORKFLOW_SHA") == expected and env.get("GITHUB_SHA") == expected,
            "Unauthorized workflow identity")
    require(env.get("BOOTSTRAP_ENVIRONMENT") == ENVIRONMENT, "Unauthorized environment")
    require(env.get("BOOTSTRAP_PREPARATION_ONLY") == "true", "Protected activation is disabled")


def drive(token, endpoint, cap):
    require(bool(token), "Missing protected Drive credential")
    request = Request("https://www.googleapis.com/drive/v3/" + endpoint,
                      headers={"Authorization": "Bearer " + token})
    with urlopen(request, timeout=15) as response:
        data = response.read(cap + 1)
    require(len(data) <= cap, "Drive response exceeds limit")
    return data


def verify_owner(comment, owner):
    user = owner.get("user", {})
    require(user.get("emailAddress") == "subvicco12@gmail.com" and user.get("displayName") == OWNER,
            "Wrong connected Drive owner")
    require(comment.get("id") == COMMENT and comment.get("deleted") is False,
            "Missing or deleted exact owner comment")
    author = comment.get("author") or {}
    require(author.get("me") is True and author.get("displayName") == OWNER, "Wrong comment author")
    lines = comment.get("content", "").splitlines()
    expected = [
        "APPROVE — NEW, SEPARATE CALCUMINT PROTECTED-SOURCE ADMISSION (not an extension of the earlier nine-transition approval).",
        f"Repository: {REPO}", f"Exact candidate commit: {COMMIT}", f"Exact tree: {TREE}",
        f"Reviewed source package SHA-256: {ARCHIVE}", f"Owner-admission packet SHA-256: {PACKET}",
        "Approval scope: only the exact protected source transitions and launcher, runtime, import-closure and fresh-process conditions bound by this independently reviewed packet. Require exact-source verification, an independently authenticated trust bootstrap, and verified owner attribution before activation. Preserve historical Stage 8/9 proofs, Batch 14 evidence and the four original @1 engines. No merge, deployment, production changes, certification, publication or RELEASE HOLD removal. This is a separate approval from the historical 3c99ac2f nine-transition decision.",
    ]
    require(lines == expected, "Owner approval text or scope differs")


def verify_candidate(head, tree):
    require((head, tree) == (COMMIT, TREE), "Unapproved candidate commit or tree")


def inspect_module_graph(graph, counts, child=False):
    keys = [(row.get("scope"), row["path"]) for row in graph["files"]]
    require(len(keys) == len(set(keys)) == counts["modules"], "Module roster differs")
    require(len(graph["edges"]) == counts["records"], "Import count differs")
    modules = set(keys)
    for edge in graph["edges"]:
        scope = edge.get("scope")
        require((scope, edge["from"]) in modules, "Unexpected import source")
        if edge.get("builtin") or edge.get("resolution") == "node-builtin":
            specifier = edge.get("specifier", "")
            require(specifier.startswith("node:"), "Unexpected builtin binding")
            continue
        target_scope = edge.get("targetScope", scope) if child else None
        require((target_scope, edge.get("to")) in modules, "Unexpected import target")


def archive_entries(raw, names):
    result = {}
    with tarfile.open(fileobj=io.BytesIO(raw), mode="r:gz") as archive:
        for member in archive:
            if member.name not in names:
                continue
            require(member.isfile() and member.size <= 4 * 1024 * 1024 and member.name not in result,
                    "Invalid reviewed archive member")
            result[member.name] = archive.extractfile(member).read()
    require(set(result) == names, "Missing reviewed archive member")
    return result


def verify_bundle(raw, packet_raw):
    identity(raw, ARCHIVE, "Source package")
    packet = json.loads(identity(packet_raw, PACKET, "Admission packet"))
    verify_candidate(packet["candidate"], packet["tree"])
    require(packet["sourcePackage"]["sha256"] == ARCHIVE and
            packet["admitted"] is False and packet["activated"] is False, "Packet scope differs")
    interfaces = packet["interfaces"]
    members = archive_entries(raw, {"launch.mjs", "inline-bootstrap.txt", "parent-graph.json", "child-graph.json"})
    identity(members["launch.mjs"], interfaces["parentLauncher"]["sha256"], "Launcher")
    identity(members["inline-bootstrap.txt"], interfaces["inlineChildBootstrap"]["sha256"], "Child bootstrap")
    for scope, meta in interfaces["importGraphs"].items():
        graph = json.loads(identity(members[scope + "-graph.json"], meta["sha256"], scope + " graph"))
        if scope == "parent":
            verify_candidate(graph["commit"], graph["tree"])
        inspect_module_graph(graph, meta, child=scope == "child")
    return interfaces, members


def verify_runtime(paths, interfaces):
    for tool in ("node", "git"):
        path = paths[tool]
        require(path.is_absolute() and path.resolve(strict=True) == path and path.is_file(),
                f"Untrusted {tool} path")
        expected = interfaces["runtime"][tool]
        require(path.stat().st_size == expected["bytes"], f"{tool} size differs")
        identity(path.read_bytes(), expected["sha256"], tool)


def candidate_git(git, root, args):
    return subprocess.check_output(
        [git, "-C", root, "-c", "core.hooksPath=/dev/null", *args], stdin=subprocess.DEVNULL,
        stderr=subprocess.PIPE, timeout=15,
        env={"PATH": "/usr/bin:/bin", "GIT_CONFIG_NOSYSTEM": "1", "GIT_CONFIG_GLOBAL": "/dev/null"},
    )


def verify_source(git, root, parent):
    def run(*args):
        return candidate_git(git, root, args)

    def head():
        verify_candidate(run("rev-parse", "HEAD").decode().strip(),
                         run("rev-parse", "HEAD^{tree}").decode().strip())

    head()
    for row in [*parent["files"], parent["proposal"]]:
        path = root / row["path"]
        require(path.resolve(strict=True) == path and path.is_file(), "Missing or redirected source")
        require(run("rev-parse", COMMIT + ":" + row["path"]).decode().strip() == row["blob"],
                "Source object binding differs")
        original = run("cat-file", "blob", row["blob"])
        require(len(original) == row["bytes"], "Git source byte count differs")
        identity(original, row["sha256"], "Git source")
        require(path.read_bytes() == original, "Source substitution or movement")
    head()


def verify_child_sources(git, root, graph):
    """Verify current and historical executable objects without launching the child."""
    for row in graph["files"]:
        path, ref, blob = row["path"], row["ref"], row["blob"]
        require(candidate_git(git, root, ["rev-parse", ref + ":" + path]).decode().strip() == blob,
                "Child source object binding differs")
        raw = candidate_git(git, root, ["cat-file", "blob", blob])
        require(len(raw) == row["bytes"], "Child source byte count differs")
        identity(raw, row["sha256"], "Child source")
        if row["scope"] == "live":
            live = root / path
            require(live.resolve(strict=True) == live and live.read_bytes() == raw,
                    "Live child source substitution")
    verify_candidate(candidate_git(git, root, ["rev-parse", "HEAD"]).decode().strip(),
                     candidate_git(git, root, ["rev-parse", "HEAD^{tree}"]).decode().strip())


def run_verified_launcher(root, paths, interfaces, members):
    """Fresh-process handoff, qualified on a fixture only in preparation mode."""
    verify_runtime(paths, interfaces)
    launcher = identity(members["launch.mjs"], interfaces["parentLauncher"]["sha256"], "Launcher")
    graph_digest = interfaces["importGraphs"]["parent"]["sha256"]
    graph = identity(members["parent-graph.json"], graph_digest, "Parent graph")
    with TemporaryDirectory(prefix="calcumint-launch-") as temp:
        private = Path(temp)
        executable = private / "launch.mjs"
        manifest = private / "parent-graph.json"
        executable.write_bytes(launcher)
        manifest.write_bytes(graph)
        executable.chmod(0o400)
        manifest.chmod(0o400)
        (private / "git").symlink_to(paths["git"])
        result = subprocess.run(
            [paths["node"], executable, root, manifest, graph_digest],
            cwd=private, env={"PATH": str(private), "HOME": str(private),
                              "GIT_CONFIG_GLOBAL": "/dev/null", "GIT_CONFIG_NOSYSTEM": "1"},
            stdin=subprocess.DEVNULL, check=True, timeout=260,
        )
        identity(executable.read_bytes(), interfaces["parentLauncher"]["sha256"], "Launcher at exit")
        identity(manifest.read_bytes(), graph_digest, "Parent graph at exit")
        return result.returncode


def download_file(token, key, cap):
    file_id = os.environ.get(key, "")
    require(re.fullmatch(r"[A-Za-z0-9_-]+", file_id), "Missing protected Drive file ID: " + key)
    return drive(token, f"files/{file_id}?alt=media", cap)


def main():
    verify_context(os.environ)
    token = os.environ.get("BOOTSTRAP_DRIVE_TOKEN", "")
    owner = json.loads(drive(token, "about?fields=user", 65536))
    comment = json.loads(drive(token, f"files/{DOCUMENT}/comments/{COMMENT}?fields=id,content,author,deleted", 65536))
    verify_owner(comment, owner)
    archive = download_file(token, "BOOTSTRAP_SOURCE_FILE_ID", 16 * 1024 * 1024)
    packet = download_file(token, "BOOTSTRAP_PACKET_FILE_ID", 65536)
    interfaces, members = verify_bundle(archive, packet)
    runtime = {name: Path(os.environ.get("BOOTSTRAP_" + name.upper(), "")) for name in ("node", "git")}
    verify_runtime(runtime, interfaces)
    root = Path(os.environ["BOOTSTRAP_CANDIDATE"]).resolve(strict=True)
    verify_source(runtime["git"], root, json.loads(members["parent-graph.json"]))
    verify_child_sources(runtime["git"], root, json.loads(members["child-graph.json"]))
    print(json.dumps({"candidate": COMMIT, "tree": TREE, "archive": ARCHIVE, "packet": PACKET,
                      "ownerComment": COMMENT, "workflowSha": os.environ["GITHUB_WORKFLOW_SHA"],
                      "admitted": False, "activated": False, "launcherExecuted": False}))


if __name__ == "__main__":
    try:
        main()
    except Exception as exc:
        # Exception classes are safe to emit even when a provider error contains response details.
        raise SystemExit(f"Bootstrap refused ({type(exc).__name__})" +
                         (f": {exc}" if isinstance(exc, ValueError) else "")) from None
