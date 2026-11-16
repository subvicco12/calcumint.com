/** Independently admitted loaded-image identities; no caller-selected code. */
export const privateGitImages=Object.freeze({
  "worker": {
    "path": "./source-private-git-worker.mjs",
    "sha256": "3738a31a1a551918a3c568dcd50c77bc77d24b186b57f27e17550a2b72b0bc8a"
  },
  "broker": {
    "path": "./source-private-git-broker.py",
    "sha256": "f84e33e129d9e48d56cf182de349acfb05d431fd3f8bfe77f9e114e6c493dd02"
  }
});
for(const image of Object.values(privateGitImages))Object.freeze(image);
