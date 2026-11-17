#!/usr/bin/env python3
"""Independent mpmath oracle; driven by numerical-oracle.mjs."""
import gzip
import hashlib
import json
import pathlib
import platform
import sys
import mpmath as mp

if mp.__version__ != "1.3.0":
    raise SystemExit("Requires pinned mpmath==1.3.0; no automatic installation")
mp.mp.dps = 90

def precise(value):
    return mp.mpf(value)  # float conversion preserves the exact binary64 input

def digits(value):
    return mp.nstr(value, 90)

def quantile(level):
    return mp.sqrt(2) * mp.erfinv(mp.mpf(level))

request = json.loads(pathlib.Path(sys.argv[3]).read_text())
spec = request["spec"]
assert spec["oracle"]["version"] == mp.__version__
assert spec["oracle"]["decimalDigits"] == mp.mp.dps
critical = request["critical"]
if sys.argv[1] == "prepare":
    witnesses = []
    for row, level in zip(critical, spec["confidenceLevels"]):
        table = precise(row["output"]["criticalValue"])
        ideal = quantile(level)
        target = spec["sampleSizeWitnesses"]["targetInteger"]
        margin = float(mp.sqrt((table**2 + ideal**2) / 2 * mp.mpf(".25") / target))
        witnesses.append({"confidenceLevel": float(level), "marginOfError": margin, "proportion": .5})
    print(json.dumps(witnesses))
    raise SystemExit(0)

outdir = pathlib.Path(sys.argv[2])
normal = request["normal"]
tol = {key: mp.mpf(value) for key, value in spec["tolerances"].items()}
critical_rows = []
for row, level in zip(critical, spec["confidenceLevels"]):
    ideal = quantile(level)
    error = abs(precise(row["output"]["criticalValue"]) - ideal)
    critical_rows.append({**row, "idealCriticalValue": digits(ideal), "absoluteError": digits(error),
                          "passes": bool(error <= tol["criticalValueAbsolute"])})

maxima = {key: {"error": mp.mpf(0), "index": 0} for key in ["cdfAbsolute", "upperTailAbsolute", "pdfRelative"]}
oracle_rows = []
normal_passes = 0
for index, row in enumerate(normal):
    values = row["input"]
    x, mean, sd = (precise(values[k]) for k in ["x", "mean", "standardDeviation"])
    z = (x - mean) / sd
    expected = {"cdf": mp.ncdf(z), "upperTail": mp.ncdf(-z), "pdf": mp.npdf(x, mean, sd)}
    errors = {"cdfAbsolute": abs(precise(row["output"]["cdf"]) - expected["cdf"]),
              "upperTailAbsolute": abs(precise(row["output"]["upperTail"]) - expected["upperTail"]),
              "pdfRelative": abs(precise(row["output"]["pdf"]) - expected["pdf"]) / expected["pdf"]}
    for key, error in errors.items():
        if error > maxima[key]["error"]:
            maxima[key] = {"error": error, "index": index}
        normal_passes += int(error <= tol[key])
    oracle_rows.append({"index": index, "input": values, "exactInputZ": digits(z),
                        "expected": {k: digits(v) for k, v in expected.items()},
                        "errors": {k: digits(v) for k, v in errors.items()}})

grid = normal[:spec["grid"]["pointCount"]]
cdf_monotone = all(a["output"]["cdf"] <= b["output"]["cdf"] for a, b in zip(grid, grid[1:]))
tail_monotone = all(a["output"]["upperTail"] >= b["output"]["upperTail"] for a, b in zip(grid, grid[1:]))
symmetry = max(abs(precise(a["output"]["cdf"]) - precise(b["output"]["upperTail"])) for a, b in zip(grid, reversed(grid)))
complement = max(abs(precise(a["output"]["cdf"]) + precise(a["output"]["upperTail"]) - 1) for a in normal)
witnesses = []
for row, level in zip(request["sampleSize"], spec["confidenceLevels"]):
    values = row["input"]
    ideal = quantile(level)
    p, margin = precise(values["proportion"]), precise(values["marginOfError"])
    ideal_n = ideal**2 * p * (1-p) / margin**2
    ideal_ceiling = int(mp.ceil(ideal_n))
    witnesses.append({**row, "idealCriticalValue": digits(ideal), "idealUnroundedSampleSize": digits(ideal_n),
                      "idealCeiling": ideal_ceiling, "v1MinusIdealCeiling": row["output"]["sampleSize"] - ideal_ceiling})

package_root = pathlib.Path(mp.__file__).parent
package_sources = [{"path": str(path.relative_to(package_root)), "sha256": hashlib.sha256(path.read_bytes()).hexdigest()}
                   for path in sorted(package_root.rglob("*.py"))]
package_digest = hashlib.sha256(json.dumps(package_sources, sort_keys=True).encode()).hexdigest()
checks = [
    all(row["passes"] for row in critical_rows),
    *[value["error"] <= tol[key] for key, value in maxima.items()],
    cdf_monotone, tail_monotone, symmetry <= tol["symmetryAbsolute"], complement <= tol["complementAbsolute"],
    all(row["v1MinusIdealCeiling"] != 0 for row in witnesses),
]
summary = {
    "oracle": {"python": platform.python_version(), "implementation": platform.python_implementation(),
               "mpmath": mp.__version__, "decimalDigits": mp.mp.dps, "packageSourceDigest": package_digest,
               "sourceFiles": package_sources, "quantileFormula": "sqrt(2)*erfinv(confidenceLevel)",
               "normalFunctions": "ncdf(z), ncdf(-z), npdf(x,mean,standardDeviation)",
               "inputSemantics": spec["oracle"]["inputSemantics"]},
    "counts": {"criticalValues": len(critical_rows), "gridPoints": len(grid),
               "locationScaleCases": len(normal)-len(grid), "normalOracleScalarComparisons": len(normal)*3,
               "locationScaleCasesOutsideCaptureZ": sum(abs(row["output"]["zScore"]) > 4 for row in normal[len(grid):]),
               "normalOracleScalarComparisonsPassed": normal_passes, "roundingWitnesses": len(witnesses),
               "aggregateChecks": len(checks), "aggregateChecksPassed": sum(checks)},
    "criticalValues": critical_rows,
    "maxima": {key: {"error": digits(value["error"]), "case": oracle_rows[value["index"]],
                     "engineOutput": normal[value["index"]]["output"], "passes": bool(value["error"] <= tol[key])}
               for key, value in maxima.items()},
    "properties": {"cdfNondecreasing": cdf_monotone, "upperTailNonincreasing": tail_monotone,
                   "maximumCdfUpperTailReflectionResidual": digits(symmetry),
                   "maximumComplementResidual": digits(complement),
                   "atZero": grid[len(grid)//2]["output"]},
    "sampleSizeRoundingWitnesses": witnesses,
    "allDeclaredChecksPass": all(checks),
    "limits": spec["limits"],
}
(outdir / "oracle-values.json.gz").write_bytes(gzip.compress(json.dumps(oracle_rows, separators=(",", ":")).encode()+b"\n", mtime=0))
(outdir / "RESULTS.json").write_text(json.dumps(summary, indent=2)+"\n")
print(json.dumps({"counts": summary["counts"], "maxima": {key: value["error"] for key,value in summary["maxima"].items()},
                  "allDeclaredChecksPass": summary["allDeclaredChecksPass"]}, indent=2))
raise SystemExit(0 if all(checks) else 1)
