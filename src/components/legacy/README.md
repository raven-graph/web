# Legacy landing components

Earlier versions of the landing page, kept in case we revert. Nothing imports
these from `src/app`.

- `Product.tsx`, `BlindSpot.tsx`: sections from the "risk and liquidity API
  for crypto payments" page.
- `Hero.tsx`, `HeroSchematic.tsx`, `NetworkBackground.tsx`,
  `ShockSimulator.tsx`, `Thesis.tsx`, `WhyItScales.tsx`, `Status.tsx`,
  `Team.tsx`, `Kicker.tsx`, `CtaLink.tsx`, `EdgeTape.tsx`: the first
  "world model" page (dark, cards, eyebrows, animated figures, shock
  simulator). The simulator's edge weights and lags are invented examples.
- `PathFigure.tsx`: the figure from the dark single-column version.

Figure data for these lives in `src/lib/landing/figures.ts`.
