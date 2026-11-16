/** Independently admitted loaded-image identities; no caller-selected code. */
export const privateGitImages=Object.freeze({
  "worker": {
    "path": "./source-private-git-worker.mjs",
    "sha256": "3738a31a1a551918a3c568dcd50c77bc77d24b186b57f27e17550a2b72b0bc8a"
  },
  "broker": {
    "path": "./source-private-git-broker.py",
    "sha256": "7f5f8b8846e6b2baa1f89168020ebad70271792aa33f27c640b6e34c5f1c7c07"
  }
});
for(const image of Object.values(privateGitImages))Object.freeze(image);
