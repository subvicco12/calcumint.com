import json
import os
from pathlib import Path
import shutil
from tempfile import TemporaryDirectory
from unittest import TestCase, mock

import bootstrap as b


class BootstrapTests(TestCase):
    def context(self):
        sha = "1" * 40
        return {"TRUSTED_WORKFLOW_SHA": sha, "GITHUB_REPOSITORY": b.REPO,
                "GITHUB_EVENT_NAME": "workflow_dispatch", "GITHUB_REF": b.REF,
                "GITHUB_REF_PROTECTED": "true", "GITHUB_WORKFLOW_REF": f"{b.REPO}/{b.WORKFLOW}@{b.REF}",
                "GITHUB_WORKFLOW_SHA": sha, "GITHUB_SHA": sha,
                "BOOTSTRAP_ENVIRONMENT": b.ENVIRONMENT, "BOOTSTRAP_PREPARATION_ONLY": "true"}

    def test_trusted_context(self):
        b.verify_context(self.context())

    def test_unauthorized_reference_environment_and_activation(self):
        for key, value in [("GITHUB_WORKFLOW_SHA", "2" * 40), ("GITHUB_REF", "refs/heads/main"),
                           ("GITHUB_REF_PROTECTED", "false"), ("BOOTSTRAP_ENVIRONMENT", "copilot"),
                           ("BOOTSTRAP_PREPARATION_ONLY", "false")]:
            with self.subTest(key=key), self.assertRaises(ValueError):
                b.verify_context({**self.context(), key: value})

    def test_unapproved_candidate_or_tree(self):
        b.verify_candidate(b.COMMIT, b.TREE)
        for pair in [("0" * 40, b.TREE), (b.COMMIT, "0" * 40)]:
            with self.subTest(pair=pair), self.assertRaisesRegex(ValueError, "Unapproved"):
                b.verify_candidate(*pair)

    def test_package_and_packet_digest(self):
        with self.assertRaisesRegex(ValueError, "Source package digest"):
            b.verify_bundle(b"wrong", b"wrong")
        with mock.patch.object(b, "ARCHIVE", b.digest(b"fixture")):
            with self.assertRaisesRegex(ValueError, "Admission packet digest"):
                b.verify_bundle(b"fixture", b"wrong")

    def test_missing_or_invalid_owner_approval(self):
        profile = {"user": {"emailAddress": "subvicco12@gmail.com", "displayName": b.OWNER}}
        with self.assertRaisesRegex(ValueError, "Missing or deleted"):
            b.verify_owner({}, profile)
        comment = {"id": b.COMMENT, "deleted": False, "author": {"me": True, "displayName": b.OWNER},
                   "content": "APPROVE other bytes"}
        with self.assertRaisesRegex(ValueError, "approval text"):
            b.verify_owner(comment, profile)
        with self.assertRaisesRegex(ValueError, "Wrong comment author"):
            b.verify_owner({**comment, "author": {"me": False}}, profile)
        with self.assertRaisesRegex(ValueError, "Wrong connected"):
            b.verify_owner(comment, {})

    def test_unexpected_import(self):
        graph = {"files": [{"path": "entry.mjs"}],
                 "edges": [{"from": "entry.mjs", "to": "unexpected.mjs"}]}
        with self.assertRaisesRegex(ValueError, "Unexpected import target"):
            b.inspect_module_graph(graph, {"modules": 1, "records": 1})

    def test_moving_head_and_live_source_substitution(self):
        original = b"source"
        with TemporaryDirectory() as directory:
            root = Path(directory)
            (root / "scope.mjs").write_bytes(original)
            parent = {"files": [], "proposal": {"path": "scope.mjs", "blob": "3"*40,
                                               "bytes": len(original), "sha256": b.digest(original)}}
            heads = iter([b.COMMIT, "4" * 40])
            def moving(git, checkout, args):
                if args == ("rev-parse", "HEAD"):
                    return next(heads).encode()
                if args == ("rev-parse", "HEAD^{tree}"):
                    return b.TREE.encode()
                if args[0] == "rev-parse":
                    return b"3"*40
                return original
            with mock.patch.object(b, "candidate_git", moving):
                with self.assertRaisesRegex(ValueError, "Unapproved candidate"):
                    b.verify_source(Path("/usr/bin/git"), root, parent)
            heads = iter([b.COMMIT])
            (root / "scope.mjs").write_bytes(b"substitution")
            with mock.patch.object(b, "candidate_git", moving):
                with self.assertRaisesRegex(ValueError, "Source substitution"):
                    b.verify_source(Path("/usr/bin/git"), root, parent)

    def test_fresh_process_and_modified_launcher_or_runtime(self):
        launcher = b"if (process.env.BOOTSTRAP_DRIVE_TOKEN || process.env.NODE_OPTIONS) process.exit(9);"
        graph = json.dumps({"fixture": True}).encode()
        paths = {name: Path(shutil.which(name)).resolve() for name in ("node", "git")}
        runtime = {name: {"bytes": path.stat().st_size, "sha256": b.digest(path.read_bytes())}
                   for name, path in paths.items()}
        interfaces = {"runtime": runtime, "parentLauncher": {"sha256": b.digest(launcher)},
                      "importGraphs": {"parent": {"sha256": b.digest(graph)}}}
        members = {"launch.mjs": launcher, "parent-graph.json": graph}
        with mock.patch.dict(os.environ, {"BOOTSTRAP_DRIVE_TOKEN": "fixture", "NODE_OPTIONS": "--invalid"}):
            self.assertEqual(b.run_verified_launcher(Path.cwd(), paths, interfaces, members), 0)
        with self.assertRaisesRegex(ValueError, "Launcher digest"):
            b.run_verified_launcher(Path.cwd(), paths, interfaces, {**members, "launch.mjs": b"wrong"})
        with self.assertRaisesRegex(ValueError, "node (size|digest) differs"):
            b.run_verified_launcher(Path.cwd(), {**paths, "node": paths["git"]}, interfaces, members)
