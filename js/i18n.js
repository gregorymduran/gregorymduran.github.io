(function () {
  var storageKey = 'site-language';
  var defaultLang = 'es';
  var translationsCache = {};
  var fallbackValues = new WeakMap();
  var currentLang = null;
  var isReady = false;
  var localeRoot = '';
  var devMode = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1' || window.location.protocol === 'file:';

  function getScriptUrl() {
    var currentScript = document.currentScript || Array.from(document.scripts).find(function (script) {
      return /i18n\.js(?:\?.*)?$/.test(script.getAttribute('src') || '');
    });
    return currentScript ? currentScript.getAttribute('src') : '';
  }

  function getLocaleUrl(lang) {
    var scriptSrc = getScriptUrl();
    if (!scriptSrc) {
      return new URL('./locales/' + lang + '.json', window.location.href).toString();
    }

    var scriptUrl = new URL(scriptSrc, window.location.href);
    return new URL('../locales/' + lang + '.json', scriptUrl).toString();
  }

  function warn(message) {
    if (devMode) {
      console.warn(message);
    }
  }

  function getStoredLanguage() {
    try {
      return localStorage.getItem(storageKey) || defaultLang;
    } catch (error) {
      return defaultLang;
    }
  }

  function setStoredLanguage(lang) {
    try {
      localStorage.setItem(storageKey, lang);
    } catch (error) {
      warn('⚠ No se pudo guardar el idioma seleccionado en localStorage.');
    }
  }

  function getFallbackValue(element, attribute) {
    if (attribute === 'text') {
      return element.textContent || '';
    }
    if (attribute === 'html') {
      return element.innerHTML || '';
    }
    if (attribute === 'placeholder') {
      return element.getAttribute('placeholder') || '';
    }
    if (attribute === 'title') {
      return element.getAttribute('title') || '';
    }
    if (attribute === 'aria') {
      return element.getAttribute('aria-label') || '';
    }
    return '';
  }

  function storeFallbackValues() {
    document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]').forEach(function (element) {
      var entry = {
        text: element.textContent || '',
        html: element.innerHTML || '',
        placeholder: element.getAttribute('placeholder') || '',
        title: element.getAttribute('title') || '',
        aria: element.getAttribute('aria-label') || ''
      };
      fallbackValues.set(element, entry);
    });
  }

  function loadLocale(lang) {
    if (translationsCache[lang]) {
      return Promise.resolve(translationsCache[lang]);
    }

    return fetch(getLocaleUrl(lang), { cache: 'force-cache' })
      .then(function (response) {
        if (!response.ok) {
          throw new Error('No se pudo cargar ' + getLocaleUrl(lang));
        }
        return response.json();
      })
      .then(function (json) {
        translationsCache[lang] = json || {};
        return translationsCache[lang];
      })
      .catch(function (error) {
        warn('⚠ No se pudo cargar el idioma ' + lang + ': ' + error.message);
        translationsCache[lang] = {};
        return {};
      });
  }

  function collectKeys() {
    return Array.from(document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]'))
      .map(function (element) {
        return [
          element.getAttribute('data-i18n'),
          element.getAttribute('data-i18n-html'),
          element.getAttribute('data-i18n-placeholder'),
          element.getAttribute('data-i18n-title'),
          element.getAttribute('data-i18n-aria')
        ].filter(Boolean);
      })
      .flat();
  }

  function validateTranslations(lang, locale) {
    var keys = collectKeys();
    var definedKeys = Object.keys(locale || {});
    var definedSet = new Set(definedKeys);
    var usedSet = new Set(keys);

    keys.forEach(function (key) {
      if (!definedSet.has(key)) {
        warn('⚠ Falta la traducción:\n' + key + '\n' + lang + '.json');
      }
    });

    definedKeys.forEach(function (key) {
      if (!usedSet.has(key)) {
        warn('⚠ Clave definida pero nunca utilizada:\n' + key);
      }
    });
  }

  function resolveValue(locale, key, fallback) {
    if (locale && locale[key] !== undefined) {
      return locale[key];
    }
    if (translationsCache[defaultLang] && translationsCache[defaultLang][key] !== undefined) {
      return translationsCache[defaultLang][key];
    }
    return fallback;
  }

  function applyTranslations(lang) {
    var locale = translationsCache[lang] || {};
    var elements = Array.from(document.querySelectorAll('[data-i18n], [data-i18n-html], [data-i18n-placeholder], [data-i18n-title], [data-i18n-aria]'));

    elements.forEach(function (element) {
      var textKey = element.getAttribute('data-i18n');
      var htmlKey = element.getAttribute('data-i18n-html');
      var placeholderKey = element.getAttribute('data-i18n-placeholder');
      var titleKey = element.getAttribute('data-i18n-title');
      var ariaKey = element.getAttribute('data-i18n-aria');
      var fallback = fallbackValues.get(element) || {
        text: element.textContent || '',
        html: element.innerHTML || '',
        placeholder: element.getAttribute('placeholder') || '',
        title: element.getAttribute('title') || '',
        aria: element.getAttribute('aria-label') || ''
      };

      if (textKey) {
        var textValue = resolveValue(locale, textKey, fallback.text);
        if (textValue !== undefined) {
          element.textContent = textValue;
        }
        if (locale[textKey] === undefined && translationsCache[defaultLang] && translationsCache[defaultLang][textKey] === undefined && fallback.text !== undefined) {
          warn('⚠ Elemento con data-i18n pero sin traducción: ' + textKey);
        }
      }

      if (htmlKey) {
        var htmlValue = resolveValue(locale, htmlKey, fallback.html);
        if (htmlValue !== undefined) {
          element.innerHTML = htmlValue;
        }
        if (locale[htmlKey] === undefined && translationsCache[defaultLang] && translationsCache[defaultLang][htmlKey] === undefined && fallback.html !== undefined) {
          warn('⚠ Elemento con data-i18n-html pero sin traducción: ' + htmlKey);
        }
      }

      if (placeholderKey) {
        var placeholderValue = resolveValue(locale, placeholderKey, fallback.placeholder);
        if (placeholderValue !== undefined) {
          element.setAttribute('placeholder', placeholderValue);
        }
        if (locale[placeholderKey] === undefined && translationsCache[defaultLang] && translationsCache[defaultLang][placeholderKey] === undefined && fallback.placeholder !== undefined) {
          warn('⚠ Elemento con data-i18n-placeholder pero sin traducción: ' + placeholderKey);
        }
      }

      if (titleKey) {
        var titleValue = resolveValue(locale, titleKey, fallback.title);
        if (titleValue !== undefined) {
          element.setAttribute('title', titleValue);
        }
        if (locale[titleKey] === undefined && translationsCache[defaultLang] && translationsCache[defaultLang][titleKey] === undefined && fallback.title !== undefined) {
          warn('⚠ Elemento con data-i18n-title pero sin traducción: ' + titleKey);
        }
      }

      if (ariaKey) {
        var ariaValue = resolveValue(locale, ariaKey, fallback.aria);
        if (ariaValue !== undefined) {
          element.setAttribute('aria-label', ariaValue);
        }
        if (locale[ariaKey] === undefined && translationsCache[defaultLang] && translationsCache[defaultLang][ariaKey] === undefined && fallback.aria !== undefined) {
          warn('⚠ Elemento con data-i18n-aria pero sin traducción: ' + ariaKey);
        }
      }
    });

    document.documentElement.lang = lang;
    currentLang = lang;
    setStoredLanguage(lang);
    if (window.dispatchEvent) {
      window.dispatchEvent(new CustomEvent('i18n:change', { detail: { lang: lang } }));
    }
  }

  function initialize(lang) {
    currentLang = lang || getStoredLanguage();
    storeFallbackValues();

    loadLocale(defaultLang).then(function (defaultLocale) {
      translationsCache[defaultLang] = defaultLocale;
      validateTranslations(defaultLang, defaultLocale);
      applyTranslations(defaultLang);

      return loadLocale(currentLang).then(function (locale) {
        translationsCache[currentLang] = locale;
        validateTranslations(currentLang, locale);
        applyTranslations(currentLang);
        isReady = true;
        window.dispatchEvent(new CustomEvent('i18n:ready', { detail: { lang: currentLang } }));
      });
    }).catch(function () {
      isReady = true;
      window.dispatchEvent(new CustomEvent('i18n:ready', { detail: { lang: currentLang } }));
    });
  }

  window.i18n = {
    setLanguage: function (lang) {
      var selectedLang = lang || defaultLang;
      if (!translationsCache[selectedLang]) {
        loadLocale(selectedLang).then(function (locale) {
          translationsCache[selectedLang] = locale;
          validateTranslations(selectedLang, locale);
          applyTranslations(selectedLang);
        });
      } else {
        applyTranslations(selectedLang);
      }
      return selectedLang;
    },
    getCurrentLanguage: function () {
      return currentLang || defaultLang;
    },
    getLocale: function (lang) {
      return translationsCache[lang] || {};
    },
    isReady: function () {
      return isReady;
    }
  };

  window.setLang = function (lang) {
    return window.i18n.setLanguage(lang);
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initialize();
    });
  } else {
    initialize();
  }
})();
