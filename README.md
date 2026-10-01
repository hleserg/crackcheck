# CrackCheck

Repository: <https://github.com/hleserg/crackcheck>

**Локальный, объяснимый анализ стойкости паролей.** CrackCheck помогает увидеть, какие знакомые слова и конструкции алгоритм подбора проверит раньше.

> Пароль анализируется в браузере. Сетевая проверка известных утечек запускается отдельно и только по запросу.

Проект находится в ранней версии. В текущем исходном коде есть статическое приложение, анализ через `zxcvbn-ts`, русская и английская локализация интерфейса, режим Wi‑Fi / WPA2-Personal и отдельная проверка HIBP по кнопке. Рабочая версия опубликована: https://hleserg.github.io/crackcheck/.

## Сейчас в коде

- статическое приложение на TypeScript и Vite без обязательного backend;
- оценка на основе `zxcvbn-ts`, с объяснением распознанных шаблонов и числа догадок;
- интерфейс на русском и английском;
- образовательный режим для собственных Wi‑Fi паролей WPA2-Personal;
- отдельная opt-in проверка Have I Been Pwned (HIBP).

Для переводов и словарей используется официальный пакет `@zxcvbn-ts/language-ru@4.1.0`. Большие словари пакета представлены латинской транслитерацией: сами по себе они не распознают русские строки вроде `пароль` или `привет`. CrackCheck дополнительно проверяет транслитерированный кандидат, только если каждое кириллическое слово от четырёх букв точно найдено в ранжированном `commonWords-ru`; итоговую оценку по-прежнему вычисляет zxcvbn-ts. Это ограниченная app-level эвристика, а не отдельный upstream matcher. Имена и фамилии в пакете берутся из русских locale-файлов FakerJS (MIT), однако их ревизия в генераторе не закреплена, поэтому эти списки используются только для объяснения распознанного имени, а не для ранжирования догадок. README пакета ошибочно ссылается на турецкие locale-файлы. Подробности — в [`docs/data-sources.md`](docs/data-sources.md).

Граф JCUKEN в `src/russianGraph.json` сгенерирован по upstream-коммиту `zxcvbn-ts/zxcvbn` `5782aa3` и интегрирован локально. Он не входит в опубликованный npm-пакет `language-ru`.

Необязательные словари `wikipedia-en` и `wikipedia-ru` исключены из браузерной сборки до аудита их происхождения и лицензий. Условия используемых данных приведены в [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).

## Конфиденциальность

Основной анализ рассчитан на выполнение на устройстве после загрузки приложения. Он не требует отправки пароля на сервер CrackCheck. Вводимый пароль не должен сохраняться в постоянном хранилище браузера или попадать в URL.

HIBP — отдельная сетевая функция: перед запуском интерфейс должен сообщить о запросе. Для Pwned Passwords используется k-anonymity: SHA-1 вычисляется локально, а сервису отправляются только первые пять шестнадцатеричных символов хеша. Сам пароль и полный хеш не отправляются. Подробности — в [модели конфиденциальности](docs/privacy.md) и [`SECURITY.md`](SECURITY.md).

Это описание проектных требований, а не независимый аудит уже опубликованного сайта. Перед использованием на особо чувствительных данных изучите исходный код и собранные зависимости.

## Локальная разработка

Требуются Node.js и npm.

```sh
npm install
npm run dev
```

Доступные команды:

```sh
npm run typecheck
npm run lint
npm test
npm run build
```

Production-сборка сама по себе не означает, что сайт опубликован.

## Принципы оценки

CrackCheck не сводит стойкость к галочкам «цифра + заглавная буква + символ». Оценка зависит от распознаваемых шаблонов и словарей. Число догадок — модельная оценка, а не обещание времени взлома. Время можно интерпретировать только вместе с конкретной моделью атакующего, алгоритмом хранения пароля и доступными ему ресурсами.

Wi‑Fi режим предназначен для оценки собственного пароля и объяснения сценария WPA2-Personal. Проект не захватывает сетевой трафик, не получает handshake и не автоматизирует атаки.

## Лицензии

Код CrackCheck распространяется по MIT, если файл [`LICENSE`](LICENSE) не указывает иное. Лицензии сторонних библиотек и наборов данных отдельны: MIT не распространяется автоматически на словари и иные данные. См. [`NOTICE.md`](NOTICE.md) и [`docs/data-sources.md`](docs/data-sources.md).

## Участие

Исправления, переводы и улучшения приветствуются. Перед отправкой изменений ознакомьтесь с [`CONTRIBUTING.md`](CONTRIBUTING.md). Для сообщения о проблеме безопасности используйте порядок из [`SECURITY.md`](SECURITY.md).

## English

CrackCheck is a live, early-stage, local-first password crackability explainer. The app is a static TypeScript/Vite frontend using `zxcvbn-ts`, with Russian and English UI, an educational WPA2-Personal mode, and an optional, explicitly triggered HIBP check. Repository: <https://github.com/hleserg/crackcheck>.

Live app: https://hleserg.github.io/crackcheck/. Russian dictionary coverage is incomplete. It uses the official `@zxcvbn-ts/language-ru@4.1.0` package for Russian translations and dictionaries; its major dictionaries are Latin transliterations and do not directly match raw Cyrillic words. CrackCheck checks a transliterated candidate only when every Cyrillic run of four or more letters matches the ranked `commonWords-ru` list; zxcvbn-ts still calculates the estimate. Without Cyrillic input, it also tries Latin key runs as Russian typed with the English layout (`ctvmz` → `семья`): each run must map to a ranked `commonWords-ru` word under the same rule and must not be an English dictionary word or name. The upstream generator uses Russian FakerJS locale files (MIT) for first names and surnames, although the package README mistakenly links Turkish locale files; these lists are not population-ranked and are used only to label detected names, not to score guesses; the published generator does not pin the Faker revision. CrackCheck's JCUKEN graph was generated from upstream commit `5782aa3` and is integrated locally; it is not shipped in that npm package. HIBP requires a separate network request and uses the Pwned Passwords k-anonymity range protocol: only the first five hexadecimal characters of a locally computed SHA-1 hash are sent. See [privacy details](docs/privacy.md) and [data source status](docs/data-sources.md).
