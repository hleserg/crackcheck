export async function sha1Hex(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value)
  const digest = await crypto.subtle.digest('SHA-1', bytes)
  return Array.from(new Uint8Array(digest), byte => byte.toString(16).padStart(2, '0')).join('').toUpperCase()
}

export async function checkPwnedPassword(password: string, signal?: AbortSignal): Promise<number> {
  const hash = await sha1Hex(password)
  const prefix = hash.slice(0, 5)
  const suffix = hash.slice(5)
  const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
    headers: { 'Add-Padding': 'true' },
    referrerPolicy: 'no-referrer',
    cache: 'no-store',
    signal,
  })
  if (!response.ok) throw new Error(`HIBP ${response.status}`)
  const body = await response.text()
  for (const line of body.split(/\r?\n/)) {
    const [candidate, count] = line.split(':')
    if (candidate === suffix) return Number(count) || 0
  }
  return 0
}
