#!/usr/bin/env python3
"""Offline archive verification only. Never execute bundled scripts or fetch URLs."""
import hashlib
import json
from pathlib import Path, PurePosixPath
import zipfile

ROOT = Path(__file__).resolve().parent.parent
ARCHIVE = ROOT / "data/catalog/source-driven-2026-10-27/input-package.zip"
EXPECTED = "80226cfdf3d9bd2a5aba4d6e8ff4a49077d61533b20c459f0d54b3bba51797d5"

def verify():
    assert hashlib.sha256(ARCHIVE.read_bytes()).hexdigest() == EXPECTED, "Input archive checksum mismatch"
    with zipfile.ZipFile(ARCHIVE) as archive:
        names = archive.namelist()
        assert len(names) == len(set(names)), "Duplicate archive entries"
        assert all(not PurePosixPath(n).is_absolute() and ".." not in PurePosixPath(n).parts for n in names)
        assert sum(i.file_size for i in archive.infolist()) < 16 * 1024 * 1024
        assert archive.testzip() is None, "CRC mismatch"
        manifests = {}
        for name in ["MANIFEST-SHA256.json", "input-evidence/MANIFEST-SHA256.json"]:
            manifest = json.loads(archive.read(name))
            prefix = "" if name == "MANIFEST-SHA256.json" else "input-evidence/"
            for path, digest in manifest.items():
                assert hashlib.sha256(archive.read(prefix + path)).hexdigest() == digest, (name, path)
            manifests[name] = manifest
        assert set(manifests["MANIFEST-SHA256.json"]) == set(names) - {"MANIFEST-SHA256.json"}
        register = json.loads(archive.read("methodology-decision-register-50.json"))
        tasks = json.loads(archive.read("codex-tasks-50.json"))
        rows = register["rows"]
        ids = [r["masterId"] for r in rows]
        assert len(ids) == len(set(ids)) == 50
        assert [r["masterId"] for r in tasks["rows"]] == ids
        assert all(r["approval"] == "PENDING" and not r["scopeAdopted"] and not r["actualEngineAcceptance"] and not r["evidenceComplete"] for r in rows)
        missing = json.loads(archive.read("missing-source-cases-9.json"))
        retained = json.loads(archive.read("retained-qualified-cases-11.json"))["rows"]
        cohorts = [set(ids), {r["masterId"] for r in missing}, {r["masterId"] for r in retained}]
        assert [len(c) for c in cohorts] == [50, 9, 11]
        assert len(set.union(*cohorts)) == 70
        baseline = json.loads(archive.read("input-evidence/baseline-readiness-register.json"))
        assert set.union(*cohorts) == {r["masterId"] for r in baseline["rows"]}
        matrix = json.loads(archive.read("input-evidence/source-verification-matrix.json"))["rows"]
        for row in matrix:
            canonical = json.dumps(row["observationRecord"], sort_keys=True, ensure_ascii=False).encode()
            assert hashlib.sha256(canonical).hexdigest() == row["observationRecordSHA256"], row["sourceOrdinal"]
        return {"ids": ids, "cases": len(rows), "rootManifestEntries": len(manifests["MANIFEST-SHA256.json"]), "nestedManifestEntries": len(manifests["input-evidence/MANIFEST-SHA256.json"]), "sourceObservations": len(matrix), "readableSourceObservations": sum(r["substantiveRelevantContentVerified"] for r in matrix), "retainedQualifiedCases": len(retained), "missingSourceCases": len(missing)}

if __name__ == "__main__":
    print(json.dumps(verify()))
