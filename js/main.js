(function () {
  function init() {
    var nav = document.getElementById('siteNav');
    var burger = document.getElementById('navBurger');
    var menu = document.getElementById('mMenu');
    var copyBtn = document.getElementById('copyBtn');
    var emailAddr = document.getElementById('emailAddr');

    if (nav) {
      window.addEventListener('scroll', function () {
        nav.classList.toggle('is-scrolled', window.scrollY > 8);
      }, { passive: true });
    }

    function setLanguageButtons(lang) {
      ['Es', 'En'].forEach(function (label) {
        var btnD = document.getElementById('btn' + label);
        var btnM = document.getElementById('btn' + label + 'M');
        var isActive = label.toLowerCase() === lang;
        if (btnD) btnD.classList.toggle('active', isActive);
        if (btnM) btnM.classList.toggle('active', isActive);
      });
    }

    function updateBurgerLabel(lang) {
      if (!burger) return;
      var locale = window.i18n && window.i18n.getLocale(lang) || {};
      var isOpen = menu && menu.classList.contains('open');
      var labelKey = isOpen ? 'menu.close' : 'menu.open';
      var label = locale[labelKey] || (lang === 'es' ? 'Abrir menú' : 'Open menu');
      burger.setAttribute('aria-label', label);
    }

    function bindLanguageButtons() {
      var desktopButtons = [document.getElementById('btnEs'), document.getElementById('btnEn')];
      var mobileButtons = [document.getElementById('btnEsM'), document.getElementById('btnEnM')];
      desktopButtons.concat(mobileButtons).forEach(function (button) {
        if (!button) return;
        button.addEventListener('click', function () {
          var lang = button.id === 'btnEn' || button.id === 'btnEnM' ? 'en' : 'es';
          window.i18n.setLanguage(lang);
        });
      });
    }

    function bindMenu() {
      if (!burger || !menu) return;
      burger.addEventListener('click', function () {
        var open = menu.classList.toggle('open');
        burger.setAttribute('aria-expanded', String(open));
        updateBurgerLabel(window.i18n.getCurrentLanguage());
      });

      menu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
          menu.classList.remove('open');
          burger.setAttribute('aria-expanded', 'false');
          updateBurgerLabel(window.i18n.getCurrentLanguage());
        });
      });
    }

    function bindCopyAction() {
      if (!copyBtn || !emailAddr) return;
      var address = emailAddr.textContent;
      copyBtn.addEventListener('click', function () {
        var lang = window.i18n.getCurrentLanguage();
        var locale = window.i18n.getLocale(lang) || {};
        var successText = locale['copy.success'] || (lang === 'es' ? 'Copiado ✓' : 'Copied ✓');
        var restoreText = locale['contact.copyButton'] || (lang === 'es' ? 'Copiar' : 'Copy');

        var done = function () {
          copyBtn.textContent = successText;
          copyBtn.setAttribute('aria-label', successText);
          setTimeout(function () {
            copyBtn.textContent = restoreText;
            copyBtn.setAttribute('aria-label', restoreText);
          }, 2000);
        };

        if (navigator.clipboard) {
          navigator.clipboard.writeText(address).then(done).catch(done);
        } else {
          done();
        }
      });
    }

    function bindReveal() {
      if (!window.matchMedia('(prefers-reduced-motion:reduce)').matches && 'IntersectionObserver' in window) {
        var io = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('in');
              io.unobserve(entry.target);
            }
          });
        }, { threshold: 0.1 });
        document.querySelectorAll('.rv').forEach(function (element) {
          io.observe(element);
        });
      } else {
        document.querySelectorAll('.rv').forEach(function (element) {
          element.classList.add('in');
        });
      }
    }

    bindLanguageButtons();
    bindMenu();
    bindCopyAction();
    bindReveal();

    window.addEventListener('i18n:change', function (event) {
      setLanguageButtons(event.detail && event.detail.lang ? event.detail.lang : window.i18n.getCurrentLanguage());
      updateBurgerLabel(window.i18n.getCurrentLanguage());
    });

    window.addEventListener('i18n:ready', function (event) {
      setLanguageButtons(event.detail && event.detail.lang ? event.detail.lang : window.i18n.getCurrentLanguage());
      updateBurgerLabel(window.i18n.getCurrentLanguage());
    });

    if (window.i18n && window.i18n.isReady()) {
      setLanguageButtons(window.i18n.getCurrentLanguage());
      updateBurgerLabel(window.i18n.getCurrentLanguage());
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
