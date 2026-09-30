# Roadmap

CrackCheck is an early-stage project. This roadmap distinguishes the deployed application from work that remains.

## In the current source

- Static TypeScript/Vite browser app with Russian and English UI strings.
- `zxcvbn-ts` analysis using common, English, and official Russian package dictionaries.
- JCUKEN graph in `src/russianGraph.json`, generated from upstream commit `5782aa3` and integrated locally.
- Transliteration candidate analysis for Cyrillic runs, selected only when a sufficiently long dictionary match produces a lower estimate.
- Account and educational WPA2-Personal modes.
- Separate, user-triggered HIBP Pwned Passwords range check.

These are implementation facts, not a claim that the current build has passed an independent security review. The application is deployed at https://hleserg.github.io/crackcheck/.

## Release checks completed

- Typecheck, lint, 12 unit tests, 3 browser tests, and production build passed locally and in CI.
- Browser tests verified that local input sends no network requests after load and leaves no password in persistent storage, URL, or rendered page text.
- GitHub Pages is live at https://hleserg.github.io/crackcheck/.

## Next priorities

- Audit package and dictionary licenses and notices; follow up upstream on the missing ODC-BY notice and unpinned FakerJS revision in `@zxcvbn-ts/language-ru@4.1.0`.
- Review score explanations and translations for accuracy and accessibility on keyboard, mobile, and dark/light themes.

## Later work

- Clarify Russian name and surname data provenance with upstream maintainers; choose a distributable source and preserve its data license.
- Validate the JCUKEN graph against upstream generator conventions and submit a focused upstream contribution if appropriate.
- Evaluate Russian reverse-layout matching (`привет` typed as `ghbdtn`) and Cyrillic/Latin homoglyph matching as separate, evidence-based changes.
- Maintain dependency updates and a release process with an inventory of bundled data notices.

Raw leaked password lists are not a roadmap item. Research findings may inform aggregate pattern design, but leaked credentials must not be bundled.
