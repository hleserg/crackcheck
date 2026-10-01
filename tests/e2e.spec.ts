import { expect, test } from '@playwright/test'

test('password analysis stays local and leaves no browser storage or URL trace', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  const startingUrl = page.url()
  const requestsAfterLoad: string[] = []
  page.on('request', request => requestsAfterLoad.push(request.url()))

  await page.locator('#password').fill('private-example-password-482!')
  await expect(page.locator('#result')).toBeVisible()

  expect(requestsAfterLoad).toEqual([])
  expect(page.url()).toBe(startingUrl)
  const browserData = await page.evaluate(async () => ({
    local: Object.keys(localStorage),
    session: Object.keys(sessionStorage),
    cookies: document.cookie,
    databases: (await indexedDB.databases()).map(database => database.name),
    visibleText: document.body.innerText,
  }))
  expect(browserData).toMatchObject({ local: [], session: [], cookies: '', databases: [] })
  expect(browserData.visibleText).not.toContain('private-example-password-482!')

  await page.reload()
  await expect(page.locator('#password')).toHaveValue('')
})

test('password controls remain keyboard accessible at a mobile viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const input = page.locator('#password')
  await expect(input).toBeVisible()
  expect(await page.evaluate(() => { const box = document.querySelector('.workspace')!; return box.scrollWidth <= box.clientWidth })).toBe(true)
  await input.focus()
  await page.keyboard.press('Tab')
  await expect(page.locator('#show')).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(input).toHaveAttribute('type', 'text')
})

test('HIBP sends a five-character hash prefix only after explicit opt-in', async ({ page }) => {
  const externalRequests: Array<{ url: string; method: string; headers: Record<string, string>; body: string | null }> = []
  await page.route('https://api.pwnedpasswords.com/**', async route => {
    const request = route.request()
    externalRequests.push({
      url: request.url(),
      method: request.method(),
      headers: request.headers(),
      body: request.postData(),
    })
    await route.fulfill({ status: 200, contentType: 'text/plain', body: 'DEADBEEF:1\r\n' })
  })

  await page.goto('/')
  await page.locator('#password').fill('password')
  await expect(page.locator('#result')).toBeVisible()
  expect(externalRequests).toEqual([])

  await expect(page.locator('#network-off')).toBeChecked()
  await expect(page.getByRole('button', { name: /check with HIBP|проверить по HIBP/i })).toBeDisabled()
  await page.locator('#network-off').uncheck()
  await page.getByRole('button', { name: /check with HIBP|проверить по HIBP/i }).click()

  await expect.poll(() => externalRequests.length).toBe(1)
  expect(externalRequests[0]!.url).toBe('https://api.pwnedpasswords.com/range/5BAA6')
  expect(externalRequests[0]!.method).toBe('GET')
  expect(new URL(externalRequests[0]!.url).search).toBe('')
  expect(externalRequests[0]!.body).toBeNull()
  expect(externalRequests[0]!.headers.referer).toBeUndefined()
  expect(externalRequests[0]!.url).not.toContain('1E4C9B93F3F0682250B6CF8331B7EE68FD8')
  await expect(page.locator('#hibp-status')).toContainText(/no match|совпадений не найдено/i)
})

test('analysis works offline after the page has loaded', async ({ page, context }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  await context.setOffline(true)
  await page.locator('#password').fill('Сергей1988')
  await expect(page.locator('#patterns li').first()).toBeVisible()
  await expect(page.locator('#score')).not.toBeEmpty()
})

test('a returning visit opens without a network and caches only static files', async ({ page, context }) => {
  await page.goto('/')
  await page.evaluate(() => navigator.serviceWorker.ready)
  const cached = await page.evaluate(async () => {
    const names = await caches.keys()
    const urls = (await Promise.all(names.map(async name => (await (await caches.open(name)).keys()).map(request => request.url)))).flat()
    return { names, urls, origin: location.origin }
  })
  expect(cached.names).toHaveLength(1)
  for (const url of cached.urls) expect(url).toMatch(new RegExp(`^${cached.origin}/(assets/[\\w.-]+|business\\.html)?$`))

  await context.setOffline(true)
  // Proves the browser is really offline: a URL the worker has not cached must fail.
  expect(await page.evaluate(() => fetch(`./not-cached-${Date.now()}`).then(() => 'ok', () => 'failed'))).toBe('failed')
  const response = await page.reload()
  expect(response?.fromServiceWorker()).toBe(true)
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.locator('#password').fill('private-example-password-482!')
  await expect(page.locator('#score')).not.toBeEmpty()
  await page.locator('#people .chapter-link').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Как атакуют компании и ИП')
})

test('Wi-Fi mode flags passwords that WPA2-Personal does not accept', async ({ page }) => {
  await page.goto('/')
  await page.locator('#wifi').click()
  await page.locator('#password').fill('short')
  await expect(page.locator('#wifi-format')).toBeVisible()
  await page.locator('#password').fill('long-enough-ascii')
  await expect(page.locator('#wifi-format')).toBeHidden()
  await page.locator('#account').click()
  await page.locator('#password').fill('short')
  await expect(page.locator('#wifi-format')).toBeHidden()
})

test('explains Russian typed with the English layout', async ({ page }) => {
  await page.goto('/')
  await page.locator('#password').fill('ctvmz')
  await expect(page.locator('#translit-note')).toContainText(/English keyboard layout|английской раскладке/)
})

test('the people chapter links to a separate business page in both languages', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('#people h2')).toHaveText('Как обычно обманывают людей')
  await page.locator('#locale').click()
  await expect(page.locator('#people h2')).toHaveText('How people usually get scammed')
  await page.locator('#people .chapter-link').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Как атакуют компании и ИП')
  await page.locator('#locale').click()
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('How attackers target companies')
  await expect(page.locator('html')).toHaveAttribute('lang', 'en')
})

for (const colorScheme of ['light', 'dark'] as const) {
  test(`visible text meets WCAG AA contrast in ${colorScheme} mode`, async ({ page }) => {
    await page.emulateMedia({ colorScheme })
    await page.goto('/')
    const lowContrastText = () => page.evaluate(() => {
      const rgb = (value: string) => value.match(/[\d.]+/g)!.map(Number)
      const luminance = ([r, g, b]: number[]) => {
        const [R, G, B] = [r, g, b].map(c => { c /= 255; return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4 })
        return 0.2126 * R! + 0.7152 * G! + 0.0722 * B!
      }
      const background = (element: Element | null): number[] => {
        for (; element; element = element.parentElement) {
          const color = rgb(getComputedStyle(element).backgroundColor)
          if (color[3] !== 0) return color
        }
        return rgb(getComputedStyle(document.documentElement).backgroundColor)
      }
      const result: string[] = []
      for (const element of document.querySelectorAll('body *')) {
        const own = Array.from(element.childNodes).some(node => node.nodeType === Node.TEXT_NODE && node.textContent!.trim())
        if (!own || !(element as HTMLElement).checkVisibility() || (element as HTMLButtonElement).disabled) continue
        const style = getComputedStyle(element)
        const [l1, l2] = [luminance(rgb(style.color)), luminance(background(element))].sort((a, b) => b - a)
        const ratio = (l1! + 0.05) / (l2! + 0.05)
        const large = parseFloat(style.fontSize) >= 24 || (parseFloat(style.fontSize) >= 18.66 && Number(style.fontWeight) >= 700)
        if (ratio < (large ? 3 : 4.5)) result.push(`${element.id || element.className || element.tagName}: ${ratio.toFixed(2)}`)
      }
      return result
    })
    const emptyState = await lowContrastText()
    await page.locator('#password').fill('password')
    await page.locator('#wifi').click()
    await page.locator('#hibp-status').evaluate(node => { node.textContent = 'status' })
    await page.locator('.faq details').evaluateAll(items => items.forEach(item => { (item as HTMLDetailsElement).open = true }))
    const filled = await lowContrastText()
    await page.goto('/business.html')
    expect([...emptyState, ...filled, ...await lowContrastText()]).toEqual([])
  })
}
