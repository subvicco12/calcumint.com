"""Verify native bytes against the browser receipt and reconcile JSON, CSV and PDF."""
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

results = []
for catalog_id, engine in [(475, "automotive.horsepower"), (476, "automotive.engine-horsepower")]:
    export = json.loads(downloads[catalog_id, "json"].read_text())
    assert export["kind"] == "calcumint.scoped-report" and export["reportVersion"] == 1
    document = export["packet"]
    identity = document["identity"]
    assert identity["catalogId"] == catalog_id and identity["engineId"] == engine
    assert identity["calculatorVersion"] == 1
    assert identity["sourceVersion"] == f"private.worker2.automotive-power.20261118.1/{engine}@1"
    output = document["snapshot"]["output"]
    with downloads[catalog_id, "csv"].open(newline="") as handle:
        cells = {(row["section"], row["field"]): row["value"] for row in csv.DictReader(handle, strict=True)}
    assert json.loads(cells["input", "identity"]) == identity
    assert json.loads(cells["input", "raw"]) == document["raw"]
    assert json.loads(cells["input", "input"]) == document["snapshot"]["input"]
    assert json.loads(cells["input", "scopedMetadata"])["outputs"]["horsepower"]["unit"] == "mechanical hp"
    assert float(cells["output", "horsepower"]) == output["horsepower"]
    assert json.loads(cells["output", "steps"]) == output["steps"]

    pdf_file = downloads[catalog_id, "pdf"]
    info = subprocess.check_output(["pdfinfo", str(pdf_file)], text=True, timeout=10)
    assert re.search(r"^Tagged:\s+yes$", info, re.MULTILINE)
    text = subprocess.check_output(["pdftotext", str(pdf_file), "-"], text=True, timeout=10)
    assert "Engine version: 1" in text and "mechanical hp" in text
    number = re.search(r'output\["horsepower"\]\s*=\s*([-+0-9.eE]+)', text)
    assert number and float(number[1]) == output["horsepower"]
    results.append({"id": catalog_id, "horsepower": output["horsepower"], "jsonCsvPdfAgree": True})

historical = json.loads(downloads[475, "historical-json"].read_text())
assert historical["calculatorSlug"] == "horsepower-calculator" and historical["calculatorVersion"] == 1
assert historical["input"] == {"kilowatts": 1e-70}
assert historical["output"]["horsepower"] == 1e-70 * 1000 / 745.6999
assert len(downloads) == 7
print(json.dumps({"passed": True, "downloadsVerified": len(downloads), "results": results,
                  "historicalReadback": historical}, indent=2))
