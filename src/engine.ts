import { ZxcvbnFactory, type MatchExtended } from '@zxcvbn-ts/core'
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common'
import { translations } from '@zxcvbn-ts/language-en'
import { languageDictionary, russianCommonWords, russianFirstnames, russianLastnames } from './dictionaries'
import russianGraph from './russianGraph.json'

const factory = new ZxcvbnFactory({
  dictionary: { ...commonDictionary, ...languageDictionary },
  graphs: { ...adjacencyGraphs, russian: russianGraph },
  translations,
})

// This frequency-ranked list is generated from OpenSubtitles/OPUS. Membership
// validates transliterations without assigning a new rank or using unranked lists.
const rankedRussianWords = new Set(russianCommonWords)
const russianNames = new Set(russianFirstnames)
const russianSurnames = new Set(russianLastnames)
const englishWords = new Set([
  ...languageDictionary['commonWords-en'], ...languageDictionary['firstnames-en'], ...languageDictionary['lastnames-en'],
])

// Keys of the US QWERTY layout and the characters they produce in Russian JCUKEN.
const latinKeys = 'qwertyuiop[]asdfghjkl;\'zxcvbnm,.`QWERTYUIOP{}ASDFGHJKL:"ZXCVBNM<>~'
const russianKeys = 'йцукенгшщзхъфывапролджэячсмитьбюёЙЦУКЕНГШЩЗХЪФЫВАПРОЛДЖЭЯЧСМИТЬБЮЁ'
const layout = Object.fromEntries(Array.from(latinKeys, (key, index) => [key, russianKeys[index]]))
export function fromEnglishLayout(value: string): string {
  return Array.from(value, char => layout[char] ?? char).join('')
}

export type Variant = 'reversed' | 'l33t'
export type Pattern = { kind: string; length: number | null; detail: string; variants: Variant[]; rank: number | null }
export type Analysis = { score: number; guesses: number; patterns: Pattern[]; transliterated: boolean; layoutSwapped: boolean }

const translit: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}
export function transliterate(value: string): string {
  // commonWords-ru spells adjective endings -ый as -iy (krasiviy, noviy).
  return Array.from(value.toLowerCase().replace(/ый/g, 'ий'), char => translit[char] ?? char).join('')
}

// Each Cyrillic run must be a ranked Russian word of at least four letters.
// The spelling and length guards reject runs that only collide after
// transliteration drops soft and hard signs (xmen -> чьут -> chut).
function isRankedRussianRun(run: string): boolean {
  const word = transliterate(run)
  return run.length >= 4 && word.length >= 4 && !/^[ьъы]|ь[аыуэ]|ъ([^еёюя]|$)/iu.test(run) && rankedRussianWords.has(word)
}

function description(match: MatchExtended): string {
  if (match.pattern === 'dictionary') {
    const name = String(match.dictionaryName || '')
    const word = String(match.matchedWord || '').toLowerCase()
    if (russianNames.has(word)) return 'name'
    if (russianSurnames.has(word)) return 'surname'
    if (name.includes('-ru')) return 'russianWord'
    if (name.includes('firstname')) return 'name'
    if (name.includes('lastname')) return 'surname'
    if (name.includes('password')) return 'commonPassword'
    return 'word'
  }
  if (match.pattern === 'spatial') return String(match.graph) === 'russian' ? 'russianKeyboard' : 'keyboard'
  if (match.pattern === 'date') return 'date'
  if (match.pattern === 'repeat') return 'repeat'
  if (match.pattern === 'sequence') return 'sequence'
  if (match.pattern === 'regex') return 'year'
  if (match.pattern === 'wordSequence') return 'words'
  if (match.pattern === 'separator') return 'separator'
  return 'unrecognized'
}

export function analyze(password: string): Analysis | null {
  if (!password) return null
  const direct = factory.check(password)
  // Without Cyrillic input, try reading Latin key runs as Russian typed with the
  // wrong layout (ghbdtn -> привет), skipping runs that are English words.
  const keyRuns = Array.from(password.matchAll(/[a-z[\];',.`{}:"<>~]+/gi), match => match[0])
  const layoutSwapped = !/[а-яё]/iu.test(password) && keyRuns.length > 0
    && keyRuns.every(run => !englishWords.has(run.toLowerCase()) && isRankedRussianRun(fromEnglishLayout(run)))
  const russian = layoutSwapped ? fromEnglishLayout(password) : password
  const cyrillicRuns = Array.from(russian.matchAll(/[а-яё]+/giu), match => match[0])
  const hasRussianDictionaryEvidence = cyrillicRuns.length > 0 && cyrillicRuns.every(isRankedRussianRun)
  const candidate = hasRussianDictionaryEvidence ? factory.check(transliterate(russian)) : null
  const transliterated = !!candidate && candidate.guesses < direct.guesses
  const result = transliterated ? candidate : direct
  return {
    score: result.score,
    transliterated,
    layoutSwapped: transliterated && layoutSwapped,
    guesses: result.guesses,
    patterns: result.sequence.map(match => ({
      kind: match.pattern,
      length: transliterated ? null : Array.from(match.token).length,
      detail: description(match),
      variants: match.pattern === 'dictionary'
        ? (['reversed', 'l33t'] as const).filter(variant => match[variant])
        : [],
      rank: match.pattern === 'dictionary' ? Number(match.rank) : null,
    })),
  }
}
