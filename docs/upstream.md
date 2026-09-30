# Upstream language support

CrackCheck uses the published [`@zxcvbn-ts/language-ru@4.1.0`](https://www.npmjs.com/package/@zxcvbn-ts/language-ru/v/4.1.0) package. It supplies Russian translations and dictionary exports. The major dictionaries are Latin transliterations, so raw Cyrillic words such as `пароль` and `привет` do not match them directly. CrackCheck currently handles this with a limited app-level transliteration candidate analysis; this is not an upstream matcher. The package's npm metadata declares MIT; this package-level license does not by itself resolve the provenance or licensing of every bundled data file.

## Data provenance and remaining issues

The [published package README](https://www.npmjs.com/package/@zxcvbn-ts/language-ru/v/4.1.0) identifies:

- `commonWords.json` as generated from OpenSubtitles 2024 frequency data via OPUS;
- `firstnames.json` as generated from Turkish FakerJS `src/locales/tr/person/first_name.ts`;
- `lastnames.json` as generated from Turkish FakerJS `src/locales/tr/person/last_name.ts`.

The README links are incorrect: the package's [`data-scripts/lists.ts` at its published source revision](https://github.com/zxcvbn-ts/zxcvbn/blob/642ef8f0c40d8267e9fc2d4de29ab2691e87a10e/data-scripts/lists.ts#L565-L585) generates those lists from FakerJS Russian locale files (`src/locales/ru/person/first_name.ts` and `last_name.ts`). FakerJS is MIT-licensed. The generated lists are not population-ranked, and the generator does not pin the FakerJS source revision; these remain reproducibility and data-quality issues rather than a Turkish-source claim.

The generator uses OpenSubtitles/OPUS's `ru.freq.gz` for common words. The `zxcvbn-ts` migration guide identifies `commonWords.json` as ODC-BY. The npm package does not include the corresponding NOTICE, so CrackCheck records the attribution in [`NOTICE.md`](../NOTICE.md) and this should be corrected upstream. Do not infer that all package data are covered by the npm `MIT` declaration. The source pin and notices are proposed in [upstream PR #346](https://github.com/zxcvbn-ts/zxcvbn/pull/346). Current detail and candidate alternatives are listed in [data sources](data-sources.md).

## Keyboard graph

The `language-ru@4.1.0` README setup combines its dictionary and translations with `language-common` adjacency graphs. It does not document a Russian JCUKEN graph. CrackCheck integrates `src/russianGraph.json`, generated from [upstream `zxcvbn-ts/zxcvbn` commit `5782aa3`](https://github.com/hleserg/zxcvbn/commit/5782aa3). This graph is local application code and should not be described as shipped in the official npm package or accepted upstream. The focused contribution is committed and pushed to [`hleserg/zxcvbn:codex/russian-keyboard-graph`](https://github.com/hleserg/zxcvbn/tree/codex/russian-keyboard-graph). It passed the graph generator, common-package build, and 127 spatial matcher tests. This is now [upstream PR #345](https://github.com/zxcvbn-ts/zxcvbn/pull/345), awaiting maintainer approval for fork CI. Its title and description are recorded in [the PR draft](upstream-pr.md). No merge is implied.

## Contribution path

1. Correct the published package README's Turkish FakerJS links to the Russian locale files.
2. Pin the FakerJS revision in the data generator and document that the generated lists are not population-ranked.
3. Add the ODC-BY NOTICE for OpenSubtitles/OPUS `ru.freq.gz` to the Russian package.
4. Compare the generated graph and its generator commit against current upstream language package conventions.
5. If the graph or data work is useful upstream, prepare a focused contribution with reproducible generation, attribution, tests, and explicit data licensing.
6. Replace local compatibility code with an official upstream release after the relevant change is published.

CrackCheck does not maintain a permanent private fork. Any fork or patch used for contribution should remain a temporary upstream workspace.
