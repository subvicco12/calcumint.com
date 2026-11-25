# #426 focused Ripgrep recovery

## Exact finding and limits

Failed run45636694153 used d93f3b4b986401ca7bae91961360985818bbc7b8. Preparation, pinned PDF/browser provisioning, Node verification and private workspace setup succeeded. Application UID/GID65534 then called unchanged runtime.mjs execFileSync('rg',['--files','src','data'],{cwd:root,encoding:'utf8'}). Node returned spawnSync rg EACCES at runtime.mjs20. No browser journey/export occurred.

The runtime inherited the runner's PATH but neither provisioned rg nor checked it after changing identity. No retained which/command-v output, resolved rg path, parent modes, ACL or mount record exists. Therefore the precise historical absolute path cannot honestly be reconstructed. execvp EACCES is compatible with a non-executable rg, a non-traversable PATH parent, or execution restrictions; it is not proof that an installed executable was found. Exact runner ubuntu-26.04/20261116.202.1 metadata does not advertise Ripgrep and its inspected apt lists do not explicitly provision it; this does not establish the complete historical filesystem. No particular home directory or noexec policy is invented as the cause.

Before-remediation evidence reproduces real Node EACCES with an executable at a denied parent and a non-executable rg file under genuine namespace UID/GID65534. Paths and errno receipts are retained. These are explicit reproductions, not recovered historical runner paths.

## Small correction

Stage official Ripgrep14.1.1 x86_64-musl release in the already-created private workspace tools directory. Archive SHA2564cf9f2741e6c465ffdb7c26f38056a59e2a2544b51f7cc128ef28337eeae4d8e; binary SHA256f401154e2393f9002ac77e419f9ee5521c18f4f8cd3e32293972f493ba06fce7. Extract only the exact regular member after both hashes match; refuse pre-existing destinations/symlinks. Directory and binary modes0555; tools remain runner-owned in the proposed workflow and are excluded from application chown.

Replace inherited PATH with private-tools:pinned-Node-directory:/usr/local/bin:/usr/bin:/bin. Run the check under the same setpriv UID/GID65534/clear-groups/no-new-privs/env-i boundary as the unchanged driver. Require exact resolved rg path, binary digest/version, non-writable tools, successful source enumeration, zero effective capabilities, no provider credentials and inaccessible Docker socket before acceptance starts. No fallback file walker, altered rg flags, skipped digest or relaxed refusal.

Original runtime, fixture, calculation engine, rounding/refusal and historical replay implementation are byte-identical. PDF/browser provisioning, Node22.23.4 executable hash94efd062ed066c1a0b332e18249859c905e920eeada5df55d24c99b919629a90, service images, job timeouts and all existing application security assertions remain unchanged.

## Executed evidence

Two focused staging unit tests pass; ten real local qualification cases pass. These cover two EACCES reproductions; successful unprivileged pinned execution; complete source/checksum equivalence; provider environment injection refusal; inaccessible/wrong PATH refusal; readable synthetic Docker-path refusal with the real host socket masked; tampered binary refusal before execution; hidden/ignored files and digest sensitivity; valid-archive existing/symlink destination refusal.

Node22.23.4 executed in an existing rootless Bubblewrap user/PID/network namespace. Actual namespace UID/GID65534 and sole group65534 map to existing host UID/GID1000, recorded in receipt. Zero effective capabilities, no-new-privs, read-only filesystem, /run masked, only evidence writable. No Docker API or real socket was passed into this fixture. This is actual Linux identity/permission execution, but not GitHub-hosted or native-host UID65534 qualification. No new infrastructure, service or credentials were created. Earlier unmasked namespace probe correctly refused because the shared workspace socket was accessible; no daemon connection was made and assertions were retained.

Exactly2183 src/data files plus next.config.ts match exact Git blobs at fixture bab4fd87e91309b15cce9600d81ec523f645f158/tree dac8a76d9ad2745e673d3194ec9da0b37905b6bb. Existing local rg15.2.0 and pinned14.1.1 enumerate the same set and per-fileSHA256 values. Canonical manifest SHA256 ce884cadd5a2340fb5e1c2a59086d61b03fc9feb05b1b68cb6c0bd066944df20. Traversal order is not claimed byte-identical; original per-file digest construction and runtime checks remain unchanged. Python/Node syntax, workflow YAML/embedded bash and whitespace checks pass. No completed PostgreSQL, PDF/browser setup or broad application campaign was rerun.

## Remaining gates

#426 remains IMPLEMENTED_NOT_ACCEPTED: zero newly completed authenticated browser journeys or JSON/CSV/PDF readbacks. Deduplicated portfolio remains274 bounded private contracts. Preserve the original12 PostgreSQL receipts (artifact14987606015 SHA256a1098236906e43035e80390bd9b1bbf8254d9873c424b929352870000f907560); this change does not affect their implementation, and no PostgreSQL tests repeated.

This is an isolated engineering candidate, NOT an authorized executable successor. Existing workflow guards and provider source bindings are deliberately unchanged and still target the frozen d93 recovery ref; this new head cannot be dispatched on that protected ref. Fresh exact-head/ref/variable binding and owner-authorized hosted execution require a separately reviewed package; no old authorization is reusable and no frozen-ref update is permitted. No registration/configuration operation or dispatch occurred. Native GitHub UID/GID65534 acceptance still must demonstrate three authenticated plans, exact replay, ownership/entitlement isolation and actual native exports. Provider google-userinfo401 remains separately unresolved; see Work packet. No source admission, activation, publication or production permission follows from these tests.
