/**
 * Добавляет пункт «Система обучения» в меню и подвал.
 *
 * Меню отрисовывает Vue, поэтому дописать ссылку прямо в HTML нельзя —
 * гидратация её стирает. Ждём монтирования приложения (только после него
 * на #__nuxt появляется __vue_app__), иначе Vue увидит лишний узел и
 * запишет в консоль hydration mismatch. Затем возвращаем ссылку обратно,
 * если роутер перерисовал список при переходе между страницами.
 */
(function () {
  var HREF = '/and-demo/learn-system'
  var TEXT = 'Система обучения'
  var TIMEOUT_MS = 10000

  function make() {
    var a = document.createElement('a')
    a.href = HREF
    a.textContent = TEXT
    a.setAttribute('data-cursor', 'hover')
    a.setAttribute('data-and-extra', '')
    return a
  }

  function ensure(container) {
    if (!container || container.querySelector('[data-and-extra]')) return
    container.appendChild(make())
  }

  function attach(selector) {
    var container = document.querySelector(selector)
    if (!container) return
    ensure(container)
    new MutationObserver(function () { ensure(container) })
      .observe(container, { childList: true })
  }

  function init() {
    attach('.nav__links')
    attach('.footer__nav')
  }

  /** Приложение смонтировано — гидратация позади, DOM можно дополнять. */
  function mounted() {
    var root = document.getElementById('__nuxt')
    return !!(root && root.__vue_app__)
  }

  var started = Date.now()
  ;(function waitForMount() {
    if (mounted()) {
      // Ещё один кадр — чтобы не попасть в середину первой отрисовки роутера.
      requestAnimationFrame(init)
      return
    }
    if (Date.now() - started > TIMEOUT_MS) return
    requestAnimationFrame(waitForMount)
  })()
})()
