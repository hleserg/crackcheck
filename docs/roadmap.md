# Roadmap

CrackCheck is an early-stage project. This roadmap distinguishes the deployed application from work that remains.

## In the current source

- Static TypeScript/Vite browser app with Russian and English UI strings.
- `zxcvbn-ts` analysis using common, English, and official Russian package dictionaries.
- JCUKEN graph in `src/russianGraph.json`, generated from upstream commit `5782aa3` and integrated locally.
- Transliteration candidate analysis requires exact `commonWords-ru` evidence for every Cyrillic run of at least four letters, and selects a lower zxcvbn-ts estimate.
- Account and educational WPA2-Personal modes.
- Separate, user-triggered HIBP Pwned Passwords range check.

These are implementation facts, not a claim that the current build has passed an independent security review. The application is deployed at https://hleserg.github.io/crackcheck/.

## Release checks completed

- Typecheck, lint, 12 unit tests, 3 browser tests, and production build passed locally and in CI.
- Browser tests verified that local input sends no network requests after load and leaves no password in persistent storage, URL, or rendered page text.
- GitHub Pages is live at https://hleserg.github.io/crackcheck/.

## Next priorities

- Follow [upstream PR #346](https://github.com/zxcvbn-ts/zxcvbn/pull/346) for the ODC-BY/Faker notices and pinned source revision; audit the optional Wikipedia-derived lists separately.
- Review score explanations and translations for accuracy and accessibility on keyboard, mobile, and dark/light themes.

## Later work

- Clarify Russian name and surname data provenance with upstream maintainers; choose a distributable source and preserve its data license.
- Follow [upstream PR #345](https://github.com/zxcvbn-ts/zxcvbn/pull/345) for the JCUKEN graph and switch to the official release if merged.
- Evaluate Russian reverse-layout matching (`привет` typed as `ghbdtn`) and Cyrillic/Latin homoglyph matching as separate, evidence-based changes.
- Maintain dependency updates and a release process with an inventory of bundled data notices.

Raw leaked password lists are not a roadmap item. Research findings may inform aggregate pattern design, but leaked credentials must not be bundled.
