"""Regenerate the checked-in font data with fontTools 4.61.1; no runtime font dependency.
Usage: python generate.py /path/to/DejaVuSansMono.ttf
Source: Debian fonts-dejavu-core 2.37, covered by adjacent LICENSE.txt.
"""
import base64
import hashlib
import io
import json
from pathlib import Path
import sys
import zlib
from fontTools.ttLib import TTFont
from fontTools import subset

source = Path(sys.argv[1])
font = TTFont(source, recalcTimestamp=False)
options = subset.Options()
options.retain_gids = True
subsetter = subset.Subsetter(options=options)
subsetter.populate(unicodes=range(0x10000))
subsetter.subset(font)
stream = io.BytesIO()
font.save(stream)
data = stream.getvalue()
glyphs = {code: font.getGlyphID(name) for code, name in font.getBestCmap().items() if code <= 65535}
Path(__file__).with_name('dejavu-mono.ts').write_text(
    '// Generated DejaVu Sans Mono BMP glyphs; see LICENSE.txt and generate.py.\n'
    f'// Source SHA256: {hashlib.sha256(source.read_bytes()).hexdigest()}\n'
    'export const fontData = ' + json.dumps(base64.b64encode(zlib.compress(data, 9)).decode()) + ';\n'
    f'export const fontByteLength = {len(data)};\n'
    'export const unicodeGlyphs: Readonly<Record<number, number>> = ' + json.dumps(glyphs, separators=(',', ':')) + ';\n'
)
