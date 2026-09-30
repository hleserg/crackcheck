import { ZxcvbnFactory, type MatchExtended } from '@zxcvbn-ts/core'
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common'
import { dictionary as englishDictionary, translations } from '@zxcvbn-ts/language-en'
import { dictionary as russianDictionary } from '@zxcvbn-ts/language-ru'
import russianGraph from './russianGraph.json'

const factory = new ZxcvbnFactory({
  dictionary: { ...commonDictionary, ...englishDictionary, ...russianDictionary },
  graphs: { ...adjacencyGraphs, russian: russianGraph },
  translations,
})

export type Pattern = { kind: string; length: number | null; detail: string }
export type Analysis = { score: number; guesses: number; patterns: Pattern[]; transliterated: boolean }

const translit: Record<string, string> = {
  а: 'a', б: 'b', в: 'v', г: 'g', д: 'd', е: 'e', ё: 'e', ж: 'zh', з: 'z', и: 'i', й: 'y',
  к: 'k', л: 'l', м: 'm', н: 'n', о: 'o', п: 'p', р: 'r', с: 's', т: 't', у: 'u', ф: 'f',
  х: 'kh', ц: 'ts', ч: 'ch', ш: 'sh', щ: 'shch', ъ: '', ы: 'y', ь: '', э: 'e', ю: 'yu', я: 'ya',
}
export function transliterate(value: string): string {
  return Array.from(value.toLowerCase(), char => translit[char] ?? char).join('')
}

function description(match: MatchExtended): string {
  if (match.pattern === 'dictionary') {
    const name = String(match.dictionaryName || '')
    if (name.includes('-ru')) return name.includes('firstname') ? 'name' : name.includes('lastname') ? 'surname' : 'russianWord'
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
  return 'unrecognized'
}

export function analyze(password: string): Analysis | null {
  if (!password) return null
  const direct = factory.check(password)
  const candidate = /[а-яё]{3,}/i.test(password) ? factory.check(transliterate(password)) : null
  const hasRussianDictionary = candidate?.sequence.some(match =>
    match.pattern === 'dictionary' && String(match.dictionaryName).endsWith('-ru'))
  const transliterated = !!candidate && !!hasRussianDictionary && candidate.guesses < direct.guesses
  const result = transliterated ? candidate : direct
  return {
    score: result.score,
    transliterated,
    guesses: result.guesses,
    patterns: result.sequence.map(match => ({
      kind: match.pattern,
      length: transliterated ? null : Array.from(match.token).length,
      detail: description(match),
    })),
  }
}
