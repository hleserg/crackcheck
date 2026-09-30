# Architecture

CrackCheck is a static browser application. The repository currently uses TypeScript and Vite; no application backend is required for local password analysis.

## Runtime pieces

- `src/main.ts` builds the page and owns short-lived UI state: locale, analysis scenario, and the password input value.
- `src/i18n.ts` contains Russian and English interface strings.
- `src/engine.ts` configures `@zxcvbn-ts/core` with the common package and selected English/Russian data files. `src/dictionaries.ts` excludes optional Wikipedia lists and keeps unranked FakerJS Russian names outside the scoring dictionary. For Cyrillic text, it runs a second candidate analysis only when every Cyrillic run has at least four letters and its transliteration exactly matches ranked `commonWords-ru`; it selects that result only when zxcvbn-ts estimates fewer guesses.
- `src/russianGraph.json` provides the JCUKEN adjacency graph generated from upstream `zxcvbn-ts/zxcvbn` commit `5782aa3`. The generated graph is integrated in CrackCheck; it is not claimed to ship in `@zxcvbn-ts/language-ru`.
- `src/hibp.ts` implements the optional Pwned Passwords range request. It computes SHA-1 locally and sends only a five-character prefix after the user action.

Vite bundles application assets for static hosting. The app does not need a server-side password endpoint. Any hosting provider still receives ordinary page-request metadata.

## Data flow

### Local analysis

The browser reads the password from the password input, passes it directly to `analyze`, and renders the resulting score, guess estimate, and recognized pattern summaries. The code should not copy the password into the URL, persistent storage, telemetry, or application logs. Typing triggers local analysis only.

### HIBP

The HIBP request runs only when the user presses the separate check button. `src/hibp.ts` hashes the value with Web Crypto, requests the Pwned Passwords range for the first five hex characters, and compares response suffixes in the browser. The service sees the prefix request and network metadata. See [privacy model](privacy.md).

## Boundaries and maintenance

The score and patterns come from `zxcvbn-ts`; CrackCheck adds user-facing explanations, UI, and a limited transliteration candidate step. The official Russian package's major dictionaries use Latin transliteration, so raw Cyrillic words need this extra step to be considered. It is not equivalent to complete transliteration-aware matching. Avoid duplicating or replacing the estimator with a hand-written strength formula. Keep app-specific matchers or graphs isolated and document their limitations.

Dictionary package versions are locked in `package-lock.json`. Their code and bundled data can have different licensing and provenance. See [data sources](data-sources.md) before updating or adding a data package.

This is a source architecture description. A successful build and behavioral checks are still needed before making release or deployment claims.
