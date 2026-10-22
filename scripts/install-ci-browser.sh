#!/bin/sh
# Install a fixed offline-test browser; never launch a warm-up browser or retry startup.
set -eu
parent=${1:?Usage: install-ci-browser.sh TEMP_PARENT}
fixture=$(mktemp -d "$parent/calcumint-ci-browser.XXXXXX")
archive="$fixture/browser.deb"
succeeded=false
cleanup() {
  rm -f "$archive"
  if [ "$succeeded" != true ]; then rm -rf "$fixture"; fi
}
trap cleanup EXIT
trap 'exit 1' HUP INT TERM
url='https://dl.google.com/linux/chrome/deb/pool/main/g/google-chrome-stable/google-chrome-stable_156.0.8078.47-1_amd64.deb'
checksum='6c92cd22e90c6e3e255d782991543fa2091db8614e8536a971a7433a5c4d7ac8'
curl --fail --silent --show-error --location --connect-timeout 15 --max-time 120 "$url" -o "$archive"
if ! printf '%s  %s\n' "$checksum" "$archive" | sha256sum --check --status; then
  echo 'Pinned CI browser checksum mismatch' >&2
  exit 1
fi
timeout 120s dpkg-deb --extract "$archive" "$fixture"
browser="$fixture/opt/google/chrome/chrome"
test -x "$browser"
succeeded=true
printf '%s\n' "$browser"
