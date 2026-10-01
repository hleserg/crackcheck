import './style.css'
import { strings, type Locale } from './i18n'
import { business, renderChapter } from './threats'

const app = document.querySelector<HTMLDivElement>('#app')!
app.innerHTML = `
  <div class="shell">
    <header class="topbar"><a class="brand" href="./"><span class="brand-mark">C<span>•</span></span><span>CrackCheck</span></a><button id="locale" class="small-button" type="button"></button></header>
    <main class="story chapter-page" id="business"></main>
  </div>`

let locale: Locale = 'ru'
const toggle = document.querySelector<HTMLButtonElement>('#locale')!
function render() {
  document.documentElement.lang = locale
  document.title = `CrackCheck — ${business[locale].title}`
  toggle.textContent = locale === 'ru' ? 'EN' : 'RU'
  toggle.lang = locale === 'ru' ? 'en' : 'ru'
  toggle.setAttribute('aria-label', strings[locale].localeLabel)
  renderChapter(document.querySelector('#business')!, business[locale], 'h1')
}
toggle.addEventListener('click', () => { locale = locale === 'ru' ? 'en' : 'ru'; render() })
render()
