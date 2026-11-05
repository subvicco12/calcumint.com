#!/bin/sh
# Bounded transport recovery only. The caller must verify its immutable checksum.
set -eu
url=${1:?Usage: download-ci-artifact.sh URL DESTINATION}
destination=${2:?Usage: download-ci-artifact.sh URL DESTINATION}
partial="${destination}.download.$$.part"
cleanup() { rm -f "$partial"; }
trap cleanup EXIT
trap 'exit 1' HUP INT TERM
# Two attempts at most. The outer deadline also bounds Retry-After/backoff.
# Leave the destination untouched until a complete HTTP transfer succeeds.
timeout 105s curl --fail --silent --show-error --location \
  --connect-timeout 15 --max-time 50 --retry 1 --retry-all-errors \
  --retry-delay 1 --retry-max-time 100 "$url" -o "$partial"
mv "$partial" "$destination"
