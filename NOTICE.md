# Third-party data notices

## OpenSubtitles / OPUS data in `@zxcvbn-ts/language-ru`

CrackCheck depends on `@zxcvbn-ts/language-ru@4.1.0`. Its upstream generator identifies `ru.freq.gz` from [OpenSubtitles 2024 via OPUS](https://opus.nlpl.eu/datasets/OpenSubtitles) as the source for `commonWords.json`. The `zxcvbn-ts` migration guide identifies the `commonWords.json` data as licensed under the [Open Data Commons Attribution License (ODC-BY)](https://opendatacommons.org/licenses/by/1-0/). The npm package does not include this attribution notice.

Attribution: **OpenSubtitles 2024 via OPUS**, as used to generate `commonWords.json` in `@zxcvbn-ts/language-ru@4.1.0`.

This attribution applies to the identified common-word data. It does not assert that all data in the npm package has the same source or license. The upstream generator uses Russian FakerJS locale files for first names and surnames; those files are MIT-licensed, but the generator does not pin their source revision and the resulting lists are not population-ranked. The published README incorrectly links to Turkish locale paths. See [`docs/data-sources.md`](docs/data-sources.md).

The CrackCheck source code remains under the MIT License. Third-party data terms are separate and continue to apply to the relevant data.
