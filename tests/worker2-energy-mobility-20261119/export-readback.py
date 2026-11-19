"""Reconcile each actual Chromium download with its immutable v1 packet."""
import csv
import hashlib
import json
from pathlib import Path
import re
import subprocess
import sys

root = Path(sys.argv[1]).resolve()
receipt = json.loads((root / "receipt.json").read_text())
assert receipt["passed"]
downloads = {}
for row in receipt["downloads"]:
    file = (root / row["file"]).resolve()
    assert file.is_relative_to(root)
    data = file.read_bytes()
    assert len(data) == row["bytes"]
    assert hashlib.sha256(data).hexdigest() == row["sha256"]
    downloads[row["id"], row["format"]] = file

ids = [459, 460, 461, 462, 463, 464, 478, 479]
assert set(downloads) == {(catalog_id, fmt) for catalog_id in ids for fmt in ("json", "csv", "pdf")}
results = []
for catalog_id in ids:
    report = json.loads(downloads[catalog_id, "json"].read_text())
    assert report["kind"] == "calcumint.scoped-report" and report["reportVersion"] == 1
    packet = report["packet"]
    identity = packet["identity"]
    assert identity["catalogId"] == catalog_id and identity["calculatorVersion"] == 1
    assert identity["sourceVersion"] == f'private.worker2.energy-mobility.20261119.1/{identity["engineId"]}@1'
    assert report["metadata"]["identity"] == identity
    output = packet["snapshot"]["output"]
    with downloads[catalog_id, "csv"].open(newline="") as handle:
        cells = {(row["section"], row["field"]): row["value"] for row in csv.DictReader(handle, strict=True)}
    assert json.loads(cells["input", "identity"]) == identity
    assert json.loads(cells["input", "raw"]) == packet["raw"]
    assert json.loads(cells["input", "input"]) == packet["snapshot"]["input"]
    assert json.loads(cells["input", "scopedMetadata"]) == report["metadata"]
    assert json.loads(cells["output", "steps"]) == output["steps"]

    pdf = downloads[catalog_id, "pdf"]
    info = subprocess.check_output(["pdfinfo", str(pdf)], text=True, timeout=10)
    assert re.search(r"^Tagged:\s+yes$", info, re.MULTILINE)
    text = subprocess.check_output(["pdftotext", str(pdf), "-"], text=True, timeout=10)
    assert "Engine version: 1" in text
    numeric = {}
    for key, value in output.items():
        if isinstance(value, (int, float)):
            assert float(cells["output", key]) == value
            match = re.search(r'output\["' + re.escape(key) + r'"\]\s*=\s*([-+0-9.eE]+)', text)
            assert match and float(match[1]) == value
            numeric[key] = value
    assert numeric
    results.append({"id": catalog_id, "engine": identity["engineId"], "version": 1,
                    "numericOutputs": numeric, "jsonCsvPdfAgree": True})

print(json.dumps({"passed": True, "downloadsVerified": len(downloads), "results": results}, indent=2))
