#!/usr/bin/env bash
# Disposable runner setup only. The application never runs this privileged step.
set -euo pipefail
: "${RUNNER_TEMP:?}"
receipt="$RUNNER_TEMP/mass426-setup.json"
stage=runner-platform
failed() {
  # Fixed categories only: no command, URL, environment, config or provider body.
  printf '{"schema":"calcumint.mass426.setup.v1","passed":false,"category":"%s"}\n' "$stage" > "$receipt"
}
trap failed ERR
source /etc/os-release
[[ "$ID" == ubuntu && "$VERSION_ID" == 26.04 && "$(dpkg --print-architecture)" == amd64 ]]
stage=pdf-provision
packages=$(mktemp -d "$RUNNER_TEMP/mass426-poppler.XXXXXX")
chmod 755 "$packages"
curl --fail --silent --show-error --proto '=https' --max-time 60 \
  https://archive.ubuntu.com/ubuntu/pool/main/p/poppler/poppler-utils_26.01.0-2build2_amd64.deb -o "$packages/poppler-utils.deb"
curl --fail --silent --show-error --proto '=https' --max-time 60 \
  https://archive.ubuntu.com/ubuntu/pool/main/p/poppler/libpoppler156_26.01.0-2build2_amd64.deb -o "$packages/libpoppler156.deb"
printf '%s  %s\n' c66deffe8f9f496ef6c218f0f668e6f14032e8860034edfb7b2fa6fcdc3ff9c3 "$packages/poppler-utils.deb" \
  36d7d4ed95a1b601f13552f2b7432482733258ca9b0a6e27019c93110f75885b "$packages/libpoppler156.deb" | sha256sum --check --strict
sudo -n apt-get update -qq
sudo -n apt-get install -y --no-install-recommends "$packages/poppler-utils.deb" "$packages/libpoppler156.deb"
[[ "$(dpkg-query -W -f='${Version}' poppler-utils)" == 26.01.0-2build2 ]]
[[ "$(dpkg-query -W -f='${Version}' libpoppler156)" == 26.01.0-2build2 ]]
stage=tool-resolution
trap - ERR
python3 -I "$(dirname "$0")/mass426_setup.py" --output "$receipt"
