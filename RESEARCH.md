# Глубокое исследование: данные и лицензии для upstream‑пакета `@zxcvbn-ts/language-ru`

## TL;DR

- **Лучший немедленно применимый источник фамилий** — датасет `rustemgareev/russian-surnames` на Hugging Face (≈318 тыс. строк, кириллица + латиница + пол, лицензия CC BY‑SA 4.0), но у него два блокера: (а) отсутствует явный frequency rank и (б) CC BY‑SA 4.0 — это share‑alike лицензия, конфликтующая с тем, как upstream распространяет данные, поэтому её нельзя молча зашить в MIT‑пакет; лучший «легально чистый» частотный ранг даёт список Журавлёва (Институт русского языка РАН, 500/1006 позиций), но он под неясной/CC BY‑NC‑ND лицензией и потому непригоден к перераспространению без разрешения.
- **По лицензиям главный вывод**: upstream уже возит данные не под MIT, а под их собственными лицензиями — согласно Migration guide zxcvbn-ts (zxcvbn-ts.github.io/zxcvbn/guide/migration/), «BEWARE The commonWords.json file had always the license ODC-BY. It was just miscommunicated inside @zxcvbn-ts but now the correct license notice was added» (источник переехал на https://opus.nlpl.eu/datasets/OpenSubtitles от 2024), а код пакета — MIT; значит для русских фамилий/имён реалистичны варианты B (отдельная data‑лицензия/NOTICE) или D (источник под либеральной лицензией, как в польском пакете, взявшем CC0‑данные польского госпортала).
- **Что можно отдать Codex прямо сейчас**: имена (`rustemgareev/russian-names`, 12 311 записей с popularity_rank, из ЕГР ЗАГС, CC BY‑SA 4.0), раскладку ЙЦУКЕН из машиночитаемого `xkeyboard-config` (`symbols/ru`, вариант по умолчанию — «Russian», не `winkeys`/`typewriter`), таблицу транслитераций (ГОСТ/ICAO/ISO 9/BGN‑PCGN) и рекомендацию по ё/е и гомоглифам (UTS #39 confusables) как отдельные follow‑up PR; но по всем трём данным (фамилии, имена, commonWords) нужно решение мейнтейнера по share‑alike лицензиям — это критический путь.

---

## Executive summary

Главный итог: **идеального источника русских фамилий (одновременно с частотой, большим покрытием, понятным provenance и либеральной лицензией) не существует в открытом доступе** — это допустимый и, судя по широте поиска, достоверный результат. Практический выход — комбинировать источники: большой список фамилий из `rustemgareev/russian-surnames`, а порядок (ranking) — либо из встроенных в него данных, если там есть частота, либо накладывается из отдельного частотного источника (Журавлёв). Обе опции упираются в лицензионный вопрос CC BY‑SA → MIT, который **должен решать мейнтейнер upstream** (это вопрос политики проекта, а не однозначного «можно/нельзя»).

Прецедент у проекта уже есть: `commonWords.json` во всех языковых пакетах распространяется не под MIT, а под ODC‑BY, с явным NOTICE. Значит архитектурно допустимо возить data‑субкомпонент под отдельной лицензией. Но ODC‑BY (attribution) и CC BY‑SA (attribution + share‑alike) — разные вещи; share‑alike агрессивнее, и именно поэтому польский пакет специально выбрал CC0‑данные для имён/фамилий. [socket](https://socket.dev/npm/package/@zxcvbn-ts/language-pl)

---

## 1. Surnames — таблица всех серьёзных источников

| Источник | Владелец/автор | Первоисточник | Размер | Частота? | Лицензия | Перераспр./модиф. | Пригодность для zxcvbn |
|---|---|---|---|---|---|---|---|
| **`rustemgareev/russian-surnames`** (HF) | Rustem Gareev | не задекларирован явно на карточке (по аналогии с sibling — ЕГР ЗАГС) | ≈318 тыс. строк | не подтверждено | CC BY‑SA 4.0 (метаданные автора) | да, но share‑alike | Высокая по покрытию; блокер — share‑alike + неподтверждённый rank |
| **Список Журавлёва** (`rulexicon::freq_last_names`) | А. Ф. Журавлёв (ИРЯ РАН); упаковка — Д. О. Афанасьев | «К статистике русских фамилий. I», Вопросы ономастики №2, 2005, hdl:10995/1929 | 1006 строк (500 муж. + дозеркалено) | **да**, относит. частота | автором не указана; журнал CC BY‑NC‑ND 4.0 | **нет** (NC + ND) | Отличный ranking, но легально непригоден |
| **`datacoon/russiannames`** (Zenodo) | Иван Бегтин / Infoculture | сборная БД имён/фамилий/отчеств РФ | ~375 тыс. фамилий | частично (для гендера, не популяц. rank) | CC BY‑SA («by default»), DOI 10.5281/zenodo.2747011 | да, share‑alike | Среднее; share‑alike, rank не популяционный |
| **`sorokinpf/russian_names`** (GitHub) | Павел Сорокин | не указан; Jupyter‑ноутбуки репозитория | десятки тыс. | заявлено «по частоте», но не задокументировано | **LICENSE отсутствует** | нельзя без разрешения | technically useful, legally unusable for upstream redistribution without permission |
| **census.name / familynames.org / surnam.es** | коммерч./SEO‑агрегаторы | «own database» / соцсети | разное | да | проприетарная/платная | нет | Не годятся: provenance мутный, лицензии нет |
| **Unbegaun (1972/1989)** | Б. Г. Унбегаун | адресная книга СПб 1910 г. | 100 фамилий | да | под копирайтом (Oxford UP) | нет | Только исторический референс |

### Лучший кандидат и fallback

- **Лучший кандидат (по покрытию):** `rustemgareev/russian-surnames`. Провенанс правдоподобен (тот же автор, что и `russian-names`, где явно указано «based on statistics published by the Unified State Register of Civil Status Records (EGR [Hugging Face](https://huggingface.co/datasets/ssuverin/russian-names) ZAGS) as of July 2025»), [Hugging Face](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md) лицензия задекларирована (CC BY‑SA 4.0; это corroborated сторонним агрегатором WorldNames.info Data Sources page: «Some data is published under CC BY-SA 4.0 (Share-Alike) — specifically Spain (INE) and Russia (rustemgareev)... you must attribute»), есть кириллица + латиница + пол. **Два блокера до имплементации:** (1) подтвердить наличие/семантику частотного столбца на карточке; (2) получить одобрение мейнтейнера на share‑alike данные (см. раздел 4).
- **Лучший источник ranking (по качеству):** список Журавлёва (ИРЯ РАН) — академический, признанный, общероссийский. Но лицензия (журнал под CC BY‑NC‑ND) делает его **непригодным** для перераспространения и модификации в MIT‑пакете. Использовать как «эталон для сверки», а не как поставляемые данные.
- **Наименее плохой юридически чистый fallback:** сгенерировать список фамилий из **OpenSubtitles/OPUS 2024** (тот же источник, что `commonWords`, ODC‑BY) — но там нет чистого разделения «фамилия/не фамилия» и нет популяционной частоты, только частота в субтитрах. Юридически совместимо, но качество как surname‑словаря ниже.

---

## 2. Уже известные surname datasets — перепроверка

### A. `sorokinpf/russian_names`

- Репозиторий: 5 коммитов, ветка `master`, папка `other`, ноутбуки `namelist_builder.ipynb` и `surnamelist_builder.ipynb`, готовые файлы (`russian_surnames.csv/.txt`, `russian_trans_surnames.*`, `surnames.jsonl` и др.). README: «Словари имен и фамилий отсортированы по частоте использования». [github](https://github.com/sorokinpf/russian_names) Есть транслитерация (`*_trans_*`).
- **Лицензия отсутствует** — нет файла LICENSE, раздел Releases пуст, лицензия в интерфейсе GitHub не отображается. Автор — Павел Сорокин (профиль со ссылкой на Telegram `t.me/sorokinpf`, специализация — security/wordlists).
- Происхождение частотного ранга **не задокументировано**: ноутбуки называются «builder», но исходные данные и метод сортировки в README не описаны.
- **Вывод: technically useful, legally unusable for upstream redistribution without permission.** Путь для связи (без самостоятельного контакта): issue‑трекер (`/issues`, 1 открытый) или Telegram из профиля. Контакт должен инициировать мейнтейнер/владелец проекта.

### B. `rustemgareev/russian-surnames`

- По профилю автора (`huggingface.co/rustemgareev/datasets`): «russian-surnames [huggingface](https://huggingface.co/rustemgareev/datasets) — Viewer • Updated Aug 23 • 318k», т.е. ≈318 тыс. строк, обновление 23 августа 2025. Метаданные автора для его русских датасетов — CC BY‑SA 4.0 (подтверждено на sibling `russian-names`; агрегатор world‑names.info также относит «Russia (rustemgareev)» [World-names](https://world-names.info/sources/) к CC BY‑SA 4.0).
- **Provenance:** карточку surname‑датасета открыть не удалось (Hugging Face блокировал автоматический доступ). По аналогии с sibling — статистика ЕГР ЗАГС; **предположение**, требующее ручной проверки карточки.
- **Frequency rank:** не подтверждён. В sibling `russian-names` есть `popularity_rank`/`popularity_score`, [Hugging Face](https://huggingface.co/datasets/ssuverin/russian-names) [huggingface](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md) поэтому вероятно, что и surnames содержит аналогичные поля — но это **не проверенный факт**.
- **Достаточно ли CC BY‑SA автора для этих данных?** Юридически спорно. Если источник — госстатистика ЕГР ЗАГС, то на само содержание могут не распространяться авторские права (факты/данные), и автор вправе лицензировать свою компиляцию под CC BY‑SA. Но это не снимает share‑alike обязательства для того, кто далее перераспространяет компиляцию.
- **Можно ли ранжировать список из другого источника?** Технически да: взять список фамилий из одного источника и наложить порядок из другого. Но лицензионно это создаёт **производное от обоих** источников, и обязательства обеих лицензий складываются.

---

## 3. First names dataset — `rustemgareev/russian-names`

- **Факты с карточки (проверено):** 12 311 записей (HF README: «num_examples: 12311»); поля `name_cyrl`, `name_latn`, `gender` (m/f), `popularity_rank` (int32), `popularity_score` (float32, 0–1), `rarity_rank`, `rarity_score`. Лицензия — **CC BY‑SA 4.0** (HF README verbatim: «The dataset is distributed under the Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0) license»). `annotations_creators: machine-generated`, `source_datasets: original`. [huggingface](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md)
- **Цепочка provenance:** карточка прямо заявляет: «The data is based on statistics published by the Unified State Register of Civil Status Records (EGR [Hugging Face](https://huggingface.co/datasets/ssuverin/russian-names) ZAGS) as of July 2025». [huggingface](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md) Это связывает датасет → ЕГР ЗАГС (оператор — ФНС России). Первичная статистика публично доступна на портале ЕГР ЗАГС (сервис «Имена»); прямой machine‑readable выгрузки ФНС я не нашёл (раздел 5).
- **Как считался popularity_score:** метод на карточке не раскрыт (лишь «нормализованный ранг 0–1»). [Hugging Face](https://huggingface.co/datasets/ssuverin/russian-names) [huggingface](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md) **Пробел.**
- **Population/time window:** «as of July 2025» — срез на июль 2025. Сервис «Имена» строится на реальных именах детей, зарегистрированных с 1 октября 2018 г., плюс полный перечень имён с 1926 г.; то есть это скорее **birth‑names** (имена новорождённых), а не population‑wide срез всех живущих. Для password‑guessing это важно: имена новорождённых смещены к современной моде, тогда как пароли создают взрослые. Смещение (bias) есть, но топ русских имён стабилен, и список остаётся полезным.
- **Федеральная или региональная:** ЕГР ЗАГС — федеральный реестр (вся РФ), список федеральный, «multinational given names in Russia» [Hugging Face](https://huggingface.co/datasets/ssuverin/russian-names) [huggingface](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md) (включая имена народов РФ).
- **Сверка top‑значений с официальным источником:** официальные данные дают в топе тех же лидеров — по РФ 2023: мальчики Михаил, Артём, Александр, Матвей, Максим; девочки София, Ева, Анна, Мария, Виктория [Interfax](https://www.interfax.ru/russia/922104) (ЕГР ЗАГС/Интерфакс). На конец 2025/2026 лидеры — Михаил и София [Mail.ru](https://news.mail.ru/society/72492477/) (портал «Реестр ЗАГС»). Согласуется с ожидаемым порядком и подтверждает правдоподобность датасета.
- **Пригодность:** высокая — лучший из найденных источников имён (частота + транслитерация + пол + понятный provenance). Единственный блокер — та же CC BY‑SA 4.0.

---

## 4. Лицензионный вопрос CC BY‑SA → MIT

Отдельный критический раздел. Я **не даю юридического заключения**, а излагаю факты и практические варианты.

### Факты об инструментах Creative Commons и правах на данные

- **CC BY‑SA 4.0** требует (a) attribution и (b) **ShareAlike**: любой «Adapted Material» должен распространяться под той же или совместимой лицензией. Ключевое отличие от CC BY/ODC‑BY, где share‑alike нет.
- Понятия для разграничения (по официальным текстам CC): **Adapted Material** (производное), **Database Rights** (sui generis права на БД, отдельно от копирайта), **substantial portion/extraction** (извлечение существенной части БД триггерит лицензию), **collection/aggregation** (простое соседство в сборнике — не обязательно adaptation).
- **Различие лицензии кода и данных:** для датасета словари/факты — это данные, и лицензия данных (CC BY‑SA) действует **независимо** от лицензии кода (MIT). Возможен dual licensing: код под MIT, data‑субкомпонент под своей лицензией.
- **Требования npm:** поле `license` в `package.json` описывает лицензию пакета; данные под иной лицензией фиксируются через отдельный LICENSE/NOTICE файл и упоминание в README.

### Прецедент в самом zxcvbn‑ts (важнее всего)

- Миграционный гайд v4 прямо гласит: «**BEWARE** The commonWords.json file had always the license ODC‑BY. It was just miscommunicated inside @zxcvbn‑ts but now the correct license notice was added». [Zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/guide/migration/) То есть **проект уже возит данные не под MIT**, а под ODC‑BY, с отдельным license notice. Источник `commonWords` переехал «from https://github.com/hermitdave/FrequencyWords from 2018 to directly use the source https://opus.nlpl.eu/datasets/OpenSubtitles from 2024». [Zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/guide/migration/)
- **FrequencyWords** (hermitdave) сам заявляет: «MIT License for code. CC‑by‑sa‑4.0 for content». [GitHub](https://github.com/hermitdave/FrequencyWords) То есть CC BY‑SA‑контент в экосистеме уже фигурировал — но upstream осознанно перешёл на OpenSubtitles/OPUS напрямую под **ODC‑BY** (attribution без share‑alike), что чище для дистрибуции.
- **Польский пакет (`language-pl`)** — самый релевантный прецедент для антропонимики. README `@zxcvbn-ts/language-pl` (npmjs.com) verbatim: «The first and last name data used as a dictionary for zxcvbn-ts are extracted from files available on the Polish Government Data Portal. These lists are ranked by popularity and consist of the names of individuals registered in the Polish Universal Electronic System for Population Register (PESEL)... commonWords.json is generated from the OPUS 2024 OpenSubtitles list, which is licensed under ODC-BY. The Polish dictionary and language package was prepared by Oskar Gmerek.» Датасеты имён и фамилий на польском госпортале — под **CC0 1.0** (public domain). Мейнтейнеры сознательно предпочли CC0‑госданные, избегая share‑alike.

### Таблица: язык | датасет | лицензия данных | возится в npm? | лицензия пакета | attribution | примечание

| Язык | Датасет (firstname/lastname) | Лицензия данных | В npm | Лицензия пакета | Attribution | Примечание |
|---|---|---|---|---|---|---|
| common (все) | OpenSubtitles/OPUS 2024 (`commonWords`) | ODC‑BY | да | MIT (код) | да, NOTICE | Прецедент «данные ≠ MIT» |
| pl | Polish gov data portal / PESEL | **CC0 1.0** (имена/фамилии); commonWords — ODC‑BY | да | MIT | да | Осознанный выбор CC0 |
| nl‑be | statbel (бельг. открытые данные) | не указана в README | да | MIT | ссылки на statbel | Лицензия данных не задекларирована |
| id | FrequencyWords 2018 + Wiktionary | не указана | да | MIT | нет явной | Старый пакет, лицензии не прописаны |
| en/fr/… | OpenSubtitles/OPUS 2024 | ODC‑BY | да | MIT | да | Единый шаблон v4 |

### Практические варианты для русских фамилий/имён

- **A. Безопасно (рекомендуется, если достижимо):** данные под **CC0 или attribution‑only без share‑alike** — по образцу польского пакета. Прямого CC0‑аналога PESEL‑реестра для России я не нашёл; ближайшее — открытые данные ЕГР ЗАГС/региональных порталов, если их terms of use это допускают (раздел 5). Требует проверки конкретного набора.
- **B. Возможно, с отдельной data‑лицензией:** возить русские словари как data‑субкомпонент под CC BY‑SA 4.0 с NOTICE/attribution — по образцу ODC‑BY у `commonWords`. Но CC BY‑SA **строже** ODC‑BY (share‑alike распространяется на производные), поэтому это **требует явного согласия мейнтейнера**, а не по аналогии.
- **C. Требует одобрения мейнтейнера:** любой вариант с `rustemgareev/*` (CC BY‑SA 4.0) или `datacoon/russiannames` (CC BY‑SA) — из‑за share‑alike. Вероятно, основной реалистичный путь, но решение — за upstream.
- **D. Лучше выбрать другой датасет:** сгенерировать фамилии/имена из OpenSubtitles/OPUS 2024 (ODC‑BY, уже в экосистеме) — юридически чище всего, но хуже по качеству и без популяционной частоты.

**Вывод для критического пути:** имена почти решены на уровне данных (`rustemgareev/russian-names`), но и они, и лучший источник фамилий упираются в CC BY‑SA. **Прежде чем Codex зашьёт данные в пакет, нужно решение мейнтейнера по варианту B/C против A/D.**

---

## 5. Official / open Russian name statistics

- **ЕГР ЗАГС (оператор — ФНС России):** интерактивный сервис «Имена» (запущен 22 сентября 2023). Подбор строится «на основании 5 тыс. реальных уникальных имён детей, рождение которых зарегистрировано в реестре ЗАГС с 1 октября 2018 года»; [Habr](https://habr.com/ru/news/762776/) также размещён «полный перечень имён детей, рождённых с 1926 года… расположены в порядке от самого популярного до самого редкого за последние сто лет». [Oboz](https://oboz.info/na-portale-zags-rossii-zapustili-novyj-interaktivnyj-servis-podbora-imeni-rebenku/) Раздел «Аналитика» — топ‑5 имён по регионам за 2021–2023. [Interfax](https://www.interfax.ru/russia/922104) Это **имена**, ранжированные по популярности. **Прямой machine‑readable выгрузки (CSV/JSON/API) не обнаружено** — сервис интерактивный. Отдельного downloadable **surname** ranking на ЕГР ЗАГС нет.
- **Портал «Реестр ЗАГС» (информационно‑аналитический):** актуальная статистика имён новорождённых (например, на 25 сентября 2026: София — 13 871 девочка, Михаил — 18 386 мальчиков, [Mail.ru](https://news.mail.ru/society/72492477/) с разбивкой по регионам). Тоже имена, не фамилии.
- **data.mos.ru (Портал открытых данных Правительства Москвы):** наборы «Сведения о наиболее популярных мужских именах среди новорождённых» и женский аналог — «100 популярных … имён, присвоенных при регистрации рождения в Москве с 2015 года по настоящее время с разбивкой по месяцам». [Mos](https://data.mos.ru/opendata/7704111479-svedeniya-o-naibolee-populyarnyh-mujskih-imenah-sredi-novorojdennyh) Есть счётчики (просмотры/скачивания), набор скачиваемый. Материал на основе `data.mos.ru`, `zags.mos.ru`. [Mos](https://data.mos.ru/opendata/7704111479-svedeniya-o-naibolee-populyarnyh-mujskih-imenah-sredi-novorojdennyh) **Лицензию/terms of use конкретного набора нужно проверить на карточке** — ключ к варианту A из раздела 4. На момент исследования один набор был помечен «На данный момент набор данных не доступен». [Mos](https://data.mos.ru/opendata/7704111479-svedeniya-o-naibolee-populyarnyh-mujskih-imenah-sredi-novorojdennyh)
- **Росстат / перепись:** сам Журавлёв (2005) отмечает, что перепись ономастических подсчётов не даёт и что «серьёзной, вызывающей доверие социальной статистики… никогда и не существовало». [urfu](https://elar.urfu.ru/bitstream/10995/1929/1/VO-2005-02-11.pdf) Публичного downloadable surname‑ranking от Росстата не выявлено.
- **Итог:** для **имён** официальный ранжированный источник существует (ЕГР ЗАГС + data.mos.ru), но без явного открытого API; для **фамилий** официального downloadable ranking, судя по всему, **нет** — это корень проблемы раздела 1.

*(Метод: никакие authentication/anti‑bot механизмы не обходились; использованы только публичные интерфейсы и то, что вернул обычный поиск.)*

---

## 6. Русская клавиатура — authoritative mapping

- **Authoritative machine‑readable источник:** `xkeyboard-config` (freedesktop.org), файл `symbols/ru` — фактический mapping, а не картинка. Доступен в git freedesktop (`cgit.freedesktop.org/xkeyboard-config/tree/symbols/ru`). Содержит base‑слой, shift‑слой, ё, пунктуацию и множество вариантов.
- **Варианты в `symbols/ru`** (из официального списка xkeyboard‑config): базовый `ru` («Russian»), `ru(winkeys)` (для Windows‑нестандартизированных нацвариантов), `ru(typewriter)`/`ru(typewriter-legacy)` (машинописная), `ru(phonetic)`/`ru(phonetic_winkeys)` (фонетические), плюс раскладки языков народов РФ (tt, sah, xal, udm…). Правило: `winkeys` — «for variants which are not standardized nationally but used in Microsoft Windows». [xkeyboard-config](https://xkeyboard-config.freedesktop.org/doc/contributing/)
- **Стандартная ЙЦУКЕН (JCUKEN)** — три буквенных ряда: верхний `й ц у к е н г ш щ з х ъ`, средний `ф ы в а п р о л д ж э`, нижний `я ч с м и т ь б ю`, плюс ё (отдельная клавиша) и цифровой ряд с пунктуацией.
- **Что добавлять как default `Russian` graph в zxcvbn‑ts:** базовый вариант **`ru` («Russian»)**, а не `winkeys` и не `typewriter`. Обоснование: Müller et al. (2025, Baltic J. Modern Computing 13(4):919–932) прямо указывает, что ЙЦУКЕН — «the default Russian keyboard layout available in different operating systems, such as Windows, ChromeOS or Ubuntu» [lu](https://www.bjmc.lu.lv/fileadmin/user_upload/lu_portal/projekti/bjmc/Contents/13_4_09_Muller.pdf) и самый распространённый кириллический layout. `typewriter`/`phonetic` — нишевые, как опциональные доп. графы.
- **Практическое замечание:** для password‑matcher важна физическая смежность клавиш (keyboard walks вроде «фыва», «йцукен», «ячсм»), которую кодирует adjacency‑graph. Mapping из `symbols/ru` даёт нужные позиции без копирования copyrighted‑изображений.

---

## 7. Transliteration — mapping + системы + практическая релевантность

Интересует не «правильная» транслитерация, а множество предсказуемых трансформаций в паролях (Сергей→sergey/sergei/sergej и т.п.).

### Основные системы
- **ГОСТ** (ГОСТ 7.79‑2000 / система Б; ГОСТ Р 52535.1 для загранпаспортов до 2013),
- **ICAO Doc 9303** (текущая паспортная транслитерация РФ),
- **ISO 9** (строго обратимая, диакритика),
- **BGN/PCGN** (англо‑американская),
- **common internet / «бытовая»** (Yandex/Google‑подобные соглашения) — самая релевантная для паролей.

### Mapping для букв с вариантами

| Буква | Варианты латиницей |
|---|---|
| й | y / i / j (Сергей → sergey/sergei/sergej) |
| ё | e / yo / jo |
| ж | zh / j / g |
| х | kh / h / x |
| ц | ts / c / tz |
| ч | ch / tch |
| ш | sh / w |
| щ | sch / shch / shh |
| ы | y / i |
| э | e / eh |
| ю | yu / ju / iu |
| я | ya / ja / ia |
| ь | ' / (опускается) / j |
| ъ | '' / (опускается) |

Примеры множественности: Алексей → alexey/alexei/aleksey/aleksei; Дмитрий → dmitry/dmitriy/dmitri/dmitrij.

### Frequency evidence
- Академический источник по расхождениям транслитераций именно в паролях найти не удалось; ближайшее прямое свидетельство — Müller et al. (2025) о другом феномене (раздел 8/10). Поэтому частотность конкретных вариантов транслитерации помечена как **пробел** — в перспективе оценить на OpenSubtitles/именных корпусах, а не хардкодить веса.
- Wikipedia‑статьи о фамилиях подтверждают вариативность как реальное явление (напр., Alexeyev/Alekseyev/Alexeiev/Alexeev/Alekseev [Wikipedia](https://en.wikipedia.org/wiki/Alexeyev) — параллельные транслитерации одной фамилии).

### Может ли существующая логика zxcvbn поймать это?
- У zxcvbn‑ts **нет** встроенного Левенштейна для словарных матчей; l33t‑matcher работает по таблице подстановок, а не по edit‑distance. Значит часть транслитерационных вариантов не поймается автоматически. Практичный путь — **включать несколько транслитераций каждого имени/фамилии прямо в словарь** (как уже делает `russian-names` полем `name_latn`), а не рассчитывать на нечёткое сопоставление.

---

## 8. Cyrillic/Latin homoglyphs — mapping + предлагаемая архитектура

- **Предсказуемые смешанные пары** (визуально идентичные кириллица↔латиница): а↔a, с↔c, е↔e, о↔o, р↔p, х↔x, у↔y, к↔k, м↔m, т↔T, н↔H, в↔B, і↔i (укр.). Это ровно перечисленные в ТЗ плюс несколько прописных.
- **Authoritative источник данных:** **Unicode Security Mechanisms, UTS #39**, файл `confusables.txt` (Unicode Consortium). Машиночитаемый список «confusable» соответствий, безопасный как справочник гомоглифов.
- **Риск false positives:** высокий, если применять гомоглиф‑нормализацию глобально — легитимные латинские слова начнут матчиться на кириллические словари и наоборот, занижая оценку стойкости. Нормализацию надо ограничивать (только полный/почти полный кириллический→латинский маппинг для слова целиком, а не посимвольно вперемешку).
- **Что это в архитектуре zxcvbn:** не dictionary expansion (взрыв размера словаря) и не расширение l33t. Наиболее чистое — **core normalization / отдельный matcher**: перед словарным матчингом прогонять кандидата через опциональную гомоглиф‑нормализацию и матчить нормализованную форму, помечая находку как «mixed‑script»/homoglyph‑паттерн.
- **Рекомендация:** оформить **отдельным upstream issue/PR**, независимым от языкового пакета (это изменение ядра, не данных). В PR сослаться на UTS #39. Код в рамках исследования не пишется.

---

## 9. Ё / Е — рекомендация

- **Орфографическая практика:** в русском письме ё регулярно заменяется на е (Ковалёв↔Ковалев, Фёдоров↔Федоров). Wikipedia прямо отмечает для фамилий: из‑за неоднозначного статуса буквы ё «the surname may be written with the Cyrillic letter ye … instead, though literate Russian speakers always pronounce it yo». [Wikipedia](https://en.wikipedia.org/wiki/Kovalyov) [Wikipedia](https://en.wikipedia.org/wiki/Yevseyev)
- **Unicode:** ё (U+0451) и е (U+0435) — разные кодовые точки; NFC/NFKC‑нормализации между ними **нет**, они не схлопываются автоматически. Без явной обработки «Фёдоров» и «Федоров» — два разных словарных ключа.
- **Как проявляется в password‑list:** обе формы встречаются, причём е‑форма чаще (ё на клавиатуре отдельная и часто игнорируется). Пароль на основе фамилии почти наверняка будет в е‑форме.
- **Рекомендация:** **хранить обе формы в словаре** (генерировать е‑вариант для каждого слова с ё). Дёшево, детерминированно, не требует edit‑distance в рантайме. Дополнительно можно нормализовать ё→е на входе перед матчингом, но минимально достаточно — генерация вариантов на этапе сборки словаря.

---

## 10. Password‑specific Russian datasets

- **Ключевой академический источник:** Müller L., Juozapavičius A., Okhrimchuk V., Sütterlin S. «Dictionary Attack with Transformed Russian Words using QWERTY Keyboard Layout», Baltic Journal of Modern Computing, Vol. 13 (2025), No. 4, pp. 919–932, DOI 10.22364/bjmc.2025.13.4.09. [lu](https://www.bjmc.lu.lv/fileadmin/user_upload/lu_portal/projekti/bjmc/Contents/13_4_09_Muller.pdf) Согласно abstract, «The analysis revealed that around 1% of the passwords exactly matched transformed entries, and an additional 6% partially matched» — при сверке словаря из 50 000 трансформированных русских слов с одним миллионом уникальных русских паролей (подстановка кириллицы латиницей по позициям ЙЦУКЕН‑раскладки). Подтверждает реальность паттерна «русское слово, набранное в QWERTY‑раскладке» (напр., привет→ghbdtn).
- **Практические инструменты (не академические, иллюстративные):** `lctrcl/crwg` (Custom Russian WordList Generator) — генерирует «reverse translit» словари из ruscorpora/opencorpora [GitHub](https://github.com/lctrcl/crwg) и приводит частоты из утечек (напр., «zyltrc» = yandex — 80 раз; «drjynfrnt» = vkontakte — 766 раз). [GitHub](https://github.com/lctrcl/crwg) Блог D. Alami: «5‑е место — русские слова в английской раскладке (cfitymrf = сашенька)». [Medium](https://davidalami.medium.com/violent-nlp-part-2-patterns-in-passwords-of-russian-speaking-internet-users-c84fbb7edb96) Использовать только как качественные наблюдения о морфологии, не как источник данных.
- **Наблюдаемые паттерны паролей** (обобщённо): keyboard walks (фыва, йцукен, ячсм), reverse‑layout translit (ghbdtn), имя/фамилия + год (Сергей1988), слово + числовой суффикс (пароль123), leetspeak, смешение кириллицы/латиницы.
- **Юридический/этический статус утёкших corpora:** списки «1 млн русских паролей» — это данные утечек. **Не включать их в проект автоматически.** Для upstream допустима только **агрегированная опубликованная статистика** (проценты, топ‑паттерны из рецензируемых работ), а не сырые пароли. Сырые пароли конкретных людей — вне scope и этически недопустимы к перераспространению.

---

## 11. Existing upstream work — issues / PRs / discussions

- **Прямого русского вклада не обнаружено.** В официальном списке поддерживаемых языков (docs, последнее обновление 10 мая 2026) **нет ни русского, ни украинского**: Arabic, Czech, Croatian, Danish, German, English, Spanish, Farsi, Finnish, French, Indonesia, Italian, Japanese, Kurmanjî, Dutch (Belgium), Polish, Portuguese (Brazil), Romanian, Thai, Chinese, Turkish.
- **Состояние репозитория** (на момент исследования): 899 коммитов, [github](https://github.com/zxcvbn-ts/zxcvbn) 5 открытых issues, 4 открытых PR, [GitHub](https://github.com/zxcvbn-ts/zxcvbn) включены Discussions, 93 форка, ~1.2k звёзд. [github](https://github.com/zxcvbn-ts/zxcvbn)
- **Русские упоминания есть только в документации, как приглашение к контрибуции:** guide/README и старый CHANGELOG прямо пишут: «if you are developing a Russian website, you need to include a Cyrillic keyboard set. Create a PR so that others can benefit from it» [GitHub](https://github.com/zxcvbn-ts/zxcvbn/blob/master/docs/guide/README.md) и «you could add a Russian keyboard layout by yourself … and create a PR for the long run». [GitHub](https://github.com/zxcvbn-ts/zxcvbn/blob/master/packages/libraries/main/CHANGELOG.md) То есть Cyrillic‑клавиатура — явно ожидаемый и приветствуемый вклад.
- **Поиск по issue/PR** на предмет russian/cyrillic/ЙЦУКЕН/transliteration/language‑ru не дал результатов, **но** GitHub issues плохо индексируются внешним поиском, и `web_fetch` в сессии отказывался открывать страницы списков issues/PR. Помечено как **не полностью проверено**; перед стартом Codex должен вручную проверить: `github.com/zxcvbn-ts/zxcvbn/issues?q=russian` (и `cyrillic`, `ukrain`, `translit`, `keyboard`), `.../pulls?q=russian`, `.../branches/all`.
- **Скрытые требования upstream** (из docs/CONTRIBUTING‑процесса):
  - структура пакета фиксирована: `src/translations.ts`, `package.json`, `README.md`, `tsconfig.json`; [github](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/)
  - минимально нужны источники для [github](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/) `firstname`, `lastname`, `commonWords`;
  - язык и источники добавляются в генератор `./data-scripts/lists.ts`; простой генератор берёт списки «слово [пробел частота]», сложные форматы требуют собственного генератора (как PasswordGenerator/KeyboardAdjacencyGraph); [github](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/)
  - сборка данных — `yarn generate:languageData ru`; [github](https://zxcvbn-ts.github.io/zxcvbn/guide/languages/)
  - Wikipedia‑экстракт опционален (может сделать мейнтейнер);
  - **в v4 ключи словаря стали суффиксированными по языку** ( [github](https://zxcvbn-ts.github.io/zxcvbn/guide/migration/) `firstnames-ru`, `lastnames-ru`, `commonWords-ru`, `wikipedia-ru`) [Zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/guide/migration/) во избежание коллизий;
  - пакеты теперь экспортируют `wordSequences` [Zxcvbn-ts](https://zxcvbn-ts.github.io/zxcvbn/guide/migration/) (матчер словосочетаний для passphrase);
  - **лицензия данных фиксируется отдельным NOTICE** (прецедент ODC‑BY у commonWords) — новый русский пакет должен явно приложить license notice для своих словарей.

---

## 12. What we still cannot obtain — честный список дыр

1. **Открытого русского surname‑списка с популяционной частотой И либеральной лицензией не существует** — доказанный результат, а не недоработка поиска (проверены: открытые данные РФ, ФНС/ЗАГС/Росстат, Zenodo, Hugging Face, GitHub, научные работы, коммерческие агрегаторы).
2. **Наличие/семантику frequency‑столбца в `rustemgareev/russian-surnames`** подтвердить не удалось — карточку Hugging Face блокировал. Требует ручной проверки.
3. **Методология `popularity_score`** в `russian-names` не задокументирована автором.
4. **Machine‑readable выгрузка/официальный API ЕГР ЗАГС** по именам не найдены; фамилий официальный ranking, по‑видимому, отсутствует вовсе.
5. **Terms of use конкретных наборов data.mos.ru** (нужны для варианта A) не подтверждены — на момент исследования набор был временно недоступен.
6. **Частотность вариантов транслитерации** (какой из sergey/sergei чаще) — прямых количественных данных не найдено; пробел.
7. **Полный аудит issues/PR/branches upstream** не завершён из‑за ограничений инструмента; требует ручной проверки.
8. **Точная лицензия `datacoon/russiannames`** заявлена как «CC BY‑SA by default» [Zenodo](https://zenodo.org/records/2747011) на Zenodo — формулировка «by default» юридически расплывчата.

---

## Handoff to Codex — NEW FACTS FOR IMPLEMENTER

**Источники и лицензии (данные):**
- **Имена → `rustemgareev/russian-names`** (HF). 12 311 записей; поля `name_cyrl,name_latn,gender,popularity_rank,popularity_score,rarity_rank,rarity_score`; [Hugging Face](https://huggingface.co/datasets/ssuverin/russian-names) [huggingface](https://huggingface.co/datasets/rustemgareev/russian-names/blob/main/README.md) provenance = ЕГР ЗАГС (срез июль 2025); **лицензия CC BY‑SA 4.0**. Готово как `firstnames-ru` с готовым ranking и транслитерацией — **при условии решения по share‑alike (см. блокеры)**.
- **Фамилии → `rustemgareev/russian-surnames`** (HF, ≈318 тыс., CC BY‑SA 4.0, кириллица+латиница+пол). Как `lastnames-ru`. **Перед импортом вручную открыть карточку: (a) есть ли частотный столбец; (b) точный provenance.**
- **Ranking‑эталон (только для сверки, НЕ поставлять):** список Журавлёва (ИРЯ РАН, 2005, 500/1006 позиций) через `rulexicon::freq_last_names`, hdl:10995/1929. Лицензия CC BY‑NC‑ND 4.0 → **не перераспространять**.
- **`sorokinpf/russian_names`** — **не использовать**: нет лицензии.
- **Юридически чистый fallback:** OpenSubtitles/OPUS 2024 (ODC‑BY) — тот же источник, что `commonWords`, но без популяционной частоты и без чистого разделения на антропонимы.
- **commonWords‑ru →** OpenSubtitles/OPUS 2024, лицензия **ODC‑BY** (шаблон v4; NOTICE обязателен).

**Ordering / generator implications:**
- Ключи словаря в v4 суффиксируются: `firstnames-ru`, `lastnames-ru`, `commonWords-ru`, `wikipedia-ru`.
- Добавить язык и источники в `./data-scripts/lists.ts`; сборка `yarn generate:languageData ru`.
- Если у источника есть частота — формат «слово [пробел] частота»; иначе порядок строк = ranking. Экспортировать `wordSequences`.
- Включать **транслитерации** прямо в словарь (у zxcvbn нет Левенштейна для словарей; l33t не покрывает translit). Использовать `name_latn` + доп. варианты из таблицы раздела 7.
- **Ё/Е:** на этапе генерации словаря добавлять е‑вариант для каждого слова с ё (хранить обе формы).

**Keyboard:**
- Default `Russian` graph = базовый вариант **`ru`** из `xkeyboard-config` `symbols/ru` (ЙЦУКЕН / JCUKEN), НЕ `winkeys`/`typewriter`. Ряды: `йцукенгшщзхъ / фывапролджэ / ячсмитьбю` + ё + цифровой ряд. Источник машиночитаемый: `cgit.freedesktop.org/xkeyboard-config/tree/symbols/ru`. Даёт keyboard‑walk детект для «фыва», «йцукен», «ячсм».
- `typewriter`/`phonetic` — опциональные доп. графы, не default.

**Follow‑up PR (отдельно от языкового пакета):**
- **Homoglyphs:** core‑normalization / отдельный matcher кириллица↔латиница (а↔a, о↔o, е↔e, р↔p, с↔c, х↔x, у↔y…). Источник таблицы: **Unicode UTS #39 `confusables.txt`**. Ограничить пословно, чтобы не плодить false positives. Отдельный upstream issue.
- **Reverse‑layout translit** (русское слово в QWERTY, привет→ghbdtn): подтверждённый паттерн (Müller et al. 2025: ~1% точных, ~6% частичных на 1 млн паролей). Кандидат в отдельный matcher.

**Blockers (критический путь):**
1. **Лицензионное решение мейнтейнера CC BY‑SA → MIT‑пакет** для имён и фамилий. Прецеденты: `commonWords` под ODC‑BY (данные ≠ MIT ок); польский пакет взял CC0. Варианты: B (data‑субкомпонент под CC BY‑SA + NOTICE), C (то же с явным одобрением), A (найти CC0/attribution‑only источник — проверить terms of use data.mos.ru), D (генерировать из OPUS ODC‑BY). **Без этого решения данные в пакет не зашивать.**
2. Ручная верификация карточки `rustemgareev/russian-surnames` (частота + provenance).
3. Ручной аудит issues/PR/branches upstream (ссылки в разделе 11).

**Links:**
- `github.com/zxcvbn-ts/zxcvbn` · `zxcvbn-ts.github.io/zxcvbn/guide/languages/` · migration (ODC‑BY notice): `zxcvbn-ts.github.io/zxcvbn/guide/migration/`
- `huggingface.co/datasets/rustemgareev/russian-names` · `huggingface.co/datasets/rustemgareev/russian-surnames`
- `github.com/sorokinpf/russian_names` · `zenodo.org/records/2747011` (`datacoon/russiannames`)
- `dmafanasyev.github.io/rulexicon/reference/freq_last_names.html` · hdl:10995/1929 (Журавлёв)
- `cgit.freedesktop.org/xkeyboard-config/tree/symbols/ru` · Unicode UTS #39 confusables · Müller et al. 2025, DOI 10.22364/bjmc.2025.13.4.09
- `data.mos.ru` наборы популярных имён новорождённых · портал ЕГР ЗАГС сервис «Имена»