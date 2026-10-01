import type { Locale } from './i18n'

export type Chapter = { kicker: string; title: string; intro: string; groups: Array<{ title: string; items: string[] }>; outro: string }

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
        'Бывшие сотрудники и подрядчики: доступы, которые забыли отключить после ухода.',
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
      { title: 'Ваши айтишники — тоже риск', items: [
        'Тот, кто сделал вам сайт или настроил 1С, не обязательно подумал о безопасности. «Чтобы работало» и «чтобы не взломали» — разные задачи, и часто разные специалисты.',
        'У подрядчика обычно больше всех доступов: хостинг, сайт, база клиентов, почта, удалённый вход в офис. Один слабый или общий на всех клиентов пароль — и утечка пойдёт через него.',
        'Поэтому стоит один раз заплатить отдельному специалисту по безопасности — не тому, кто всё делал: пусть проверит сайт, доступы и копии и скажет, что исправить.',
      ] },
      { title: 'Как безопасно передавать доступы подрядчику', items: [
        'Пароль не отправляют в почте, обычном чате и тем более в закреплённом сообщении общей группы: его увидят все участники, и он останется в истории навсегда, в том числе у тех, кто потом покинет чат или сменит работу.',
        'Лучше всего — менеджер паролей с общим хранилищем: подрядчик получает доступ к записи, а не сам пароль, и вы можете отозвать его в один клик.',
        'Если менеджера нет: логин и пароль — разными каналами и тому, кто будет ими пользоваться. Сразу после входа подрядчик меняет пароль на свой.',
        'Просите не общий админский логин, а отдельную учётную запись на каждого человека с минимально нужными правами: тогда видно, кто что сделал, и отключить можно одного.',
        'Включите вход с кодом. Если пароль всё же засветился, одного его уже не хватит.',
        'Когда работа закончена, отключите доступ и смените пароли. А если пароль уже побывал в общем чате, считайте его скомпрометированным: смените и удалите сообщение.',
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
        'Former staff and contractors: access nobody removed after they left.',
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
      { title: 'Your IT people are a risk too', items: [
        'Whoever built your website or set up your accounting system did not necessarily think about security. “It works” and “it cannot be broken into” are different jobs, often for different specialists.',
        'The contractor usually has more access than anyone: hosting, the website, the customer database, email, remote access to the office. One weak password, or one shared across all their clients, and the leak goes through them.',
        'So it is worth paying a separate security specialist once — not the person who did the work — to check the website, the accesses and the backups and say what to fix.',
      ] },
      { title: 'How to hand over access to a contractor safely', items: [
        'Do not send a password by email, in an ordinary chat, and certainly not as a pinned message in a group: every member sees it, and it stays in the history for good, even for people who later leave the chat or change jobs.',
        'Best is a password manager with a shared vault: the contractor gets access to an entry rather than the password itself, and you can revoke it in one click.',
        'Without a manager: send the login and the password through different channels, and only to the person who will use them. The contractor changes the password to their own right after signing in.',
        'Ask for a separate account for each person with only the rights they need, not a shared admin login: then you can see who did what and switch off one person.',
        'Turn on sign-in codes. If the password does leak, it is no longer enough on its own.',
        'When the work is done, remove the access and change the passwords. If a password has ever been in a group chat, treat it as compromised: change it and delete the message.',
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
  },
}

export function renderChapter(root: HTMLElement, chapter: Chapter) {
  const node = (tag: string, text: string, className = '') => Object.assign(document.createElement(tag), { textContent: text, className })
  const title = Object.assign(node('h2', chapter.title), { id: `${root.id}-title` })
  const groups = chapter.groups.flatMap(group => {
    const list = node('ul', '', 'story-steps')
    list.append(...group.items.map(item => node('li', item)))
    return [node('h3', group.title), list]
  })
  // Collapsed by default: the title stays visible as the summary, the chapter opens on click.
  const summary = node('summary', '')
  summary.append(title)
  const details = node('details', '')
  details.append(summary, node('p', chapter.intro), ...groups, node('p', chapter.outro, 'story-outro'))
  root.setAttribute('aria-labelledby', title.id)
  root.replaceChildren(node('span', chapter.kicker, 'section-kicker'), details)
}
