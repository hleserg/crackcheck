import './style.css'
import { analyze } from './engine'
import { checkPwnedPassword } from './hibp'
import { strings, type Locale } from './i18n'
import { people, renderChapter } from './threats'

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
        <div class="analysis" id="analysis"><p class="empty" id="empty"></p><div id="result" hidden><div class="result-head"><div><span class="section-kicker" id="result-label"></span><h2 id="score"></h2></div><div class="score-index" id="score-index"></div></div><div class="meter" aria-hidden="true"><span id="meter-fill"></span></div><h3 id="time-title"></h3><dl class="times"><div class="account-time"><dt id="time-open-label"></dt><dd id="time-open"></dd></div><div class="account-time"><dt id="time-online-label"></dt><dd id="time-online"></dd></div><div><dt id="time-offline-label"></dt><dd id="time-offline"></dd></div></dl><p class="model" id="guesses"></p><p class="model" id="reuse"></p><p class="model" id="model"></p><p class="model" id="translit-note" hidden></p><p class="model" id="wifi-format" hidden></p><div class="divider"></div><h3 id="seen"></h3><ol class="patterns" id="patterns"></ol><div class="advice"><h3 id="suggestion"></h3><p id="advice-text"></p></div></div></div>
      </section>
      <section class="story" aria-labelledby="story-title"><span class="section-kicker" id="story-kicker"></span><h2 id="story-title"></h2><p id="story-intro"></p><ol class="story-steps"><li id="story1"></li><li id="story2"></li><li id="story3"></li></ol><p class="story-outro" id="story-outro"></p></section>
      <section class="story" aria-labelledby="plan-title"><span class="section-kicker" id="plan-kicker"></span><h2 id="plan-title"></h2><p id="plan-intro"></p><ol class="story-steps"><li id="plan1"></li><li id="plan2"></li><li id="plan3"></li><li id="plan4"></li></ol><p class="story-outro" id="plan-outro"></p></section>
      <section class="story faq" aria-labelledby="faq-title"><span class="section-kicker" id="faq-kicker"></span><h2 id="faq-title"></h2>${[1, 2, 3, 4, 5, 6, 7, 8].map(n => `<details><summary id="faq${n}q"></summary><p id="faq${n}a"></p></details>`).join('')}</section>
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
  if (seconds >= 100 * units[0][1]) return t.centuries
  const [unit, size] = units.find(([, size]) => seconds >= size)!
  return new Intl.NumberFormat(locale, { style: 'unit', unit, unitDisplay: 'long', maximumFractionDigits: 0 }).format(Math.floor(seconds / size))
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
    'learn-title': t.learnTitle, learn1: t.learn1, learn2: t.learn2, learn3: t.learn3,
    'privacy-link': t.privacyLink, 'methodology-link': t.methodology, 'data-link': t.dataNotices,
  }
  for (const [id, value] of Object.entries(labels)) setText(id, value)
  for (const n of [1, 2, 3, 4, 5, 6, 7, 8] as const) { setText(`faq${n}q`, t[`faq${n}q`]); setText(`faq${n}a`, t[`faq${n}a`]) }
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
  // Attempts per second: zxcvbn's unthrottled-online, throttled-online and fast-hash rates; ~1e6 for WPA2 on one high-end GPU.
  for (const row of document.querySelectorAll<HTMLElement>('.account-time')) row.hidden = mode === 'wifi'
  setText('time-open', duration(result.guesses / 10))
  setText('time-online', duration(result.guesses / (100 / 3600)))
  setText('time-offline-label', mode === 'wifi' ? t.timeWifi : t.timeOffline)
  setText('time-offline', duration(result.guesses / (mode === 'wifi' ? 1e6 : 1e10)))
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
render()
// The worker only caches the site's own static files, so later visits open offline.
if (import.meta.env.PROD && 'serviceWorker' in navigator) navigator.serviceWorker.register(`${import.meta.env.BASE_URL}sw.js`).catch(() => {})
