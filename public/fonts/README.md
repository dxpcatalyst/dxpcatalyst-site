# Fonts

Gilroy is the brand typeface (see `docs/dxpcatalyst-design-tokens.pdf` §2).
It is a **commercial font** and is not committed to the repo.

## Add the font files

Drop these five files into this directory:

- `Gilroy-Light.ttf` (weight 300)
- `Gilroy-Regular.ttf` (weight 400)
- `Gilroy-Medium.ttf` (weight 500)
- `Gilroy-Bold.ttf` (weight 700)
- `Gilroy-Heavy.ttf` (weight 900)

## Activate

The real config already lives in `lib/fonts.ts`. Once the files are present:

1. In `app/layout.tsx`, replace the interim font import with:
   ```ts
   import { gilroy } from '@/lib/fonts';
   ```
   and use `gilroy.variable` on the `<html>` element.
2. Remove the interim `next/font/google` import.

Tailwind's `font-sans` already maps to `var(--font-gilroy)`, so no Tailwind
change is needed.
