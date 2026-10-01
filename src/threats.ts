import type { Locale } from './i18n'

export type Chapter = { kicker: string; title: string; intro: string; groups: Array<{ title: string; items: string[] }>; outro: string; link: { text: string; href: string } }

export const people: Record<Locale, Chapter> = {
  ru: {
    kicker: 'Не только пароли', title: 'Как обычно обманывают людей',
    intro: 'Чаще всего деньги уходят не из-за взлома: человек сам переводит их или сам называет код. Мошенники не ищут именно вас — они пробуют всех подряд.',
    groups: [
      { title: 'Как заходят', items: [
        'Звонок «из службы безопасности банка», «полиции» или «Госуслуг». Просят назвать код из SMS или перевести деньги на «безопасный счёт».',
        'Сообщение со ссылкой: «посылка задержана», «проголосуйте за племянницу», «оплата через доставку» на Авито. Ссылка ведёт на поддельную страницу входа или оплаты.',
        'Взломанный знакомый пишет: «Срочно займи до завтра». Бывают и поддельные голосовые сообщения его голосом.',
        'Просьба установить приложение «банка» или программу «для связи с оператором». После этого телефоном управляют чужие руки. Новый вариант — «приложите карту к телефону».',
        'Один пароль на всё: он утёк с одного сайта, и его пробуют на остальных.',
      ] },
      { title: 'Что им нужно', items: [
        'Деньги на карте и в банковском приложении.',
        'Госуслуги — чтобы оформить на вас займы и сим-карты.',
        'Почта и мессенджеры — чтобы сбросить остальные пароли и обмануть ваших знакомых.',
        'Ваши данные — с ними следующий звонок звучит убедительнее.',
      ] },
      { title: 'Чем это оборачивается', items: [
        'Деньги, которые вы перевели сами, вернуть удаётся редко.',
        'Займы на ваше имя и месяцы разбирательств.',
        'Потерянные переписка, фото и аккаунты.',
        'Уголовная статья для тех, кто согласился на «подработку» и дал свою карту для чужих переводов.',
      ] },
      { title: 'Если взломали домашний Wi‑Fi', items: [
        'Чужие люди пользуются вашим интернетом. Если они нарушат закон, первые вопросы зададут владельцу подключения — вам.',
        'Становятся доступны устройства в доме: камеры, принтеры, «умные» розетки. У многих из них простой пароль или его нет вовсе.',
        'Если пароль от настроек роутера остался заводским, роутер можно перенастроить и незаметно отправлять вас на поддельные сайты.',
        'Что сделать: длинный пароль на Wi‑Fi (похожий можно проверить здесь в режиме «Wi‑Fi»), свой пароль на настройки роутера вместо заводского и отдельная гостевая сеть для гостей.',
      ] },
    ],
    outro: 'Одно правило закрывает большую часть схем: код из SMS, пароль и данные карты не называют никому. Позвонили «из банка» — положите трубку и перезвоните по номеру на обороте карты.',
    link: { text: 'Ведёте бизнес или работаете бухгалтером? Отдельная глава про атаки на компании →', href: 'business.html' },
  },
  en: {
    kicker: 'Not just passwords', title: 'How people usually get scammed',
    intro: 'Most money is lost not to hacking: people transfer it themselves or read out a code. Scammers are not looking for you in particular — they try everyone.',
    groups: [
      { title: 'How they get in', items: [
        'A call from “bank security”, “the police” or a government service. They ask for the code from a text message or a transfer to a “safe account”.',
        'A message with a link: “your parcel is held”, “vote for my niece”, “pay through delivery” on a classifieds site. The link opens a fake sign-in or payment page.',
        'A hacked friend writes: “Lend me some money until tomorrow, it is urgent.” Some even send fake voice messages in the friend’s voice.',
        'A request to install a “bank” app or a program “to talk to support”. After that, a stranger controls the phone. A newer version: “hold your card against the phone”.',
        'One password everywhere: it leaks from one site and is tried on all the others.',
      ] },
      { title: 'What they want', items: [
        'The money on your card and in your banking app.',
        'Government service accounts — to take out loans and SIM cards in your name.',
        'Email and messengers — to reset your other passwords and scam your friends.',
        'Your personal details — they make the next call more convincing.',
      ] },
      { title: 'What it costs you', items: [
        'Money you transferred yourself is rarely returned.',
        'Loans in your name and months of disputes.',
        'Lost messages, photos and accounts.',
        'A criminal case for people who took a “side job” and let strangers move money through their card.',
      ] },
      { title: 'If your home Wi‑Fi is broken into', items: [
        'Strangers use your internet. If they break the law, the first questions go to whoever owns the connection — you.',
        'The devices at home become reachable: cameras, printers, smart plugs. Many have a simple password or none at all.',
        'If the router settings still use the factory password, the router can be reconfigured to quietly send you to fake sites.',
        'What to do: a long Wi‑Fi password (test a similar one here in Wi‑Fi mode), your own password for the router settings instead of the factory one, and a separate guest network for visitors.',
      ] },
    ],
    outro: 'One rule stops most of these schemes: never tell anyone a text message code, a password or card details. If “the bank” calls, hang up and call the number on the back of your card.',
    link: { text: 'Run a business or do the books? A separate chapter on attacks on companies →', href: 'business.html' },
  },
}

export const business: Record<Locale, Chapter> = {
  ru: {
    kicker: 'Для бизнеса', title: 'Как атакуют компании и ИП',
    intro: 'У компании есть расчётный счёт, база клиентов и сотрудники — и каждый из них может стать входом. Защиты, как у обычного покупателя, у бизнеса нет, а ИП отвечает по долгам всем своим имуществом.',
    groups: [
      { title: 'Как заходят', items: [
        'Письмо бухгалтеру: «счёт», «акт сверки», «требование налоговой» с вложением. Вложение ставит вредоносную программу или открывает удалённый доступ.',
        'Подмена реквизитов: мошенники читают переписку с поставщиком и присылают «наши новые реквизиты». Оплата уходит им.',
        'Поддельный руководитель: «директор» пишет сотруднику в мессенджер, что сейчас позвонит «куратор», или просит срочно оплатить счёт. Иногда звонит его поддельным голосом.',
        'Удалённый доступ к офисному компьютеру, VPN или 1С через интернет с простым или повторным паролем и без кода.',
        'Ключ банк-клиента всё время вставлен в компьютер: получив удалённый доступ, злоумышленник сам отправляет платёжки.',
        'Подрядчики и бывшие сотрудники: общий пароль у ИТ-аутсорсера, доступы, которые забыли отключить после увольнения.',
        'Сайт или сервер, который давно не обновляли.',
      ] },
      { title: 'Что им нужно', items: [
        'Деньги на расчётном счёте.',
        'Ваши файлы: программа-вымогатель шифрует их и требует выкуп, а ещё грозит опубликовать.',
        'База клиентов — её продают, а за утечку штрафуют уже вас.',
        'Кабинет продавца на маркетплейсе, домен, сайт и соцсети — например, чтобы выплаты уходили на чужую карту.',
        'Путь к вашим крупным клиентам: через небольшого подрядчика атакуют того, кого он обслуживает.',
      ] },
      { title: 'Чем это оборачивается', items: [
        'Украденные со счёта деньги банк возвращает, только если сам нарушил правила.',
        'Простой: неделя без 1С, касс и отгрузок.',
        'Штрафы за утечку персональных данных клиентов и их иски.',
        'Потерянные клиенты и репутация.',
        'Долги ИП, которые закрываются личным имуществом.',
      ] },
      { title: 'Минимум, который закрывает большую часть атак', items: [
        'Вход с кодом для почты, банка и любого удалённого доступа.',
        'Правило: новые реквизиты принимаются только после звонка партнёру по номеру, который у вас уже был.',
        'Ключ банк-клиента вынимается после работы или живёт на отдельном компьютере только для платежей.',
        'Резервные копии, которые не подключены к сети, и хотя бы одна проверка, что из них правда восстанавливается.',
        'Доступы уволенного сотрудника отключаются в день увольнения, а пароли команды хранятся в менеджере паролей.',
      ] },
    ],
    outro: 'Начните с двух пунктов: вход с кодом для почты и банка и правило звонка при смене реквизитов. Это бесплатно и займёт один вечер.',
    link: { text: '← К проверке пароля', href: './' },
  },
  en: {
    kicker: 'For business', title: 'How attackers target companies',
    intro: 'A company has a bank account, a customer database and staff — and any of them can be a way in. A business does not get the protection an ordinary shopper has, and a sole trader is liable for business debts with everything they own.',
    groups: [
      { title: 'How they get in', items: [
        'An email to the accountant: “invoice”, “reconciliation statement”, “tax office demand” with an attachment. The attachment installs malware or opens remote access.',
        'Changed bank details: scammers read the correspondence with a supplier and send “our new bank details”. The payment goes to them.',
        'A fake boss: “the director” messages an employee that a “supervisor” is about to call, or asks to pay an invoice urgently. Sometimes the call uses a faked voice.',
        'Remote access to an office computer, VPN or accounting system over the internet with a simple or reused password and no code.',
        'The bank signing key stays plugged into the computer: with remote access, the attacker sends payments himself.',
        'Contractors and former staff: a shared password with the IT contractor, access nobody removed after someone left.',
        'A website or server that has not been updated for a long time.',
      ] },
      { title: 'What they want', items: [
        'The money in the company account.',
        'Your files: ransomware encrypts them, demands a ransom and threatens to publish them.',
        'The customer database — it gets sold, and you are the one fined for the leak.',
        'Your seller account on a marketplace, domain, website and social pages — for example, to redirect payouts to someone else’s card.',
        'A route to your large clients: attackers go through a small contractor to reach the company it serves.',
      ] },
      { title: 'What it costs', items: [
        'The bank returns stolen money only if the bank itself broke the rules.',
        'Downtime: a week without accounting, tills and shipments.',
        'Fines for leaking customers’ personal data, and their lawsuits.',
        'Lost customers and reputation.',
        'Sole-trader debts paid from personal property.',
      ] },
      { title: 'The minimum that stops most attacks', items: [
        'Sign-in codes for email, the bank and any remote access.',
        'A rule: new bank details are accepted only after calling the partner on a number you already had.',
        'The bank signing key is unplugged after work or lives on a separate computer used only for payments.',
        'Backups that are not connected to the network, and at least one test that you can really restore from them.',
        'A departing employee’s access is removed the same day, and team passwords live in a password manager.',
      ] },
    ],
    outro: 'Start with two things: sign-in codes for email and the bank, and the call-back rule for changed bank details. Both are free and take one evening.',
    link: { text: '← Back to the password check', href: './' },
  },
}

export function renderChapter(root: HTMLElement, chapter: Chapter, heading: 'h1' | 'h2') {
  const node = (tag: string, text: string, className = '') => Object.assign(document.createElement(tag), { textContent: text, className })
  const title = Object.assign(node(heading, chapter.title), { id: `${root.id}-title` })
  const groups = chapter.groups.flatMap(group => {
    const list = node('ul', '', 'story-steps')
    list.append(...group.items.map(item => node('li', item)))
    return [node('h3', group.title), list]
  })
  const link = Object.assign(node('a', chapter.link.text, 'chapter-link'), { href: chapter.link.href })
  root.setAttribute('aria-labelledby', title.id)
  root.replaceChildren(node('span', chapter.kicker, 'section-kicker'), title, node('p', chapter.intro), ...groups, node('p', chapter.outro, 'story-outro'), link)
}
