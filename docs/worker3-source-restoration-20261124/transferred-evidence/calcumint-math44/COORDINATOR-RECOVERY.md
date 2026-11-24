# CalcuMint coordinator recovery

Use the existing shared evidence root `/workspace/shared/downloads`. The consolidated manifest is `calcumint-math44/worker3-intake.json`. The adjacent `bundle-order.json` lists every bundle in restoration order, its SHA-256, every advertised ref, exact commit and tree, and required Git prerequisites. The full chain starts with a self-contained bundle. Use a new bare repository.

The coordinator needs read access to the manifest, Python verifier, checksum file, all 24 enumerated bundle files and referenced evidence folders. The shared directories currently use mode 0700 and these manifest/bundle files use mode 0600 under agent:agent. A separate principal needs a scoped owner-authorized read/traverse grant or access through the existing authorized evidence mount. The verifier needs Python 3.11 or newer, Git and local write permission for the new bare repository. Repository settings, credentials and deployment access are unnecessary. If the shared root is mounted elsewhere, pass the coordinator's exact mount path as the second script argument.

```bash
evidence=/workspace/shared/downloads
handoff="$evidence/calcumint-math44"
(cd "$handoff" && sha256sum -c SHA256SUMS)
recovery=$(mktemp -d)
git init --bare "$recovery"
python3 "$handoff/restore-bundles.py" "$recovery" "$evidence" > "$recovery/verified-recovery.json"
```

Return the verified-recovery receipt to acknowledge independent retrieval. On a missing path, report the exact inaccessible path and required read/traverse permission. An originating-workspace restoration receipt is included. Independent coordinator retrieval and acknowledgment remain pending. This procedure creates local recovery refs. Source admission, integration, certification and release require their separate authorized decisions.
