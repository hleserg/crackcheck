# Roadmap

CrackCheck is an early-stage project. This roadmap distinguishes source code currently present from work needed before a public release.

## In the current source

- Static TypeScript/Vite browser app with Russian and English UI strings.
- `zxcvbn-ts` analysis using common, English, and official Russian package dictionaries.
- JCUKEN graph in `src/russianGraph.json`, generated from upstream commit `d72e679` and integrated locally.
- Transliteration candidate analysis for Cyrillic runs, selected only when the Russian dictionary match produces a lower estimate.
- Account and educational WPA2-Personal modes.
- Separate, user-triggered HIBP Pwned Passwords range check.

These are implementation facts, not claims that the current build has passed a complete security review or is deployed publicly.

## Before describing a public release

- Run and resolve the relevant type, lint, test, and production-build checks.
- Verify privacy behavior in a built application: local analysis makes no network calls, the password enters no persistent storage or URL, and output rendering handles user-controlled text safely.
- Audit package and dictionary licenses and notices; follow up upstream on the missing ODC-BY notice and unpinned FakerJS revision in `@zxcvbn-ts/language-ru@4.1.0`.
- Review score explanations and translations for accuracy and accessibility on keyboard, mobile, and dark/light themes.
- Document the actual deployment address and hosting behavior only after it exists and has been checked.

## Later work

- Clarify Russian name and surname data provenance with upstream maintainers; choose a distributable source and preserve its data license.
- Validate the JCUKEN graph against upstream generator conventions and submit a focused upstream contribution if appropriate.
- Evaluate Russian reverse-layout matching (`привет` typed as `ghbdtn`) and Cyrillic/Latin homoglyph matching as separate, evidence-based changes.
- Maintain dependency updates and a release process with an inventory of bundled data notices.

Raw leaked password lists are not a roadmap item. Research findings may inform aggregate pattern design, but leaked credentials must not be bundled.
