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

  function tiers() {
    return '<ol class="x-tiers">' + TIERS.map(function (t, i) {
      return '<li class="x-tier x-tier--' + t.name.toLowerCase() + '"' +
        ' data-level="' + t.level + '" style="--i:' + i + '">' +
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

  function ratingHtml() {
    return (
      section('Статусы', 'Уровень определяет формат обучения',
        'Статус отражает не ценность человека, а текущий формат обучения и степень вовлечённости. Пять лучших студентов цикла получают Platinum.',
        tiers() +
        '<p class="x-tier__note">Статус обновляется по результатам трёхнедельного цикла и может как повышаться, так и понижаться.</p>') +

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
          '<span class="x-status__value x-status__value--gold">3 позиции</span>' +
          '<span class="x-status__hint">Сейчас 8-е место в цикле. Platinum получают первые пять.</span>' +
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

  /**
   * Появление статусов при прокрутке. Директива приложения на наши узлы
   * не распространяется, поэтому ведём свой наблюдатель.
   */
  function reveal() {
    var cards = document.querySelectorAll('.x-tier:not(.is-in)')
    if (!cards.length) return
    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(cards, function (c) { c.classList.add('is-in') })
      return
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return
        e.target.classList.add('is-in')
        io.unobserve(e.target)
      })
    }, { rootMargin: '0px 0px -12% 0px' })
    Array.prototype.forEach.call(cards, function (c) { io.observe(c) })
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
      reveal()
      return
    }

    var main = document.querySelector('main')
    if (!main) return
    var host = main.lastElementChild || main
    while (holder.firstChild) host.appendChild(holder.firstChild)
    reveal()
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
