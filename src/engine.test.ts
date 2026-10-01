import { describe, expect, it } from 'vitest'
import { ZxcvbnFactory } from '@zxcvbn-ts/core'
import { adjacencyGraphs, dictionary as commonDictionary } from '@zxcvbn-ts/language-common'
import { dictionary as englishDictionary, translations } from '@zxcvbn-ts/language-en'
import { languageDictionary } from './dictionaries'
import { analyze, transliterate } from './engine'
import russianGraph from './russianGraph.json'

const commonEnglishFactory = new ZxcvbnFactory({
  dictionary: { ...commonDictionary, ...englishDictionary },
  graphs: { ...adjacencyGraphs, russian: russianGraph },
  translations,
})

const fullFactory = new ZxcvbnFactory({
  dictionary: { ...commonDictionary, ...languageDictionary },
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
    { sample: 'анна2024', detail: 'name', transliterated: true },
    { sample: 'Иван', detail: 'name', transliterated: true },
    { sample: 'йцукен', detail: 'russianKeyboard', transliterated: false },
    { sample: 'фыва', detail: 'russianKeyboard', transliterated: false },
    { sample: 'ячсм', detail: 'russianKeyboard', transliterated: false },
  ])('recognizes $sample as $detail', ({ sample, detail, transliterated }) => {
    const result = analyze(sample)

    expect(result?.transliterated).toBe(transliterated)
    expect(result?.patterns.some(pattern => pattern.detail === detail)).toBe(true)
    if (transliterated) expect(result?.patterns.every(pattern => pattern.length === null)).toBe(true)
    if (['пароль123', 'Сергей1988', 'анна2024'].includes(sample)) {
      expect(result?.score).toBeLessThanOrEqual(2)
    }
  })

  it.each([
    { sample: 'drowssap', detail: 'commonPassword', variants: ['reversed'] },
    { sample: 'p@ssw0rd', detail: 'commonPassword', variants: ['l33t'] },
    { sample: 'Sandpaper-Lantern-Voyage-Orchid', detail: 'separator', variants: [] },
  ])('explains $sample as $detail with variants $variants', ({ sample, detail, variants }) => {
    const pattern = analyze(sample)?.patterns.find(pattern => pattern.detail === detail)

    expect(pattern?.variants).toEqual(variants)
  })

  it.each(['ctvmz', 'ktyf', 'rhfcbdsq', 'ghbdtn2024'])('recognizes %s as Russian typed with the English layout', sample => {
    const result = analyze(sample)

    expect(result?.layoutSwapped).toBe(true)
    expect(result?.transliterated).toBe(true)
    expect(result?.guesses).toBeLessThan(fullFactory.check(sample).guesses)
  })

  it.each(['here', 'keys', 'emma', 'Ahern', 'qwerty', 'vbhzrth', 'xmen'])('does not read %s as a layout-swapped Russian word', sample => {
    expect(analyze(sample)?.layoutSwapped).toBe(false)
  })

  it('recognizes Russian adjectives ending in -ый', () => {
    expect(transliterate('красивый')).toBe('krasiviy')
    expect(analyze('красивый')?.transliterated).toBe(true)
  })

  it('keeps the official Russian package ranks when analyzing a Cyrillic word', () => {
    const sample = 'пароль'
    const englishOnly = commonEnglishFactory.check(transliterate(sample))
    const fullModelTransliteration = fullFactory.check(transliterate(sample))
    const fullModel = analyze(sample)

    expect(fullModel?.transliterated).toBe(true)
    expect(fullModel?.guesses).toBeLessThan(englishOnly.guesses)
    expect(fullModel?.guesses).toBe(fullModelTransliteration.guesses)
  })

  it('does not apply Russian transliteration to arbitrary mixed Cyrillic strings', () => {
    const result = analyze('Ж7щ%К9ж')

    expect(result).not.toBeNull()
    expect(result?.transliterated).toBe(false)
  })

  it('does not accept an arbitrary Cyrillic run just because its transliteration resembles Latin text', () => {
    const result = analyze('фкщвлрж')

    expect(result).not.toBeNull()
    expect(result?.transliterated).toBe(false)
  })
})
