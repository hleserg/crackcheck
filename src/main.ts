import './style.css'
import { analyze } from './engine'
import { checkPwnedPassword } from './hibp'
import { strings, type Locale } from './i18n'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="shell">
    <header class="topbar"><a class="brand" href="#top" aria-label="CrackCheck home"><span class="brand-mark">C<span>•</span></span><span>CrackCheck</span></a><button id="locale" class="small-button" type="button" aria-label="Switch language">EN</button></header>
    <main id="top">
      <section class="hero" aria-labelledby="title"><p class="eyebrow" id="eyebrow"></p><h1 id="title"></h1><p class="lead" id="subtitle"></p></section>
      <section class="workspace" aria-label="Password analysis">
        <div class="entry"><div class="entry-head"><label for="password" id="password-label"></label><span class="privacy-badge"><span class="badge-dot"></span><span id="local"></span></span></div>
          <div class="input-row"><input id="password" type="password" autocomplete="off" autocapitalize="off" spellcheck="false" inputmode="text" /><button id="show" class="input-button" type="button"></button><button id="clear" class="input-button" type="button"></button></div>
          <p class="privacy-note" id="privacy"></p><div class="mode-row"><span id="mode-label"></span><div class="segmented" role="group" aria-label="Analysis scenario"><button id="account" type="button" aria-pressed="true"></button><button id="wifi" type="button" aria-pressed="false"></button></div></div>
        </div>
        <div id="wifi-explanation" class="wifi-note" hidden></div>
        <div class="analysis" id="analysis"><p class="empty" id="empty"></p><div id="result" hidden><div class="result-head"><div><span class="section-kicker" id="result-label"></span><h2 id="score"></h2></div><div class="score-index" id="score-index"></div></div><div class="meter" aria-hidden="true"><span id="meter-fill"></span></div><div class="guess-row"><div><span class="section-kicker" id="guesses-label"></span><p class="guesses" id="guesses"></p></div></div><p class="model" id="model"></p><p class="model" id="translit-note" hidden></p><div class="divider"></div><h3 id="seen"></h3><ol class="patterns" id="patterns"></ol><div class="advice"><h3 id="suggestion"></h3><p id="advice-text"></p></div></div></div>
      </section>
      <section class="hibp-section"><div><span class="section-kicker">OPT-IN · HIBP</span><h2 id="hibp-title"></h2><p id="hibp-text"></p></div><div class="hibp-actions"><label class="network-switch"><input id="network-off" type="checkbox" checked /><span id="network-off-label"></span></label><button class="primary-button" id="hibp-button" type="button"></button><p id="hibp-status" role="status" aria-live="polite"></p></div></section>
      <section class="learn"><span class="section-kicker">CRACKCHECK / 01</span><h2 id="learn-title"></h2><div class="learn-grid"><p id="learn1"></p><p id="learn2"></p><p id="learn3"></p></div></section>
    </main><footer><span>CrackCheck · MIT</span><nav><a id="privacy-link" href="https://github.com/hleserg/crackcheck/blob/main/docs/privacy.md"></a><a id="methodology-link" href="https://github.com/hleserg/crackcheck/blob/main/docs/methodology.md"></a></nav></footer>
  </div>`

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T
const passwordInput = $<HTMLInputElement>('password')
let locale: Locale = navigator.language.toLowerCase().startsWith('ru') ? 'ru' : 'en'
let mode: 'account' | 'wifi' = 'account'
let hibpController: AbortController | null = null
let requestVersion = 0

function setText(id: string, value: string) { $(id).textContent = value }
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
  const labels: Record<string, string> = {
    eyebrow: t.eyebrow, title: t.title, subtitle: t.subtitle, 'password-label': t.password,
    local: t.local, privacy: t.privacy, 'mode-label': t.mode, account: t.account, wifi: t.wifi,
    'wifi-explanation': t.wifiText, empty: t.empty, 'result-label': t.result, 'guesses-label': t.guesses,
    model: t.model, seen: t.seen, suggestion: t.suggestion, 'advice-text': t.advice,
    'hibp-title': t.hibpTitle, 'hibp-text': t.hibpText, 'hibp-button': t.hibpButton, 'network-off-label': t.networkOff,
    'learn-title': t.learnTitle, learn1: t.learn1, learn2: t.learn2, learn3: t.learn3,
    'privacy-link': t.privacyLink, 'methodology-link': t.methodology,
  }
  for (const [id, value] of Object.entries(labels)) setText(id, value)
  setText('local', $<HTMLInputElement>('network-off').checked ? t.local : t.hibpReady)
  passwordInput.placeholder = t.placeholder
  $('show').textContent = passwordInput.type === 'password' ? t.show : t.hide
  $('clear').textContent = t.clear
  $('locale').textContent = locale === 'ru' ? 'EN' : 'RU'
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
  setText('translit-note', t.translitNote)
  setText('guesses', new Intl.NumberFormat(locale).format(Math.round(result.guesses)))
  const list = $('patterns')
  list.replaceChildren()
  for (const pattern of result.patterns) {
    const item = document.createElement('li')
    const label = document.createElement('strong')
    label.textContent = t.details[pattern.detail as keyof typeof t.details] || t.details.unrecognized
    const length = document.createElement('span')
    length.textContent = pattern.length === null ? '' : `${pattern.length} ${t.chars}`
    item.append(label, length)
    list.append(item)
  }
}

passwordInput.addEventListener('input', () => { invalidateHibp(); render() })
$('show').addEventListener('click', () => { passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password'; render(); passwordInput.focus() })
$('clear').addEventListener('click', () => { passwordInput.value = ''; invalidateHibp(); render(); passwordInput.focus() })
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
