import './style.css'
import { analyze } from './engine'
import { checkPwnedPassword } from './hibp'
import { strings, type Locale } from './i18n'
import { people, renderChapter } from './threats'

// Sources for the attack speeds quoted on the page.
const link = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noreferrer">${text}</a>`
const zxcvbnRates = link('https://github.com/zxcvbn-ts/zxcvbn/blob/master/packages/libraries/main/src/TimeEstimates.ts', 'zxcvbn-ts')
const hashcat4090 = link('https://gist.github.com/Chick3nman/32e662a5bb63bc4f51b847bb422222fd', 'hashcat, RTX 4090')
const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="shell">
    <header class="topbar"><a class="brand" id="home" href="#top"><span class="brand-mark">C<span>•</span></span><span>CrackCheck</span></a><button id="locale" class="small-button" type="button">EN</button></header>
    <main id="top">
      <section class="hero" aria-labelledby="title"><p class="eyebrow" id="eyebrow"></p><h1 id="title"></h1><p class="lead" id="subtitle"></p></section>
      <section class="workspace" id="workspace">
        <div class="entry"><div class="entry-head"><label for="password" id="password-label"></label><span class="privacy-badge"><span class="badge-dot"></span><span id="local"></span></span></div>
          <div class="input-row"><input id="password" type="password" autocomplete="off" autocapitalize="off" autocorrect="off" spellcheck="false" inputmode="text" /><button id="show" class="input-button" type="button" aria-pressed="false"><svg class="icon" viewBox="0 0 24 24" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><path class="slash" d="M4 4l16 16"/></svg></button></div>
          <div class="privacy-note"><p id="privacy"></p><ul><li id="privacy-similar"></li><li id="privacy-offline"></li></ul></div><div class="mode-row"><span id="mode-label"></span><div class="segmented" id="scenario" role="group"><button id="account" type="button" aria-pressed="false"></button><button id="wifi" type="button" aria-pressed="true"></button></div></div>
        </div>
        <div id="wifi-explanation" class="wifi-note" hidden></div>
        <div class="analysis" id="analysis"><p class="empty" id="empty"></p><div id="result" hidden><div class="result-head"><div><span class="section-kicker" id="result-label"></span><h2 id="score"></h2></div><div class="score-index" id="score-index"></div></div><div class="meter" aria-hidden="true"><span id="meter-fill"></span></div><h3 id="time-title"></h3><dl class="times"><div class="account-time"><dt id="time-open-label"></dt><dd id="time-open"></dd></div><div class="account-time"><dt id="time-online-label"></dt><dd id="time-online"></dd></div><div><dt id="time-offline-label"></dt><dd id="time-offline"></dd></div></dl><p class="model" id="guesses"></p><p class="model" id="reuse"></p><p class="model" id="model"></p><p class="model"><span class="sources-label"></span> ${zxcvbnRates}, ${hashcat4090}</p><p class="model" id="translit-note" hidden></p><p class="model" id="wifi-format" hidden></p><div class="divider"></div><h3 id="seen"></h3><ol class="patterns" id="patterns"></ol><div class="advice"><h3 id="suggestion"></h3><p id="advice-text"></p></div></div></div>
      </section>
      <section class="generator" id="generator" aria-labelledby="gen-title"><span class="section-kicker" id="gen-kicker"></span><h2 id="gen-title"></h2><p id="gen-intro"></p>
        <div class="gen-box"><div><label class="gen-length" for="gen-length"><span id="gen-length-label"></span><output id="gen-length-value" for="gen-length"></output></label><input id="gen-length" type="range" min="8" max="40" value="16" /><label class="network-switch"><input id="gen-digits" type="checkbox" checked /><span id="gen-digits-label"></span></label><label class="network-switch"><input id="gen-symbols" type="checkbox" checked /><span id="gen-symbols-label"></span></label></div>
          <div><output class="gen-password" id="gen-password"></output><div class="gen-buttons"><button class="small-button" id="gen-new" type="button"></button><button class="small-button" id="gen-copy" type="button"></button></div><p class="model" id="gen-status" role="status" aria-live="polite"></p></div></div>
        <h3 id="gen-compare"></h3><dl class="times gen-times">${[0, 1, 2, 3].map(n => `<div id="gen-set${n}"><dt></dt><dd></dd></div>`).join('')}</dl><p class="model" id="gen-note"></p><p class="model" id="gen-rate"></p><p class="model"><span class="sources-label"></span> ${zxcvbnRates}, ${hashcat4090}</p></section>
      <section class="story" aria-labelledby="story-title"><span class="section-kicker" id="story-kicker"></span><h2 id="story-title"></h2><p id="story-intro"></p><ol class="story-steps"><li id="story1"></li><li id="story2"></li><li id="story3"></li></ol><p class="story-outro" id="story-outro"></p></section>
      <section class="story" aria-labelledby="plan-title"><span class="section-kicker" id="plan-kicker"></span><h2 id="plan-title"></h2><p id="plan-intro"></p><ol class="story-steps"><li id="plan1"></li><li id="plan2"></li><li id="plan3"></li><li id="plan4"></li></ol><p class="story-outro" id="plan-outro"></p></section>
      <section class="story faq" aria-labelledby="faq-title"><span class="section-kicker" id="faq-kicker"></span><h2 id="faq-title"></h2>${[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => `<details><summary id="faq${n}q"></summary><p id="faq${n}a"></p>${n === 9 ? `<p><span class="sources-label"></span> ${hashcat4090}</p>` : ''}</details>`).join('')}</section>
      <section class="story" id="people"></section>
      <section class="hibp-section"><div><span class="section-kicker">OPT-IN · HIBP</span><h2 id="hibp-title"></h2><p id="hibp-text"></p></div><div class="hibp-actions"><label class="network-switch"><input id="network-off" type="checkbox" checked /><span id="network-off-label"></span></label><button class="primary-button" id="hibp-button" type="button"></button><p id="hibp-status" role="status" aria-live="polite"></p></div></section>
      <section class="learn"><span class="section-kicker">CRACKCHECK / 01</span><h2 id="learn-title"></h2><div class="learn-grid"><p id="learn1"></p><p id="learn2"></p><p id="learn3"></p></div></section>
    </main><footer><span>CrackCheck · MIT</span><nav><a id="privacy-link" href="https://github.com/hleserg/crackcheck/blob/main/docs/privacy.md"></a><a id="methodology-link" href="https://github.com/hleserg/crackcheck/blob/main/docs/methodology.md"></a><a id="data-link" href="https://github.com/hleserg/crackcheck/blob/main/THIRD_PARTY_LICENSES.md"></a></nav></footer>
  </div>`

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const passwordInput = $<HTMLInputElement>('password')
// The site is made for Russian speakers, many of whom run an English browser; English is opt-in.
let locale: Locale = 'ru'
let mode: 'account' | 'wifi' = 'wifi'
let hibpController: AbortController | null = null
let requestVersion = 0

function setText(id: string, value: string) { $(id).textContent = value }
function duration(seconds: number) {
  const t = strings[locale]
  const units = [['year', 31557600], ['month', 2629800], ['day', 86400], ['hour', 3600], ['minute', 60], ['second', 1]] as const
  if (seconds < 1) return t.instant
  if (seconds >= 1e12 * units[0][1]) return t.forever
  if (seconds >= 100 * units[0][1]) return new Intl.NumberFormat(locale, { style: 'unit', unit: 'year', unitDisplay: 'long', notation: 'compact', maximumFractionDigits: 0 }).format(seconds / units[0][1])
  const [unit, size] = units.find(([, size]) => seconds >= size)!
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'long', maximumFractionDigits: 0 }).format(Math.floor(seconds / size))
}
// Letters are always in; the symbols are printable ASCII that routers accept in a WPA2 passphrase.
const charsets = { letters: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ', digits: '0123456789', symbols: '!#$%&*+-=?@^_' }
const setChoices = [[false, false], [true, false], [false, true], [true, true]] as const
let generated = ''
function randomIndex(size: number) {
  // Rejection sampling: values past the last whole multiple of size would favour the low indices.
  const value = new Uint32Array(1)
  do crypto.getRandomValues(value); while (value[0]! >= 2 ** 32 - 2 ** 32 % size)
  return value[0]! % size
}
function generate() {
  const length = Number($<HTMLInputElement>('gen-length').value)
  const sets = [charsets.letters.slice(0, 26), charsets.letters.slice(26)]
  if ($<HTMLInputElement>('gen-digits').checked) sets.push(charsets.digits)
  if ($<HTMLInputElement>('gen-symbols').checked) sets.push(charsets.symbols)
  const all = sets.join('')
  // Redraw until every chosen kind appears, so a site that demands a digit accepts the password.
  do generated = Array.from({ length }, () => all[randomIndex(all.length)]).join('')
  while (!sets.every(set => [...generated].some(char => set.includes(char))))
  setText('gen-status', '')
  renderGenerator()
}
function renderGenerator() {
  const t = strings[locale]
  const length = Number($<HTMLInputElement>('gen-length').value)
  const [digits, symbols] = [$<HTMLInputElement>('gen-digits').checked, $<HTMLInputElement>('gen-symbols').checked]
  setText('gen-length-value', String(length))
  setText('gen-password', generated)
  // A random password is guessed by trying every combination; on average half of them are needed.
  const rate = mode === 'wifi' ? 2.5e6 : 1e10
  setChoices.forEach(([withDigits, withSymbols], n) => {
    const size = charsets.letters.length + (withDigits ? charsets.digits.length : 0) + (withSymbols ? charsets.symbols.length : 0)
    const row = $(`gen-set${n}`)
    row.querySelector('dt')!.textContent = t.genSets[n]!.replace('{n}', String(size))
    row.querySelector('dd')!.textContent = duration(size ** length / 2 / rate)
    row.classList.toggle('current', withDigits === digits && withSymbols === symbols)
  })
  setText('gen-rate', mode === 'wifi' ? t.genRateWifi : t.genRateLeak)
}
function invalidateHibp() {
  requestVersion++
  hibpController?.abort()
  hibpController = null
  setText('hibp-status', '')
}
function render() {
  const t = strings[locale]
  document.documentElement.lang = locale
  document.title = locale === 'ru' ? 'CrackCheck — разбор пароля в браузере' : 'CrackCheck — local password analysis'
  renderChapter($('people'), people[locale], 'h2')
  const labels: Record<string, string> = {
    eyebrow: t.eyebrow, title: t.title, subtitle: t.subtitle, 'password-label': t.password,
    local: t.local, privacy: t.privacy, 'privacy-similar': t.privacySimilar, 'privacy-offline': t.privacyOffline, 'mode-label': t.mode, account: t.account, wifi: t.wifi,
    'wifi-explanation': t.wifiText, empty: t.empty, 'result-label': t.result, 'time-title': t.timeTitle, 'time-open-label': t.timeOpen, 'time-online-label': t.timeOnline, reuse: t.reuse,
    model: t.model, seen: t.seen, suggestion: t.suggestion,
    'hibp-title': t.hibpTitle, 'hibp-text': t.hibpText, 'hibp-button': t.hibpButton, 'network-off-label': t.networkOff,
    'story-kicker': t.storyKicker, 'story-title': t.storyTitle, 'story-intro': t.storyIntro, story1: t.story1, story2: t.story2, story3: t.story3, 'story-outro': t.storyOutro,
    'plan-kicker': t.planKicker, 'plan-title': t.planTitle, 'plan-intro': t.planIntro, plan1: t.plan1, plan2: t.plan2, plan3: t.plan3, plan4: t.plan4, 'plan-outro': t.planOutro, 'faq-kicker': t.faqKicker, 'faq-title': t.faqTitle,
    'gen-kicker': t.genKicker, 'gen-title': t.genTitle, 'gen-intro': t.genIntro, 'gen-length-label': t.genLength, 'gen-digits-label': t.genDigits, 'gen-symbols-label': t.genSymbols,
    'gen-new': t.genNew, 'gen-copy': t.genCopy, 'gen-compare': t.genCompare, 'gen-note': t.genNote,
    'learn-title': t.learnTitle, learn1: t.learn1, learn2: t.learn2, learn3: t.learn3,
    'privacy-link': t.privacyLink, 'methodology-link': t.methodology, 'data-link': t.dataNotices,
  }
  for (const [id, value] of Object.entries(labels)) setText(id, value)
  for (const label of document.querySelectorAll('.sources-label')) label.textContent = t.sources
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8, 9] as const) { setText(`faq${n}q`, t[`faq${n}q`]); setText(`faq${n}a`, t[`faq${n}a`]) }
  setText('local', $<HTMLInputElement>('network-off').checked ? t.local : t.hibpReady)
  passwordInput.placeholder = t.placeholder
  $('show').setAttribute('aria-label', t.show)
  $('show').title = t.show
  $('show').setAttribute('aria-pressed', String(passwordInput.type === 'text'))
  $('locale').textContent = locale === 'ru' ? 'EN' : 'RU'
  $('locale').lang = locale === 'ru' ? 'en' : 'ru'
  const ariaLabels = { home: t.homeLabel, locale: t.localeLabel, workspace: t.workspaceLabel, scenario: t.scenarioLabel }
  for (const [id, value] of Object.entries(ariaLabels)) $(id).setAttribute('aria-label', value)
  $('wifi-explanation').hidden = mode !== 'wifi'
  $('account').setAttribute('aria-pressed', String(mode === 'account'))
  $('wifi').setAttribute('aria-pressed', String(mode === 'wifi'))
  renderGenerator()
  const result = analyze(passwordInput.value)
  $('empty').hidden = !!result
  $('result').hidden = !result
  $<HTMLButtonElement>('hibp-button').disabled = !result || $<HTMLInputElement>('network-off').checked
  if (!result) return
  setText('score', t.score[result.score] || t.score[0])
  setText('score-index', `${result.score}/4`)
  $<HTMLElement>('meter-fill').style.width = `${(result.score + 1) * 20}%`
  $<HTMLElement>('meter-fill').dataset.score = String(result.score)
  $('translit-note').hidden = !result.transliterated
  setText('translit-note', result.layoutSwapped ? t.layoutNote : t.translitNote)
  // IEEE 802.11i: a WPA2-Personal passphrase is 8–63 printable ASCII characters.
  $('wifi-format').hidden = mode !== 'wifi' || /^[\x20-\x7e]{8,63}$/.test(passwordInput.value)
  setText('wifi-format', t.wifiFormat)
  // Attempts per second: zxcvbn-ts's unthrottled-online, throttled-online and fast-hash rates; 2.5e6 is hashcat's WPA2 speed on one RTX 4090.
  for (const row of document.querySelectorAll<HTMLElement>('.account-time')) row.hidden = mode === 'wifi'
  setText('time-open', duration(result.guesses / 10))
  setText('time-online', duration(result.guesses / (100 / 3600)))
  setText('time-offline-label', mode === 'wifi' ? t.timeWifi : t.timeOffline)
  setText('time-offline', duration(result.guesses / (mode === 'wifi' ? 2.5e6 : 1e10)))
  setText('guesses', t.guesses.replace('{n}', new Intl.NumberFormat(locale).format(Math.round(result.guesses))))
  setText('advice-text', t.advice[result.score >= 3 ? 1 : 0])
  const list = $('patterns')
  list.replaceChildren()
  for (const pattern of result.patterns) {
    const item = document.createElement('li')
    const text = document.createElement('div')
    const label = document.createElement('strong')
    const detail = (pattern.detail in t.details ? pattern.detail : 'unrecognized') as keyof typeof t.details
    label.textContent = [t.details[detail], ...pattern.variants.map(variant => t.variants[variant])].join(', ')
    const explain = document.createElement('p')
    explain.textContent = t.explain[detail] + (pattern.rank ? ` ${t.rank}${new Intl.NumberFormat(locale).format(pattern.rank)}.` : '')
    text.append(label, explain)
    const length = document.createElement('span')
    length.textContent = pattern.length === null ? '' : `${pattern.length} ${t.chars}`
    item.append(text, length)
    list.append(item)
  }
}

passwordInput.addEventListener('input', () => { invalidateHibp(); render() })
$('show').addEventListener('click', () => { passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'; render(); passwordInput.focus() })
$('network-off').addEventListener('change', () => { invalidateHibp(); render() })
$('locale').addEventListener('click', () => { locale = locale === 'ru' ? 'en' : 'ru'; render() })
$('account').addEventListener('click', () => { mode = 'account'; render() })
$('wifi').addEventListener('click', () => { mode = 'wifi'; render() })
for (const id of ['gen-length', 'gen-digits', 'gen-symbols', 'gen-new']) $(id).addEventListener(id === 'gen-new' ? 'click' : 'input', generate)
$('gen-copy').addEventListener('click', () => navigator.clipboard.writeText(generated).then(
  () => setText('gen-status', strings[locale].genCopied), () => setText('gen-status', strings[locale].genCopyFailed)))
$('hibp-button').addEventListener('click', async () => {
  const value = passwordInput.value
  if (!value || $<HTMLInputElement>('network-off').checked) return
  invalidateHibp()
  const version = requestVersion
  const controller = new AbortController()
  hibpController = controller
  const button = $<HTMLButtonElement>('hibp-button')
  button.disabled = true
  setText('hibp-status', strings[locale].hibpWait)
  try {
    const count = await checkPwnedPassword(value, controller.signal)
    if (version === requestVersion) setText('hibp-status', count ? `${strings[locale].hibpFound}${new Intl.NumberFormat(locale).format(count)}` : strings[locale].hibpNotFound)
  } catch (error) {
    if (version === requestVersion && !(error instanceof DOMException && error.name === 'AbortError')) setText('hibp-status', strings[locale].hibpError)
  } finally {
    if (version === requestVersion) { button.disabled = false; hibpController = null }
  }
})
generate()
render()
// The worker only caches the site's own static files, so later visits open offline.
if (import.meta.env.PROD && 'serviceWorker' in navigator) navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
