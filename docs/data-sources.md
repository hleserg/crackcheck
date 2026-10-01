# Data sources and language coverage

CrackCheck separates application code, UI translations, estimator packages, and dictionary data. A package's MIT code license does not automatically cover data bundled with it. Every shipped dictionary needs a traceable source, version, transformation description, and applicable attribution/license notice.

This status record is based on [`RESEARCH.md`](../RESEARCH.md) plus inspection of the installed `@zxcvbn-ts/language-ru@4.1.0` package and its published source revision. The last column distinguishes current bundled dependencies from research-only candidates.

| Source | Provenance and intended role | License/status | Shipped in CrackCheck? |
| --- | --- | --- | --- |
| `@zxcvbn-ts/core`, `language-common`, `language-en` | Upstream estimation engine, common dictionaries, English translations/data | Follow each package's license and included notices | Yes, declared in `package.json`; audit notices in release bundle |
| [`@zxcvbn-ts/language-ru@4.1.0`](https://www.npmjs.com/package/@zxcvbn-ts/language-ru/v/4.1.0) | Official upstream Russian translations and dictionaries. Its major dictionaries are Latin transliterations, not raw Cyrillic word lists. | npm metadata declares MIT for package code. Its generator uses Russian FakerJS locale files for first and last names; those source files are MIT-licensed, but the generator does not pin the Faker revision. These are not population-ranked name lists and CrackCheck uses them only to label detected names, not for scoring. The published package README incorrectly links the corresponding Turkish locale paths. | Yes, pinned at 4.1.0. CrackCheck imports selected data files directly and excludes `wikipedia-ru`. It carries ODC-BY and FakerJS notices; upstream fixes are proposed in PR #346 |
| [OpenSubtitles / OPUS 2024](https://opus.nlpl.eu/datasets/OpenSubtitles) | Upstream generator uses the Russian `ru.freq.gz` frequency list for `commonWords.json` | ODC-BY; attribution/NOTICE required | Included through `language-ru`'s packaged data; attribution is recorded in [`NOTICE.md`](../NOTICE.md) |
| `rustemgareev/russian-names` | Alternative candidate first-name list; reported 12,311 entries, Cyrillic and Latin forms, with EGR ZAGS statistics as of July 2025 | CC BY-SA 4.0; redistribution and share-alike implications need explicit handling | No |
| `rustemgareev/russian-surnames` | Alternative candidate surname coverage, reported at about 318k entries | CC BY-SA 4.0; frequency field and provenance remain unverified in the research notes | No |
| Zhuravlev surname ranking | QA/reference only | Not suitable for redistribution under the terms described in the research | No |
| `sorokinpf/russian_names` | Research candidate | No license identified; do not redistribute | No |

## Current claims

- The UI has Russian and English translations, and the app imports official `@zxcvbn-ts/language-ru@4.1.0` dictionary data. Its major dictionaries are Latin transliterations, so raw Cyrillic words need CrackCheck's additional candidate analysis. This does not imply complete or independently validated Russian password-dictionary coverage.
- App-level transliteration candidate analysis requires every Cyrillic run to have at least four letters and an exact match in the ranked `commonWords-ru` list, then selects the candidate only if zxcvbn-ts estimates fewer guesses. The same rule applies to Latin key runs read as Russian typed with the English layout, excluding runs that are English dictionary words or names. This is a limited heuristic, not a general reverse-layout or transliteration matcher.
- The official Russian package README links its first-name and surname generators to Turkish FakerJS locale files, but the upstream generator at [the package's source revision](https://github.com/zxcvbn-ts/zxcvbn/blob/642ef8f0c40d8267e9fc2d4de29ab2691e87a10e/data-scripts/lists.ts#L565-L585) uses the corresponding Russian locale files. This resolves the language mismatch. FakerJS is MIT-licensed, but the generator does not pin a Faker revision; these lists are not population-ranked and are excluded from scoring.
- The app contains a local JCUKEN graph in `src/russianGraph.json`, generated from upstream `zxcvbn-ts/zxcvbn` commit `5782aa3`. The official `language-ru@4.1.0` README setup uses `language-common` adjacency graphs and does not establish that a Russian graph ships in the npm package. CrackCheck's generated graph is not evidence of an upstream npm feature or acceptance.
- `rustemgareev` names/surnames listed above are alternative candidates only and are not declared to be present in the application.
- Reverse-layout matching covers only whole runs that are ranked `commonWords-ru` words. Mixed Cyrillic/Latin homoglyphs remain a research goal, not a claim of current matcher support.
- Never add raw leaked password corpora. Published aggregate findings may inform matcher design, but do not redistribute leaked credentials.

Upstream [PR #346](https://github.com/zxcvbn-ts/zxcvbn/pull/346) proposes pinning FakerJS revision `3b184d6e52a721c227c6e9c58731bdf008f43532` and adding the missing ODC-BY/Faker notices. It has not been merged. The optional `wikipedia-en` and `wikipedia-ru` lists are excluded from the application bundle pending provenance and license review.

### Wikipedia list audit (2026-10-01)

Findings from upstream `zxcvbn-ts/zxcvbn` at the PR #345 base and the installed npm packages:

- The lists are produced by `data-scripts/wikiExtractor/index.ts`. Upstream's language guide (`docs/guide/languages/README.md`) describes the process: download `XXwiki-latest-pages-articles.xml.bz2` from dumps.wikimedia.org, extract it with `wikiextractor --no-templates`, then count tokens. The generator keeps tokens seen at least 500 times and writes them ordered by frequency. The JSON contains words only; counts and article text are not shipped.
- The dump date is not recorded. `wikipedia-en` has 29,782 entries and was added before 2021-05-25. `wikipedia-ru` has 85,667 entries and was added on 2026-08-12 in upstream commit `ac0ef46`. The npm files are byte-identical to the upstream source.
- `wikipedia-ru` contains no Cyrillic. It is a Latin transliteration, like the other Russian lists, and its top entries include wiki markup tokens such as `doc`, `https`, `url` and `title`.
- No README, NOTICE or THIRD_PARTY_LICENSES file in `language-en@4.1.1` or `language-ru@4.1.0` mentions Wikipedia or its CC BY-SA 4.0/GFDL text license. `language-ru` ships no notice file at all.

These lists do not reproduce article text, but the dump revision, Wikimedia attribution and the license reasoning are undocumented upstream. The exclusion stays. To include them, the project would need a documented dump revision and a recorded decision on attribution, ideally upstream. The noise tokens are a second, quality-related reason to keep `wikipedia-ru` out.
