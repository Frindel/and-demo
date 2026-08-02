/**
 * Встраивает новые смысловые блоки в собранный сайт.
 *
 *   /rating       — статусы, условия перехода, критерии оценки,
 *                   привилегии Platinum и виртуальная карта AND;
 *   /lk/trainee   — текущий статус стажёра, динамика и пересмотр;
 *   /             — уточнённые описания разделов «Рейтинг» и «Обучение».
 *
 * Разметку страниц рисует Vue, поэтому дописать её прямо в HTML нельзя:
 * гидратация стирает всё, чего нет в дереве приложения. Работаем после
 * монтирования (__vue_app__ на #__nuxt) и повторяем вставку, когда роутер
 * перерисовал страницу при переходе.
 */
(function () {
  var BASE = '/and-demo'
  var MARK = 'data-and-extra'

  /* ── Данные ─────────────────────────────────────────────────────── */

  var TIERS = [
    {
      level: 1, name: 'Bronze',
      format: 'Лекции и участие в открытых мероприятиях компаний-партнёров.',
      reward: 'Базовый объём виртуальной валюты и скидок.',
    },
    {
      level: 2, name: 'Silver',
      format: 'Лекции, мероприятия и своевременный доступ к дополнительной учебной документации.',
      reward: 'Повышенный объём валюты и расширенные предложения.',
    },
    {
      level: 3, name: 'Gold',
      format: 'Лекции, практические занятия, работа с кейсами и уникальная документация по расписанию.',
      reward: 'Максимальный объём валюты, приоритетные возможности.',
    },
    {
      level: 4, name: 'Platinum', badge: '5 мест',
      format: 'Пять лучших студентов цикла: персональные возможности от AND и бизнесов.',
      reward: 'Подписки, встречи, интервью и доступ к проектам.',
    },
  ]

  var STEPS_UP = [
    'Стабильно посещать занятия и выполнять обязательные задания.',
    'Показывать рост результатов на тестированиях.',
    'Проявлять инициативу и участвовать в мероприятиях компаний.',
    'Качественно работать в команде и над практическими кейсами.',
    'Соблюдать сроки и учитывать обратную связь преподавателей.',
  ]

  var CRITERIA = [
    'Посещаемость и дисциплина.',
    'Результаты тестирований.',
    'Выполнение домашних и практических заданий.',
    'Активность на лекциях и бизнес-мероприятиях.',
    'Инициативность, командная работа и качество проектов.',
    'Отзывы преподавателей, кураторов и представителей бизнеса.',
  ]

  var PLATINUM = [
    ['Подписки', 'Профессиональные подписки от AND или компаний-партнёров.'],
    ['Встреча с тимлидом', 'Личная встреча с руководителем команды одного из бизнесов.'],
    ['Тестовое собеседование', 'Интервью с последующим разбором результатов.'],
    ['Разбор резюме', 'Консультация по резюме, портфолио и карьерному маршруту.'],
    ['Приоритет на практику', 'Первоочередной доступ к стажировкам и реальным проектам.'],
    ['Закрытые встречи', 'Участие во встречах с командами и основателями компаний.'],
  ]

  /* ── Сборка разметки ────────────────────────────────────────────── */

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }

  function section(label, title, subtitle, inner) {
    return '<section class="section" ' + MARK + '>' +
      '<div class="container">' +
        '<div class="section__label">' + esc(label) + '</div>' +
        '<h2 class="section__title">' + esc(title) + '</h2>' +
        (subtitle ? '<p class="section__subtitle">' + esc(subtitle) + '</p>' : '') +
        inner +
      '</div>' +
    '</section>'
  }

  function note(label, text) {
    return '<div class="x-note"><span class="x-note__label">' + esc(label) + '</span>' +
      '<p>' + esc(text) + '</p></div>'
  }

  function list(items) {
    return '<ol class="x-crit">' + items.map(function (t, i) {
      return '<li><span class="x-crit__num">' + (i < 9 ? '0' : '') + (i + 1) + '</span>' +
        '<span class="x-crit__text">' + esc(t) + '</span></li>'
    }).join('') + '</ol>'
  }

  function tiers() {
    return '<ol class="x-tiers">' + TIERS.map(function (t) {
      return '<li class="x-tier' + (t.level === 4 ? ' x-tier--platinum' : '') + '" data-level="' + t.level + '">' +
        '<div class="x-tier__head">' +
          '<span class="x-tier__rank">0' + t.level + '</span>' +
          '<span class="x-tier__ladder" aria-hidden="true"><i></i><i></i><i></i><i></i></span>' +
        '</div>' +
        '<h3 class="x-tier__name">' + esc(t.name) + '</h3>' +
        (t.badge ? '<span class="x-tier__badge">' + esc(t.badge) + '</span>' : '') +
        '<dl class="x-tier__facts">' +
          '<dt>Формат обучения</dt><dd>' + esc(t.format) + '</dd>' +
          '<dt>Вознаграждение</dt><dd>' + esc(t.reward) + '</dd>' +
        '</dl>' +
      '</li>'
    }).join('') + '</ol>'
  }

  function cards(items) {
    return '<div class="card-grid">' + items.map(function (c) {
      return '<article class="card"><div class="card__body">' +
        '<h3 class="card__title">' + esc(c[0]) + '</h3>' +
        '<p class="card__desc">' + esc(c[1]) + '</p>' +
      '</div></article>'
    }).join('') + '</div>'
  }

  function ratingHtml() {
    return (
      section('Статусы', 'Уровень определяет формат обучения',
        'Статус отражает не ценность человека, а текущий формат обучения и степень вовлечённости. Пять лучших студентов цикла получают Platinum.',
        tiers() +
        '<p class="x-tier__note">Статус обновляется по результатам трёхнедельного цикла и может как повышаться, так и понижаться.</p>') +

      section('Переход', 'Как подняться на уровень выше', null,
        list(STEPS_UP) +
        note('Правило перехода', 'Основной пересмотр статуса проходит каждые три недели. При выдающемся прогрессе и высокой активности возможно досрочное повышение — по совместному решению школы и AND.')) +

      section('Оценка', 'Из чего складывается результат',
        'Шкала 0–100% показывает вес учёбы, практики и особых достижений. Внутри каждой части рейтинг собирается из конкретных наблюдений.',
        list(CRITERIA) +
        note('Зачем отчётность', 'Она нужна не «для галочки». Её задача — своевременно находить сильных и мотивированных студентов, помогать им расти и готовить к реальной работе.')) +

      section('Platinum', 'Пять лучших студентов цикла',
        'Статус получают участники с высокими результатами, устойчивой положительной динамикой и активным участием в жизни экосистемы.',
        cards(PLATINUM) +
        note('На согласование', 'Окончательный перечень преимуществ Platinum и порядок их предоставления находятся в проработке.')) +

      section('Вознаграждение', 'Виртуальная карта AND', null,
        '<div class="x-vcard">' +
          '<div class="x-vcard__mark">AND<span>виртуальная карта</span></div>' +
          '<div class="x-vcard__text">' +
            '<p>После завершения курса каждый студент получает виртуальную карту AND с внутренней валютой и преимуществами от компаний-партнёров. Объём вознаграждения зависит от итогового статуса: Gold — наибольший, Silver — повышенный, Bronze — базовый.</p>' +
            '<p>Валюту можно потратить на товары, услуги, подписки, скидки и специальные предложения в бизнесах, сотрудничающих с AND.</p>' +
          '</div>' +
        '</div>' +
        note('Конфиденциальный расчёт', 'Итоговая сумма заранее не объявляется и рассчитывается по внутренней многофакторной модели AND. На неё влияют итоговый статус, количество циклов в статусе Gold, стабильность прогресса и активность. Полный перечень критериев, их веса и формула не раскрываются. После курса студент видит персональный баланс в своём кабинете; публично сумма не публикуется.'))
    )
  }

  function traineeHtml() {
    return section('Статус', 'Текущий уровень и пересмотр',
      'Статус обновляется по итогам трёхнедельного цикла: учитываются посещаемость, тесты, задания и активность.',
      '<div class="x-status">' +
        '<div class="x-status__cell">' +
          '<span class="x-status__label">Текущий статус</span>' +
          '<span class="x-status__value">Gold</span>' +
          '<span class="x-status__hint">Практика, кейсы и документация по расписанию.</span>' +
        '</div>' +
        '<div class="x-status__cell">' +
          '<span class="x-status__label">Динамика за цикл</span>' +
          '<span class="x-status__value">+7%</span>' +
          '<span class="x-status__hint">Рост относительно предыдущего цикла.</span>' +
        '</div>' +
        '<div class="x-status__cell">' +
          '<span class="x-status__label">Следующий пересмотр</span>' +
          '<span class="x-status__value">21 день</span>' +
          '<span class="x-status__hint">Тестирование и оценка активности.</span>' +
        '</div>' +
        '<div class="x-status__cell">' +
          '<span class="x-status__label">До Platinum</span>' +
          '<span class="x-status__value x-status__value--gold">4 место</span>' +
          '<span class="x-status__hint">В пятёрке лучших цикла — место удерживается.</span>' +
        '</div>' +
      '</div>')
  }

  /* ── Правки текстов на главной ──────────────────────────────────── */

  var HOME_COPY = {
    'Рейтинг и привилегии':
      'Шкала 0–100%: учёба, практика и особые достижения. Статусы Bronze, Silver, Gold и Platinum обновляются каждые три недели.',
    'Обучение':
      'БГТУ, онлайн-курсы и частная школа. Трёхнедельные циклы с тестированием, рейтингом и выходом на практику.',
  }

  function patchHome() {
    Array.prototype.forEach.call(document.querySelectorAll('.entry'), function (entry) {
      var title = entry.querySelector('.entry__title')
      var desc = entry.querySelector('.entry__desc')
      if (!title || !desc) return
      var next = HOME_COPY[title.textContent.trim()]
      if (next && desc.textContent.trim() !== next) desc.textContent = next
    })
  }

  /* ── Вставка и уборка ───────────────────────────────────────────── */

  function path() {
    return location.pathname.replace(/\/+$/, '') || '/'
  }

  function wanted() {
    var p = path()
    if (p === BASE + '/rating') return ratingHtml
    if (p === BASE + '/lk/trainee') return traineeHtml
    return null
  }

  function clear() {
    Array.prototype.forEach.call(document.querySelectorAll('[' + MARK + ']'), function (el) {
      el.parentNode && el.parentNode.removeChild(el)
    })
  }

  function sync() {
    if (path() === BASE) patchHome()

    var build = wanted()
    var present = document.querySelector('[' + MARK + ']')

    if (!build) { if (present) clear(); return }
    if (present) return

    var holder = document.createElement('div')
    holder.innerHTML = build()

    // Наши секции идут после содержимого страницы, перед подвалом.
    // В личном кабинете свой макет и подвала нет — там дописываем в <main>.
    var footer = document.querySelector('footer.footer')
    if (footer && footer.parentNode) {
      while (holder.firstChild) footer.parentNode.insertBefore(holder.firstChild, footer)
      return
    }

    var main = document.querySelector('main')
    if (!main) return
    var host = main.lastElementChild || main
    while (holder.firstChild) host.appendChild(holder.firstChild)
  }

  /* ── Запуск ─────────────────────────────────────────────────────── */

  function mounted() {
    var root = document.getElementById('__nuxt')
    return !!(root && root.__vue_app__)
  }

  function observe() {
    var root = document.getElementById('__nuxt')
    if (!root) return
    var queued = false
    new MutationObserver(function () {
      if (queued) return
      queued = true
      requestAnimationFrame(function () { queued = false; sync() })
    }).observe(root, { childList: true, subtree: true })
  }

  var started = Date.now()
  ;(function wait() {
    if (mounted()) { requestAnimationFrame(function () { sync(); observe() }); return }
    if (Date.now() - started > 10000) return
    requestAnimationFrame(wait)
  })()
})()
