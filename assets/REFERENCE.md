# Sunny Smiles height reference

The supplied `sunny_smiles_front.png` is RGB, 760×1360, with an opaque grey background. The original is unchanged. A transparent cutout was produced with the image-editing tool and copied into this project as `sunny-smiles-reference.png` (RGBA, 938×1677). The HTML embeds the PNG as a data URI, so it remains self-contained and works offline.

The renderer uses visible source bounds (205, 68, 508, 1500) to exclude near-transparent noise outside the character. A single scale factor is applied to both axes. Hair-to-lowest-boot image height is fitted to the nominal reference height, not the entire padded PNG canvas. The figure's lowest boot sits on the ground line. “Height Reference” is drawn vertically next to her.

Height basis:

- [GECK Units](https://geckwiki.com/index.php?title=Units) describes **128 units as an approximate standard human height**. This is a nominal authoring convention, not a measurement of Sunny's rendered mesh.
- Read-only inspection of the installed vanilla `FalloutNV.esm` found NPC `GSSunnySmiles` (FormID 00104E84), placed actor `SunnyRef` (00104E85), with `XSCL = 0.949999988079071` (0.95).
- Reference display height is consequently **≈121.6 units**, calculated as 128×0.95. The UI uses an approximation marker. No game master, mod record or installed asset was edited.

Sunny's reference height is fixed independently of the imported sprite's `referenceCanvasHeightUnits` calibration. Preview zoom applies to both reference and sprite, preserving both aspect ratios. Reference visibility, zoom and backgrounds remain preview settings; Sunny is not included in Source Pack media or geometry.
