# AUTONOMOUS BUILD PROMPT — CrackCheck

Ты — автономный senior engineer / maintainer проекта CrackCheck.

Тебе переданы три файла:

1. `PROMPT.md` — этот документ.
2. `MANIFESTO.md` — продуктовые принципы, threat model, UX и ограничения.
3. `RESEARCH.md` — исследование источников данных, лицензий и upstream `zxcvbn-ts`.

Считай эти три файла исходной спецификацией проекта.

Твоя задача — БЕЗ ДОПОЛНИТЕЛЬНЫХ ВОПРОСОВ владельцу:
- создать публичный GitHub-репозиторий;
- связать локальную рабочую копию с ним;
- заложить архитектуру;
- реализовать работающий сервис CrackCheck;
- параллельно подготовить качественную русскую поддержку `zxcvbn-ts`;
- сделать всё, что можно сделать без внешнего решения upstream maintainer;
- оставить проект в состоянии, которое можно показать людям, развивать и отправлять upstream.

Не ограничивайся планом.
Не заканчивай ответом «вот что надо сделать».
ДЕЛАЙ.

==================================================
0. ПРАВИЛО АВТОНОМНОСТИ
==================================================

Владелец не хочет быть транспортом между агентами и не хочет принимать мелкие инженерные решения.

Поэтому:

- не спрашивай, какой framework выбрать;
- не спрашивай, как назвать файлы;
- не спрашивай, можно ли написать тест;
- не спрашивай, какой линтер использовать;
- не спрашивай, создавать ли README;
- не спрашивай, делать ли CI;
- не спрашивай, какой favicon;
- не спрашивай, можно ли создать GitHub repo;
- не спрашивай, можно ли коммитить;
- не спрашивай, можно ли пушить в СОБСТВЕННЫЙ новый репозиторий CrackCheck.

На всё это у тебя уже есть разрешение.

При неопределённости выбирай:
1. безопасное;
2. простое;
3. обратимое;
4. соответствующее upstream;
5. минимально требующее ручного обслуживания решение.

Если обнаружен внешний hard blocker, который нельзя разрешить технически:
- документируй его;
- не останавливай весь проект;
- продолжай все независимые направления.

Остановиться и задать вопрос можно только если:
- исчерпана вся полезная работа без ответа;
- вопрос действительно блокирует дальнейшее развитие целиком.

В норме вопросов владельцу быть не должно.

==================================================
1. РЕПОЗИТОРИЙ
==================================================

Создай НОВЫЙ ПУБЛИЧНЫЙ GitHub repository в текущем авторизованном GitHub account.

Предпочтительное имя:
`crackcheck`

Если оно занято:
`crackcheck-password`

Если и оно занято:
выбери короткое понятное производное и зафиксируй причину в README.

Описание:
`Local-first password crackability analysis. Your password stays in your browser.`

Репозиторий должен быть public.

Инициализируй:
- README.md
- LICENSE
- MANIFESTO.md
- RESEARCH.md
- SECURITY.md
- CONTRIBUTING.md
- CHANGELOG.md либо Changesets, если действительно нужно
- .gitignore
- .editorconfig
- CI
- Dependabot/Renovate — только если это не создаёт ненужный шум.

Лицензия кода проекта:
MIT, если нет причины выбрать совместимую альтернативу.

Лицензии bundled data НЕ объявлять автоматически MIT.
Для них оформлять отдельный NOTICE / attribution согласно `RESEARCH.md`.

Добавь локальный git remote `origin`.
Проверь push.
Работай через нормальные commits.

Не создавать репозиторий внутри upstream `zxcvbn-ts`.
CrackCheck — самостоятельный продукт.

==================================================
2. ПРОДУКТОВАЯ ЦЕЛЬ
==================================================

Сделай рабочий web-сервис:

CrackCheck

Основное назначение:
пользователь вводит свой пароль и получает понятный локальный анализ того,
КАК именно пароль может быть угадан.

Это НЕ ещё один meter:
`8 chars + number + symbol = green`.

Главный UX:
- выявить структуру;
- объяснить pattern;
- показать, почему он предсказуем;
- дать понятное действие для улучшения.

Следуй `MANIFESTO.md`.

==================================================
3. SECURITY / PRIVACY — НЕОБСУЖДАЕМЫЕ ТРЕБОВАНИЯ
==================================================

Пароль по умолчанию НЕ ПОКИДАЕТ БРАУЗЕР.

Запрещено отправлять введённый пароль:
- на backend;
- в analytics;
- в logs;
- в error reporting;
- в telemetry;
- в URL/query/hash;
- в localStorage;
- в IndexedDB;
- в cookies;
- в service-worker cache;
- в crash dumps, если это можно контролировать.

Не добавлять:
- Google Analytics;
- Sentry;
- Hotjar;
- session replay;
- сторонние trackers.

Основной анализ после загрузки должен работать offline.

Добавь automated tests, которые подтверждают:
- local analysis не вызывает fetch/XHR/WebSocket;
- пароль не оказывается в persistent browser storage;
- пароль не появляется в DOM вне контролируемого input/output;
- пароль не попадает в URL.

Если HIBP реализован:
- только opt-in;
- отдельная кнопка;
- явно объяснить сетевой запрос;
- использовать k-anonymity Pwned Passwords range API;
- SHA-1 считать локально;
- наружу отправлять только первые 5 hex символов hash;
- полный hash и password не отправлять;
- возможность полностью выключить network features.

Не подключать HIBP автоматически при вводе каждого символа.

==================================================
4. TECH STACK
==================================================

Выбери современный, маленький и понятный frontend stack.

Предпочтение:
- TypeScript;
- Vite;
- React/Preact/Vue/Svelte — выбери самый рациональный вариант;
- static output;
- GitHub Pages compatible.

Не использовать server framework, если backend не нужен.

Минимизируй runtime dependencies.

Не тащи тяжёлую UI library только ради кнопок.

Проект должен:
- быстро загружаться;
- хорошо работать на Android/iPhone/desktop;
- быть usable с клавиатуры;
- иметь accessibility labels;
- поддерживать dark/light system theme;
- иметь RU и EN с первого релиза.

PWA:
можно добавить, если это не создаёт риск случайного persistent caching секретов.
Кэшировать application assets можно.
Никогда не кэшировать введённые пользователем значения.

==================================================
5. ANALYSIS ENGINE
==================================================

Основной engine:
`zxcvbn-ts`

Не писать собственный password estimator с нуля.

Используй:
- common package;
- English language package;
- Russian language package, который ты параллельно разрабатываешь локально.

Результат CrackCheck должен показывать как минимум:

- score / общую категорию;
- estimated guesses;
- распознанные matchers;
- объяснение каждого существенного pattern;
- какие части пароля были распознаны;
- почему pattern предсказуем;
- безопасные рекомендации.

Важно:
не выдавай псевдоточную формулировку вроде
`пароль будет взломан за 17 минут`
без явной attacker model.

Если показываешь время:
- вынеси attacker model в UI;
- объясни, что это сценарная оценка;
- показывай guesses как более фундаментальную величину.

==================================================
6. UI / UX
==================================================

Главная страница должна быть понятна обычному пользователю.

Предпочтительный flow:

[ CrackCheck ]

"Посмотри, как будут угадывать твой пароль."

[input password] [show/hide]

Статус приватности:
`Проверка выполняется локально в браузере`

После ввода:

1. общий результат;
2. "Что алгоритм увидел";
3. разобранные компоненты;
4. оценка guesses;
5. рекомендации;
6. optional HIBP check;
7. CTA:
   `Сгенерировать уникальный пароль в менеджере паролей`

Не рекламировать конкретный коммерческий продукт как единственно правильный.
Можно нейтрально упомянуть Bitwarden/KeePass/1Password/etc в образовательном разделе.

Сделай кнопку/индикатор:
`Local only`

При включении HIBP статус должен ясно изменяться:
`Будет выполнен privacy-preserving запрос в HIBP`

Не использовать scareware.

==================================================
7. WI-FI MODE
==================================================

Добавь отдельный режим:
`Wi‑Fi / WPA2-Personal`

Цель — образовательная оценка собственного Wi‑Fi password.

Он должен:
- объяснить, что при наличии подходящего WPA2 authentication material догадки могут проверяться offline;
- оценить выбранную passphrase как human-generated password;
- показать модель guesses;
- объяснить, что случайная длинная passphrase резко меняет экономику перебора.

Не реализовывать:
- deauthentication;
- packet capture;
- handshake capture;
- hashcat launcher;
- attack automation;
- работу с чужими сетями.

Это password-analysis mode, а не Wi‑Fi hacking tool.

==================================================
8. RUSSIAN LANGUAGE SUPPORT ДЛЯ zxcvbn-ts
==================================================

Параллельно создай рабочую ветку/поддиректорию разработки upstream contribution.

Не поддерживай вечный fork.

Правильная модель:
1. проверить актуальный `zxcvbn-ts/zxcvbn`;
2. реализовать изменения совместимо с current master;
3. подготовить upstream-ready patch/branch;
4. использовать его в CrackCheck до merge аккуратным способом;
5. после upstream merge перейти на официальный package.

Если нужен fork для разработки PR:
можно создать fork `zxcvbn-ts/zxcvbn` в текущем GitHub account.
Это разрешено.

Но:
- CrackCheck остаётся отдельным repo;
- upstream fork — только contribution workspace.

==================================================
9. ОБЯЗАТЕЛЬНО ПРОЧИТАЙ RESEARCH.md ПЕРЕД ИМПОРТОМ ДАННЫХ
==================================================

`RESEARCH.md` — не справочная заметка, а часть требований.

Ключевые факты из него, которые нельзя проигнорировать:

A. commonWords-ru
Лучший путь:
OpenSubtitles/OPUS 2024.

Лицензия данных:
ODC-BY.

В самом zxcvbn-ts уже есть прецедент:
code package MIT,
`commonWords.json` под отдельной ODC-BY лицензией/NOTICE.

Используй текущий upstream generator.

B. firstnames
Лучший найденный dataset:
`rustemgareev/russian-names`

12 311 записей.
Есть:
- name_cyrl;
- name_latn;
- gender;
- popularity_rank;
- popularity_score;
- rarity_rank;
- rarity_score.

Provenance:
статистика ЕГР ЗАГС, срез July 2025.

Лицензия:
CC BY-SA 4.0.

ЭТО НЕ ОЗНАЧАЕТ, ЧТО ЕГО МОЖНО МОЛЧА ВКЛЮЧИТЬ В MIT PACKAGE.

C. surnames
Главная нерешённая область.

Лучший coverage:
`rustemgareev/russian-surnames`
≈318k,
Cyrillic + Latin + gender,
CC BY-SA 4.0.

Но:
- frequency rank не был подтверждён;
- provenance surname dataset надо подтвердить;
- share-alike требует отдельного решения.

Ranking reference:
список Журавлёва.
Использовать ТОЛЬКО для QA/reference.
Не распространять:
лицензия/условия непригодны для upstream redistribution.

`sorokinpf/russian_names`:
НЕ использовать как shipped data.
LICENSE отсутствует.

D. legally cleaner fallback
OpenSubtitles/OPUS 2024 ODC-BY можно использовать как источник,
но surname quality хуже и population ranking отсутствует.

==================================================
10. ЛИЦЕНЗИИ: КАК ДЕЙСТВОВАТЬ БЕЗ ВОПРОСОВ ВЛАДЕЛЬЦУ
==================================================

Не проси владельца решить юридический вопрос за тебя.

Сделай инженерно безопасно.

До явного upstream approval CC BY-SA data:

1. НЕ коммить полный `rustemgareev` dataset как будто он MIT.
2. Подготовь generator/adapters.
3. Подготовь attribution/NOTICE вариант.
4. Проверь precedents upstream.
5. Сделай возможность подменить source без переписывания package.
6. Для production CrackCheck используй только те данные, которые можно уверенно распространять.
7. Если качественный firstnames/lastnames source остаётся лицензионно спорным:
   - включи только юридически чистый baseline;
   - пометь ограничение честно;
   - не ломай весь релиз.

Создай:
`docs/data-sources.md`
с таблицей:
- source;
- provenance;
- license;
- shipped/not shipped;
- reason;
- transformation;
- version/date.

==================================================
11. RUSSIAN KEYBOARD GRAPH
==================================================

Добавь стандартную русскую ЙЦУКЕН/JCUKEN adjacency graph.

Источник:
`xkeyboard-config`, `symbols/ru`.

Default:
базовый `ru` / Russian.

НЕ:
`winkeys`,
`typewriter`,
`phonetic`.

Нужен matcher для keyboard walks:
- `фыва`;
- `йцукен`;
- `ячсм`;
- `олдж`;
- более длинных последовательностей.

Используй upstream способ генерации graph.
Не рисуй adjacency вручную, если проект уже имеет generator.

==================================================
12. Ё / Е
==================================================

Unicode normalization не объединяет `ё` и `е`.

Следуй RESEARCH.md:
в data-generation разумно добавлять `е`-вариант для entries с `ё`,
не уничтожая оригинальную форму.

Например:
- Артём;
- Артем.

Покрой тестами.

==================================================
13. TRANSLITERATION
==================================================

Важный факт:
для dictionary matching zxcvbn-ts не следует рассчитывать на Levenshtein как универсальное решение transliteration.

Данные `rustemgareev/russian-names` уже содержат `name_latn`.

Но не раздувай первый upstream PR бесконечным combinatorial transliteration engine.

Для CrackCheck:
можно экспериментально поддержать безопасные варианты,
если это не создаёт ложного ranking.

Для upstream:
базовый `language-ru` сначала должен быть reviewable.

Отдельно документируй follow-up:
- sergey/sergei/sergej;
- alexey/alexei/aleksey/aleksei;
- dmitry/dmitriy/dmitri/dmitrij.

==================================================
14. REVERSE KEYBOARD LAYOUT — ВАЖНЕЕ, ЧЕМ КАЗАЛОСЬ
==================================================

RESEARCH.md содержит важный password-specific результат:

академическая работа Müller et al. 2025 подтверждает реальный паттерн:
русское слово набирается в латинской QWERTY раскладке.

Пример:
`привет` → `ghbdtn`

Исследование сообщает примерно:
- ~1% exact matches;
- ещё ~6% partial matches
для описанного авторами эксперимента.

Это НЕ надо смешивать с базовым language PR, если требуется core change.

Но CrackCheck должен иметь roadmap/prototype этой функции.

Исследуй, можно ли реализовать её:
- custom matcher/plugin;
- preprocessing candidate;
- dictionary transform;
- без экспоненциального роста данных.

Если архитектурно чисто — реализуй в CrackCheck как экспериментальную дополнительную проверку с тестами.

Если требует изменения core — подготовь отдельный upstream proposal/patch.

==================================================
15. HOMOGLYPHS
==================================================

Источник:
Unicode UTS #39 `confusables.txt`.

Примеры:
- а ↔ a
- с ↔ c
- е ↔ e
- о ↔ o
- р ↔ p
- х ↔ x
- у ↔ y

НЕ делай глобальное безусловное схлопывание:
это создаст false positives.

Сначала:
- исследуй;
- сделай ограниченную архитектуру;
- тесты false positives.

В upstream language PR не тащи, если это core-level feature.

Отдельный issue/PR позже.

==================================================
16. RUSSIAN TRANSLATIONS / PLURALIZATION
==================================================

Сделай полноценный `language-ru` translation layer.

Не ограничиваться UI CrackCheck.
Нужно upstream-compatible translations.

Используй function-based pluralization.

Проверить:
- 1 секунда
- 2 секунды
- 5 секунд
- 11 секунд
- 21 секунда
- 22 секунды
- 25 секунд

То же:
- минута;
- час;
- день;
- месяц;
- год.

Русское правило:
1, кроме 11 -> singular
2-4, кроме 12-14 -> paucal
остальное -> plural

Покрыть тестами:
1,2,4,5,11,12,14,21,22,25,101,111,112,114.

Тексты должны быть нормальным русским,
а не буквальной калькой английского.

==================================================
17. UPSTREAM PACKAGE — MINIMUM DONE
==================================================

Подготовить:
`@zxcvbn-ts/language-ru`

Проверить current upstream conventions.

Ожидаемо нужны:
- package;
- translations;
- `commonWords-ru`;
- `firstnames-ru`;
- `lastnames-ru`;
- `wordSequences`;
- source registration;
- data generator;
- README;
- NOTICE;
- tests;
- docs update.

Но current repository является source of truth.
Если структура изменилась — следуй current repository.

Перед реализацией вручную проверь:
- issues?q=russian
- issues?q=cyrillic
- issues?q=keyboard
- pulls?q=russian
- branches
- discussions

RESEARCH.md отмечает, что этот аудит не удалось закончить инструментально.

==================================================
18. CRACKCHECK FEATURES — MVP
==================================================

MVP должен быть реально развёрнут и usable.

Обязательно:

### Password input
- show/hide;
- paste;
- clear;
- autocomplete semantics безопасные/разумные;
- не сохранять value.

### Local analyzer
- zxcvbn-ts common + en + ru;
- explanations;
- guesses;
- matched components.

### Privacy UI
- Local only badge;
- краткое пояснение;
- link "Как мы защищаем пароль".

### Optional HIBP
- off by default;
- explicit click;
- k-anonymity;
- результат breach count;
- понятное объяснение.

### Russian/English UI
- locale switch;
- default based on browser, но ручной override.

### Wi‑Fi mode
- отдельная модель/объяснение;
- без attack tooling.

### Educational section
- почему длина ≠ всё;
- pattern examples;
- почему password manager лучше reuse.

### About / methodology
- что оценивает zxcvbn;
- какие datasets используются;
- limitations;
- data licenses.

==================================================
19. НЕ ПРИДУМЫВАЙ РЕЙТИНГ, КОТОРОГО НЕТ
==================================================

Очень важно.

В zxcvbn dictionary order связан с guess rank.

Если surname source не имеет подтверждённой частоты:
- НЕ сортируй алфавитно и не выдавай это за frequency;
- НЕ назначай случайный popularity score;
- НЕ используй размер dataset как оправдание.

Либо:
- найди подтверждённый ranking;
- либо используй маленький честный ranked subset;
- либо не ship фамилии до решения;
- либо используй documented proxy и явно назови его proxy.

==================================================
20. TESTING
==================================================

Нужны уровни:

### Unit
- Russian pluralization;
- keyboard graph;
- ё/е variants;
- dictionary generators;
- privacy helpers;
- HIBP prefix logic.

### Engine regression
Проверить:
- пароль
- пароль123
- Пароль123!
- привет
- любовь
- Сергей1988
- анна2024
- йцукен
- фыва
- ячсм
- Артём
- Артем
- sergey
- сильные random strings.

### Differential
common+en
vs
common+en+ru

Русский пакет должен улучшать обнаружение русских human patterns,
не ухудшая бессвязные random passwords.

### Browser / E2E
Playwright или аналог:
- ввод пароля;
- network interception;
- local-only -> ZERO application network requests after app load;
- password absent from storage;
- HIBP network appears only after explicit action;
- mobile viewport;
- keyboard accessibility.

### Build
- lint;
- typecheck;
- tests;
- build.

==================================================
21. CI/CD
==================================================

GitHub Actions:

PR/push:
- install frozen lockfile;
- lint;
- typecheck;
- unit tests;
- build;
- E2E, если время разумно.

Deploy:
GitHub Pages from main after passing CI.

Не деплой сломанной сборки.

В README после первого deploy добавить:
- live demo link;
- privacy promise;
- architecture;
- development;
- data sources.

==================================================
22. SECURITY HARDENING
==================================================

Сделай статическое приложение максимально скучным для security review.

Рассмотри:
- CSP;
- no inline scripts, если возможно;
- `Referrer-Policy`;
- `Permissions-Policy`;
- `X-Content-Type-Options`;
- Subresource Integrity, если вообще есть внешние resources;
- лучше не иметь внешних runtime resources.

Для GitHub Pages часть HTTP headers ограничена.
Если заголовок невозможно выставить:
- документируй ограничение;
- используй `<meta http-equiv>` только там, где это реально работает;
- не изображай защиту, которой нет.

SECURITY.md:
- supported version;
- vulnerability reporting;
- особо подчеркнуть, что пароль НЕ нужно включать в bug report.

==================================================
23. DOCUMENTATION
==================================================

Создай:

README.md
- что такое CrackCheck;
- live URL;
- privacy;
- screenshots позже;
- local dev;
- architecture;
- limitations.

docs/
- architecture.md
- privacy.md
- methodology.md
- data-sources.md
- threat-model.md
- upstream.md
- roadmap.md

`docs/upstream.md`:
- состояние `language-ru`;
- что уже готово;
- какие блокеры;
- какие PR planned;
- license decision.

==================================================
24. GIT WORKFLOW
==================================================

CrackCheck repo:
можешь создавать commits и push автономно.

Используй осмысленные commits.

Не force-push main.

Не удаляй main.

Для большой работы используй feature branches + PR внутри нашего repo,
если это улучшает review.

Для upstream `zxcvbn-ts`:
- fork/branch разрешён;
- готовить commits разрешено;
- открывать upstream PR автоматически НЕ надо, если для него остаётся нерешённая лицензия данных или требуется позиция maintainer.

Если PR полностью безопасен и не содержит спорных данных,
всё равно сначала подготовь его текст и branch.
Фактический внешний PR оставь как явный финальный шаг.

==================================================
25. КАК ПОСТУПАТЬ С НЕХВАТКОЙ ДАННЫХ
==================================================

Не останавливай CrackCheck из-за surname dataset.

Приоритет:

1. рабочий сервис;
2. common/en/russian baseline;
3. keyboard;
4. translations;
5. reproducible data pipeline;
6. firstnames;
7. фамилии настолько качественно, насколько можно юридически и методологически честно;
8. follow-up research.

В README не обещать полноту, которой пока нет.

==================================================
26. DEFINITION OF DONE — ЭТА ИТЕРАЦИЯ
==================================================

Работа считается успешной, когда существует:

1. публичный GitHub repo CrackCheck;
2. origin настроен и push работает;
3. live GitHub Pages deployment;
4. статический client-only password analyzer;
5. RU + EN;
6. local-only анализ;
7. privacy tests;
8. optional HIBP k-anonymity;
9. Wi‑Fi educational mode;
10. документация;
11. CI;
12. SECURITY.md;
13. data provenance/license documentation;
14. рабочая русская ЙЦУКЕН поддержка;
15. локально интегрированная русская language model настолько полно, насколько позволяют легальные данные;
16. подготовленный upstream contribution workspace для zxcvbn-ts;
17. список оставшихся upstream blockers без блокировки продукта;
18. чистый `git status`;
19. все tests/build зелёные.

==================================================
27. ФИНАЛЬНЫЙ ОТЧЁТ
==================================================

Только когда полезная работа действительно исчерпана, выдай владельцу краткий отчёт:

- repo URL;
- live URL;
- что реализовано;
- tests/CI status;
- upstream branch/fork URL;
- что готово к PR;
- какие остаются внешние blockers;
- какие решения ты принял самостоятельно;
- следующие 3-5 приоритетов.

Не заканчивай отчётом вместо реализации.

Сначала создай проект.
Потом реализуй его.
Потом проверь.
Потом задеплой.
Потом отчитайся.

Начинай с чтения `MANIFESTO.md` и `RESEARCH.md`, затем немедленно переходи к созданию репозитория и первой рабочей версии.
