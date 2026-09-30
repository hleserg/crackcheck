// Import only the published word lists used by the model. The optional
// Wikipedia-derived lists have unresolved provenance and are excluded.
import englishCommonWords from '@zxcvbn-ts/language-en/src/commonWords.json'
import englishFirstnames from '@zxcvbn-ts/language-en/src/firstnames.json'
import englishLastnames from '@zxcvbn-ts/language-en/src/lastnames.json'
import englishWordSequences from '@zxcvbn-ts/language-en/src/wordSequences.json'
import russianCommonWords from '@zxcvbn-ts/language-ru/src/commonWords.json'
import russianFirstnames from '@zxcvbn-ts/language-ru/src/firstnames.json'
import russianLastnames from '@zxcvbn-ts/language-ru/src/lastnames.json'
import russianWordSequences from '@zxcvbn-ts/language-ru/src/wordSequences.json'

// FakerJS name lists have no documented population ordering; use them only
// to label matches found by ranked dictionaries, never as scoring dictionaries.
export { russianCommonWords, russianFirstnames, russianLastnames }
export const languageDictionary = {
  'commonWords-en': englishCommonWords,
  'firstnames-en': englishFirstnames,
  'lastnames-en': englishLastnames,
  ...englishWordSequences,
  'commonWords-ru': russianCommonWords,
  ...russianWordSequences,
}
