import { describe, expect, it } from 'vitest'
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common'
import { dictionary as englishDictionary, translations } from '@zxcvbn-ts/language-en'
import { analyze, transliterate } from './engine'
import russianGraph from './russianGraph.json'

const commonEnglishFactory = new ZxcvbnFactory({
  dictionary: { ...commonDictionary, ...englishDictionary },
  graphs: { ...adjacencyGraphs, russian: russianGraph },
  translations,
})

describe('analyze', () => {
  it('returns no result for an empty password', () => {
    expect(analyze('')).toBeNull()
  })

  it('returns a bounded score and pattern lengths without returning input text', () => {
    const password = 'correct-horse-battery-staple-2026'
    const result = analyze(password)

    expect(result).not.toBeNull()
    expect(result!.score).toBeGreaterThanOrEqual(0)
    expect(result!.score).toBeLessThanOrEqual(4)
    expect(result!.guesses).toBeGreaterThan(0)
    expect(result!.patterns.length).toBeGreaterThan(0)
    expect(result!.patterns.every(pattern => pattern.length === null || pattern.length > 0)).toBe(true)
    expect(JSON.stringify(result)).not.toContain(password)
    expect(JSON.stringify(result)).not.toContain('correct-horse')
  })

  it.each([
    { sample: 'пароль', detail: 'russianWord', transliterated: true },
    { sample: 'пароль123', detail: 'commonPassword', transliterated: true },
    { sample: 'Сергей1988', detail: 'name', transliterated: true },
    { sample: 'Иван', detail: 'name', transliterated: true },
    { sample: 'йцукен', detail: 'russianKeyboard', transliterated: false },
  ])('recognizes $sample as $detail', ({ sample, detail, transliterated }) => {
    const result = analyze(sample)

    expect(result?.transliterated).toBe(transliterated)
    expect(result?.patterns.some(pattern => pattern.detail === detail)).toBe(true)
    if (transliterated) expect(result?.patterns.every(pattern => pattern.length === null)).toBe(true)
  })

  it('uses the Russian dictionary where common and English dictionaries do not recognize the transliteration', () => {
    const sample = 'пароль'
    const englishOnly = commonEnglishFactory.check(transliterate(sample))
    const fullModel = analyze(sample)

    expect(fullModel?.transliterated).toBe(true)
    expect(fullModel?.guesses).toBeLessThan(englishOnly.guesses)
  })

  it('does not apply Russian transliteration to arbitrary mixed Cyrillic strings', () => {
    const result = analyze('Ж7щ%К9ж')

    expect(result).not.toBeNull()
    expect(result?.transliterated).toBe(false)
  })
})
