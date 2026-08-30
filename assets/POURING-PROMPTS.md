# Photographic pouring layers

Created with built-in image generation. These are generated product assets, not real café photography.

Final assets: `empty-plastic-cup.png` and `pouring-pitcher.png` in this folder. The pitcher has an alpha channel. The open cup is a black-backed plate; an SVG luminance mask removes its background at runtime. The application composites these with liquid masks and generated latte plates; there is no physical fluid simulation.

## empty

Use case: precise-object-edit. Edit the reference coffee cup into an EMPTY clear thin PET plastic takeaway cup, no drink, no ice, NO LID. Preserve the exact cup silhouette, centered framing, camera position, dimensions and blank circular yellow sticker. Remove all coffee and milk. Clear transparent plastic sides, realistic faint reflections and fine rim detail, entirely empty inside. CRITICAL: true transparent alpha background, including see-through cup interior; no checkerboard drawn, no background of any color, no floor. Soft warm studio product photography. Keep empty cup rim at same location as reference top rim, keep base at same location. No text, no brand logos, no hands.

## pitcher

Use case: product-mockup. One small polished brushed stainless steel barista milk pitcher, tipped toward the LEFT at about 40 degrees, with triangular pointed pouring spout at the LOWER LEFT and curved handle on the RIGHT. Side view from slightly above, realistic warm studio highlights and shadows, beautiful polished metal material. Empty spout, NO LIQUID STREAM, no hands, no text, no logo, no scene. Isolated on a genuinely transparent alpha background. Product photo, not vector. Entire pitcher visible with generous clear margin, square canvas. For compositing over an animated coffee cup.

## Transparency correction

Use case: background-extraction. Remove ALL painted checkerboard pixels from this empty clear cup image, including checkerboard visible THROUGH the cup interior. Deliver actual transparent alpha PNG, transparent inside cup and around outside. Keep only natural plastic reflections, rim and edges, and the opaque round yellow sticker. The empty cup must be transparent and see through so a colored liquid can be composited behind it. Preserve exact cup shape and framing. NO solid background, NO checkerboard texture. This is a transparent overlay asset.
