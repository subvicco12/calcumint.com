# Finite historical engineering review counterexample

This manual reproduction isolates the actual unchanged proveCurrentSourceEvolution function from immutable f41f3255facac47406be9c94912edade5cce760f source, as active at de32bd48abc033a953f4b1be12dad9d9f93a4dae. Its source hash is explicitly checked. It redirects only an in-memory capture, the one permitted metadata consumer's three guard fields and the target guard reader to exact cd460392 predecessor bytes. That historical proof accepts the coupled redirection.

This demonstrates why the metadata598 literal hash alone does not independently anchor the selected guard revision. It is a finite engineering review observation, not application acceptance, production behavior or a test of the later external mandatory anchor. Root is implementing that separate anchor and negative acceptance. Original files and historical packets are not rewritten by this script.

Command from repository root:

    node docs/first-five-20261109/ci-recovery/source-evolution/review-counterexample.mjs

The script requires local historical Git objects, including cd460392. It is manual review evidence only and adds no mandatory CI/bootstrap source-reference requirement. It performs local reads and in-memory evaluation only; no network, production, credential, SQL, build or file mutation occurs. Its raw stdout is retained in review-counterexample.log. Later root changes may fix the independent boundary; this immutable historical observation must not be relabelled as a current failure after that fix.
