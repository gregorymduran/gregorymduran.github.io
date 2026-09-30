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
        button.addEventListener('click', function (event) {
          event.preventDefault();
          var lang = button.id === 'btnEn' || button.id === 'btnEnM' ? 'en' : 'es';
          if (window.i18n && typeof window.i18n.setLanguage === 'function') {
            window.i18n.setLanguage(lang);
          }
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

    // Visor de capturas: amplía las imágenes del hero y de la galería de pantallas
    // en un <dialog> nativo (Esc, foco y fondo inerte los maneja el navegador).
    function bindLightbox() {
      var frames = Array.prototype.slice.call(
        document.querySelectorAll('body.project .hero-img, body.project .screen-frame')
      ).filter(function (frame) {
        var img = frame.querySelector('img');
        return img && img.getAttribute('src');
      });
      if (!frames.length || typeof HTMLDialogElement === 'undefined') return;

      function t(key, fallbackEs, fallbackEn) {
        var lang = window.i18n ? window.i18n.getCurrentLanguage() : 'es';
        var locale = window.i18n && window.i18n.getLocale(lang) || {};
        return locale[key] || (lang === 'en' ? fallbackEn : fallbackEs);
      }

      function captionFor(frame) {
        var cap = frame.parentElement && frame.parentElement.querySelector('.screen-cap');
        return cap ? cap.textContent.trim() : frame.querySelector('img').alt;
      }

      var dialog = document.createElement('dialog');
      dialog.className = 'lightbox';
      dialog.innerHTML =
        '<figure class="lightbox-figure">' +
          '<img class="lightbox-img" alt="">' +
          '<figcaption class="lightbox-cap"><span class="lightbox-text"></span><span class="lightbox-count"></span></figcaption>' +
        '</figure>' +
        '<button type="button" class="lightbox-btn lightbox-close"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg></button>' +
        '<button type="button" class="lightbox-btn lightbox-prev"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg></button>' +
        '<button type="button" class="lightbox-btn lightbox-next"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg></button>';
      document.body.appendChild(dialog);

      var dImg = dialog.querySelector('.lightbox-img');
      var dText = dialog.querySelector('.lightbox-text');
      var dCount = dialog.querySelector('.lightbox-count');
      var btnClose = dialog.querySelector('.lightbox-close');
      var btnPrev = dialog.querySelector('.lightbox-prev');
      var btnNext = dialog.querySelector('.lightbox-next');
      var current = 0;
      var opener = null;

      function labelButtons() {
        btnClose.setAttribute('aria-label', t('lightbox.close', 'Cerrar', 'Close'));
        btnPrev.setAttribute('aria-label', t('lightbox.prev', 'Anterior', 'Previous'));
        btnNext.setAttribute('aria-label', t('lightbox.next', 'Siguiente', 'Next'));
        frames.forEach(function (frame) {
          frame.setAttribute('aria-label', t('lightbox.open', 'Ampliar', 'Enlarge') + ': ' + captionFor(frame));
        });
      }

      function show(index) {
        current = (index + frames.length) % frames.length;
        var img = frames[current].querySelector('img');
        dImg.src = img.currentSrc || img.src;
        dImg.alt = img.alt;
        dText.textContent = captionFor(frames[current]);
        dCount.textContent = frames.length > 1 ? (current + 1) + ' / ' + frames.length : '';
      }

      function open(index) {
        opener = frames[index];
        show(index);
        labelButtons();
        dialog.showModal();
        document.documentElement.classList.add('lightbox-open');
      }

      frames.forEach(function (frame, index) {
        frame.classList.add('is-zoomable');
        frame.setAttribute('role', 'button');
        frame.setAttribute('tabindex', '0');
        frame.addEventListener('click', function () { open(index); });
        frame.addEventListener('keydown', function (event) {
          if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            open(index);
          }
        });
      });

      var single = frames.length < 2;
      btnPrev.hidden = single;
      btnNext.hidden = single;
      btnClose.addEventListener('click', function () { dialog.close(); });
      btnPrev.addEventListener('click', function () { show(current - 1); });
      btnNext.addEventListener('click', function () { show(current + 1); });
      dialog.addEventListener('keydown', function (event) {
        if (single) return;
        if (event.key === 'ArrowLeft') show(current - 1);
        if (event.key === 'ArrowRight') show(current + 1);
      });
      // Click en el fondo (fuera de la imagen y los botones) cierra.
      dialog.addEventListener('click', function (event) {
        if (event.target === dialog || event.target.classList.contains('lightbox-figure')) dialog.close();
      });
      dialog.addEventListener('close', function () {
        document.documentElement.classList.remove('lightbox-open');
        if (opener) opener.focus();
      });

      labelButtons();
      window.addEventListener('i18n:change', labelButtons);
      window.addEventListener('i18n:ready', labelButtons);
    }

    bindLanguageButtons();
    bindMenu();
    bindCopyAction();
    bindReveal();
    bindLightbox();

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
