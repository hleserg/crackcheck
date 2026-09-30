import { afterEach, describe, expect, it, vi } from 'vitest'
import { checkPwnedPassword, sha1Hex } from './hibp'

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe('HIBP range check', () => {
  it('hashes locally and returns the matching suffix count', async () => {
    expect(await sha1Hex('password')).toBe('5BAA61E4C9B93F3F0682250B6CF8331B7EE68FD8')

    const fetchMock = vi.fn().mockResolvedValue(new Response(
      '1E4C9B93F3F0682250B6CF8331B7EE68FD8:42\r\nOTHER:3',
      { status: 200 },
    ))
    vi.stubGlobal('fetch', fetchMock)

    await expect(checkPwnedPassword('password')).resolves.toBe(42)

    const [url, options] = fetchMock.mock.calls[0] as [string, RequestInit]
    expect(url).toBe('https://api.pwnedpasswords.com/range/5BAA6')
    expect(new URL(url).pathname).toBe('/range/5BAA6')
    expect(new URL(url).search).toBe('')
    expect(options.headers).toEqual({ 'Add-Padding': 'true' })
    expect(options.referrerPolicy).toBe('no-referrer')
    expect(options.cache).toBe('no-store')
    expect(options.body).toBeUndefined()
  })

  it('returns zero when the requested suffix is absent', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('DEADBEEF:1', { status: 200 })))

    await expect(checkPwnedPassword('password')).resolves.toBe(0)
  })

  it('propagates abort signals and rejects failed responses', async () => {
    const controller = new AbortController()
    const fetchMock = vi.fn().mockResolvedValue(new Response('', { status: 503 }))
    vi.stubGlobal('fetch', fetchMock)

    await expect(checkPwnedPassword('password', controller.signal)).rejects.toThrow('HIBP 503')
    expect(fetchMock.mock.calls[0]?.[1]?.signal).toBe(controller.signal)
  })
})
