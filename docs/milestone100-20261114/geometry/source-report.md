# Geometry publisher retrieval — review pending

Retrieved on 2026-11-14 through the Firecrawl skill. Five targeted publisher URLs returned HTTP200 and their exact markdown bodies are frozen as `source-volume.md` (OpenStax Prealgebra2e9.6), `source-triangles.md` (9.3), `source-rectangles.md` (9.4), `source-circles.md` (9.5) and `source-angles.md` (NIST SI non-SI units accepted with SI). `source-metadata.json` records exact requested/final URLs, title, scrape ID and available provider cache timestamps. `source-excerpts.json` records SHA256 of each body and exact line excerpts. Provider text may repeat rendered math; equations also appear in image alternative text. No content was invented to fill extraction gaps.

Proposed applicability, pending independent review:

| IDs | Captured evidence | Boundary |
| --- | --- | --- |
|255,278|9.3 Pythagorean theorem, right triangle|Hypotenuse relation; implementation numerical method and inverse guards require software review.|
|256|9.4 triangle area bh/2|Base/height with compatible units.|
|257|9.4 triangle perimeter a+b+c|This does **not** independently source Heron's area or all SSS angle outputs. Partial support only.|
|258|9.3 Pythagorean,9.4 triangle area|Does **not** independently source inverse trigonometry angle outputs. Partial support only.|
|259,260|9.4 rectangle A=LW,P=2L+2W|Compatible lengths.|
|261,262|9.4 rectangle plus equal sides|Square specialization follows L=W; review required.|
|263,264,265|9.5 circle A=πr²,C=2πr,d=2r|Textbook demonstrates approximate π, engine uses binary64 Math.PI.|
|267|9.4 trapezoid A=(b1+b2)h/2|Parallel bases and perpendicular height.|
|269,270|9.6 sphere V=4πr³/3,S=4πr²|Compatible radius units.|
|271|9.6 cylinder V=πr²h|Right circular cylinder.|
|272|9.6 cone V=πr²h/3 and perpendicular-height scope|Right circular cone only.|
|273,274,275|9.6 rectangular solid V=LWH,S=2LH+2LW+2WH|Rectangular prism only; broad volume/surface selectors unsupported.|
|279,280|NIST table exact 1 degree=(π/180)rad|Reverse conversion is algebraic reciprocal; binary64 π approximation remains.|

Unresolved exact source applicability: **266 parallelogram,268 regular polygon,276 coordinate slope,277 coordinate distance**, plus Heron/angle portions of257/258. These five targeted sources do not establish those formulas. ID254 root finder was not researched. This record does not claim 25 complete source decisions or full-scope acceptance.

Percent error234: the previously retrieved official OpenStax Chemistry2e1.5 measurement page discusses accuracy/precision and accepted values but no exact percent-error equation was located. A single targeted publisher search returned full lab-manual PDFs and a whole physics volume rather than a bounded equation page. No broad PDF retrieval was undertaken. `source-percent-error-attempt.json` records these actual results.234 remains blocked on exact authoritative formula provenance.

These are independent captured source bodies and proposed mappings, **not** accepted applicability, human scope approval, canonical certification, engineering completion or publication authority. No source code, registry metadata, build or deployment changed during this source-only followup.
