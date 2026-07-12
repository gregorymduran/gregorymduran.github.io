/**
 * agent.js — Motor de conocimiento estructurado para el portafolio de Gregory Durán
 * 100% cliente, JavaScript Vanilla, sin dependencias ni backend.
 *
 * Arquitectura modular (un único IIFE, submódulos funcionales):
 *   CONFIG -> Loader -> Parser -> Indexer -> IntentEngine -> SearchEngine -> FAQ
 *   -> ContextManager -> DOMActions -> ResponseBuilder -> ChipsEngine -> ChatUI/Bootstrap
 *
 * Uso: <script src="./agent.js" defer></script> justo antes de </body>
 */

(function () {
  'use strict';

  // ═════════════════════════════════════════════
  // CONFIG
  // ═════════════════════════════════════════════
  var AGENT_DIR = './agent/';
  var AGENT_FILES = ['portfolio.md']; // agrega más .md aquí para ampliar el conocimiento del agente

  var STOPWORDS = new Set([
    'el','la','los','las','un','una','unos','unas','de','del','al','y','o','que','en','a',
    'con','por','para','se','su','sus','es','soy','eres','me','mi','tu','tus','como',
    'cual','the','an','of','and','or','to','in','on','for','is','are','you','your','this','that'
  ]);

  var INTENT_KEYWORDS = {
    about_process: ['sobre mi', 'about', 'como piensas', 'como trabajas', 'proceso', 'experiencia', 'perfil', 'quien eres'],
    skills: ['habilidad', 'habilidades', 'stack', 'tecnologia', 'tecnologias', 'herramientas'],
    projects: ['proyecto', 'proyectos', 'trabajo', 'trabajos', 'portafolio', 'case study', 'casos'],
    contact: ['contacto', 'contactar', 'email', 'correo', 'escribir', 'hablar']
  };

  // ═════════════════════════════════════════════
  // UTILIDADES DE TEXTO (usadas por Parser, IntentEngine y SearchEngine)
  // ═════════════════════════════════════════════
  function normalize(text) {
    return (text || '').toString()
      .normalize('NFD').replace(/[\u0300-\u036f]/g, '') // quita acentos
      .toLowerCase()
      .replace(/[¿?¡!.,;:()"'`]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function singularize(word) {
    if (word.length > 4 && word.slice(-2) === 'es') return word.slice(0, -2);
    if (word.length > 3 && word.slice(-1) === 's') return word.slice(0, -1);
    return word;
  }

  function tokenize(text) {
    return normalize(text).split(' ')
      .filter(function (t) { return t.length > 1 && !STOPWORDS.has(t); })
      .map(singularize);
  }

  function escapeRegex(str) { return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }

  // ═════════════════════════════════════════════
  // LOADER — centraliza la carga de todos los .md de AGENT_DIR
  // ═════════════════════════════════════════════
  function loadAgentFiles() {
    var loads = AGENT_FILES.map(function (file) {
      var path = AGENT_DIR + file; // RUTA RELATIVA ESTRICTA — nunca "/agent/..."
      return fetch(path)
        .then(function (res) {
          if (!res.ok) throw new Error('HTTP ' + res.status);
          return res.text();
        })
        .then(function (text) { return { file: file, text: text, ok: true }; })
        .catch(function (err) { return { file: file, error: err.message, ok: false }; });
    });
    return Promise.all(loads);
  }

  // ═════════════════════════════════════════════
  // PARSER — encabezados (#, ##, ###) + metadatos opcionales por sección
  // Formatos soportados:
  //   Inline -> "## Título {intent: projects; tags: a, b; priority: 2}"
  //   Bloque -> línea(s) "<!-- meta: aliases: x, y; keywords: z -->" justo tras el encabezado
  // ═════════════════════════════════════════════
  function emptyMeta() { return { aliases: [], keywords: [], tags: [], intent: null, priority: 1 }; }

  function parseMetaString(raw) {
    var meta = emptyMeta();
    if (!raw) return meta;
    raw.split(';').forEach(function (pair) {
      var idx = pair.indexOf(':');
      if (idx === -1) return;
      var key = pair.slice(0, idx).trim().toLowerCase();
      var val = pair.slice(idx + 1).trim();
      if (!val) return;
      if (key === 'aliases' || key === 'keywords' || key === 'tags') {
        meta[key] = val.split(',').map(function (s) { return normalize(s); }).filter(Boolean);
      } else if (key === 'intent') {
        meta.intent = normalize(val);
      } else if (key === 'priority') {
        meta.priority = parseFloat(val) || 1;
      }
    });
    return meta;
  }

  function mergeMeta(target, extra) {
    ['aliases', 'keywords', 'tags'].forEach(function (k) {
      target[k] = target[k].concat(extra[k] || []);
    });
    if (extra.intent) target.intent = extra.intent;
    if (extra.priority && extra.priority !== 1) target.priority = extra.priority;
    return target;
  }

  function parseMarkdown(md, sourceFile) {
    var lines = md.replace(/\r\n/g, '\n').split('\n');
    var sections = [];
    var current = null;
    var collectingBlockMeta = false;
    var metaBuffer = [];

    function closeSection() {
      if (!current) return;
      current.raw = current.content.join('\n').trim();
      current.searchText = normalize(
        current.title + ' ' + current.title + ' ' +
        current.meta.aliases.join(' ') + ' ' + current.meta.keywords.join(' ') + ' ' +
        current.raw
      );
      sections.push(current);
    }

    lines.forEach(function (line) {
      var headerMatch = /^(#{1,3})\s+(.*)$/.exec(line);
      if (headerMatch && !collectingBlockMeta) {
        closeSection();
        var titleRaw = headerMatch[2].trim();
        var meta = emptyMeta();
        var inlineMatch = /\{([^}]*)\}\s*$/.exec(titleRaw);
        var title = titleRaw;
        if (inlineMatch) {
          title = titleRaw.slice(0, inlineMatch.index).trim();
          meta = parseMetaString(inlineMatch[1]);
        }
        current = { level: headerMatch[1].length, title: title, meta: meta, content: [], sourceFile: sourceFile, raw: '', searchText: '' };
        return;
      }

      if (!current) return;
      var trimmed = line.trim();

      // Metadatos en bloque: <!-- meta: ... --> (una o varias líneas), solo antes de que empiece el contenido real
      if (!collectingBlockMeta && current.content.length === 0 && /^<!--\s*meta:/i.test(trimmed)) {
        collectingBlockMeta = true;
        metaBuffer = [trimmed.replace(/^<!--\s*meta:/i, '')];
        if (/-->/.test(trimmed)) {
          collectingBlockMeta = false;
          mergeMeta(current.meta, parseMetaString(metaBuffer.join(' ').replace(/-->/, '')));
          metaBuffer = [];
        }
        return;
      }
      if (collectingBlockMeta) {
        metaBuffer.push(trimmed);
        if (/-->/.test(trimmed)) {
          collectingBlockMeta = false;
          mergeMeta(current.meta, parseMetaString(metaBuffer.join(' ').replace(/-->/, '')));
          metaBuffer = [];
        }
        return;
      }

      current.content.push(line);
    });
    closeSection();
    return sections;
  }

  // ═════════════════════════════════════════════
  // INDEXER — mapas por title / intent / keyword / alias / sourceFile
  // ═════════════════════════════════════════════
  function buildIndex(sections) {
    var index = { byTitle: {}, byIntent: {}, byKeyword: {}, byAlias: {}, byFile: {} };

    sections.forEach(function (s, i) {
      s.id = i;
      index.byTitle[normalize(s.title)] = s;

      if (s.meta.intent) {
        index.byIntent[s.meta.intent] = index.byIntent[s.meta.intent] || [];
        index.byIntent[s.meta.intent].push(s);
      }
      s.meta.keywords.forEach(function (k) {
        index.byKeyword[k] = index.byKeyword[k] || [];
        index.byKeyword[k].push(s);
      });
      s.meta.aliases.forEach(function (a) { index.byAlias[a] = s; });

      index.byFile[s.sourceFile] = index.byFile[s.sourceFile] || [];
      index.byFile[s.sourceFile].push(s);
    });

    // Orden dentro de cada archivo, necesario para resolver follow-ups tipo "¿cuál es el siguiente?"
    Object.keys(index.byFile).forEach(function (file) {
      index.byFile[file].forEach(function (s, order) { s.order = order; });
    });

    return index;
  }

  // ═════════════════════════════════════════════
  // INTENT ENGINE — infiere la intención de búsqueda del usuario
  // ═════════════════════════════════════════════
  function inferIntent(query) {
    var q = normalize(query);
    var best = null;
    var bestHits = 0;
    Object.keys(INTENT_KEYWORDS).forEach(function (intent) {
      var hits = 0;
      INTENT_KEYWORDS[intent].forEach(function (kw) {
        if (q.indexOf(normalize(kw)) !== -1) hits++;
      });
      if (hits > bestHits) { bestHits = hits; best = intent; }
    });
    return best;
  }

  // ═════════════════════════════════════════════
  // FAQ (fast path) — igualdad exacta de título o alias, sin pasar por el scoring
  // ═════════════════════════════════════════════
  function faqLookup(index, query) {
    var q = normalize(query);
    if (index.byAlias[q]) return index.byAlias[q];
    if (index.byTitle[q]) return index.byTitle[q];
    return null;
  }

  // ═════════════════════════════════════════════
  // SEARCH ENGINE — scoring acumulativo: intent, alias, title, keywords, content; x priority
  // Usa indexer para filtrar candidatos por intent antes de scoring completo
  // ═════════════════════════════════════════════
  function searchSectionsWithIndex(index, sections, query) {
    var terms = tokenize(query);
    if (!terms.length) return null;
    var intent = inferIntent(query);

    // Filtra candidatos: primero por intent si existe, luego por keywords/aliases
    var candidates = [];
    if (intent && index.byIntent[intent]) {
      candidates = index.byIntent[intent];
    } else {
      // Fallback: busca por keywords o alias
      var byKeyword = {};
      terms.forEach(function (t) {
        if (index.byKeyword[t]) {
          index.byKeyword[t].forEach(function (s) { byKeyword[s.id] = s; });
        }
      });
      candidates = Object.keys(byKeyword).length ? Object.values(byKeyword) : sections;
    }

    var best = null;
    var bestScore = 0;

    candidates.forEach(function (s) {
      var score = 0;
      if (intent && s.meta.intent === intent) score += 6;

      terms.forEach(function (term) {
        if (s.meta.aliases.some(function (a) { return a.indexOf(term) !== -1; })) score += 8;
        if (normalize(s.title).indexOf(term) !== -1) score += 5;
        if (s.meta.keywords.some(function (k) { return k.indexOf(term) !== -1; })) score += 4;
        var bodyHits = (s.searchText.match(new RegExp(escapeRegex(term), 'g')) || []).length;
        score += bodyHits;
      });

      score *= (s.meta.priority || 1);
      if (score > bestScore) { bestScore = score; best = s; }
    });

    return bestScore > 0 ? best : null;
  }

  // ═════════════════════════════════════════════
  // CONTEXT MANAGER — historial de últimas 5 consultas y resolución de follow-ups
  // ═════════════════════════════════════════════
  var ContextManager = (function () {
    var history = [];
    var MAX = 5;

    function push(query, section) {
      history.push({ query: query, section: section });
      if (history.length > MAX) history.shift();
    }
    function last() { return history.length ? history[history.length - 1] : null; }
    function isExpandRequest(query) {
      var q = normalize(query);
      return /(amplia|ampliar|mas detalle|cuentame mas|puedes ampliar|profundiza|dime mas|que fue despues de eso|contexto)/.test(q);
    }
    function isNextRequest(query) {
      var q = normalize(query);
      return /(siguiente|que aprendiste despues|y despues|cual es el siguiente|luego que|y entonces|que paso despues|continua con)/.test(q);
    }
    function isFollowUp(query) { return isExpandRequest(query) || isNextRequest(query); }

    return { push: push, last: last, isFollowUp: isFollowUp, isExpandRequest: isExpandRequest, isNextRequest: isNextRequest };
  })();

  // ═════════════════════════════════════════════
  // DOM ACTIONS — registro desacoplado de acciones de scroll, disparadas por intent
  // ═════════════════════════════════════════════
  var DOMActions = (function () {
    var registry = {};
    function registerAction(name, selector) { registry[name] = selector; }
    function triggerAction(name) {
      var selector = registry[name];
      if (!selector) return;
      var target = document.querySelector(selector);
      if (!target) return;
      setTimeout(function () { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 250);
    }
    return { registerAction: registerAction, triggerAction: triggerAction };
  })();

  DOMActions.registerAction('projects', '#work');
  DOMActions.registerAction('about_process', '#about');
  DOMActions.registerAction('skills', '#about');
  DOMActions.registerAction('contact', '#contact');

  // ═════════════════════════════════════════════
  // RESPONSE BUILDER — limpia markdown, listas, y trunca a párrafos completos
  // ═════════════════════════════════════════════
  function truncateToSentence(text, max) {
    if (text.length <= max) return text;
    var slice = text.slice(0, max);
    // Busca el último punto natural: . ! ? o salto de línea
    var lastPeriod = slice.lastIndexOf('. ');
    var lastExclaim = slice.lastIndexOf('! ');
    var lastQuestion = slice.lastIndexOf('? ');
    var lastNewline = slice.lastIndexOf('\n');
    var lastBreak = Math.max(lastPeriod, lastExclaim, lastQuestion, lastNewline);
    // Si encontró un punto natural en el último 50% del slice, úsalo; sino trunca limpio
    if (lastBreak > max * 0.5) slice = slice.slice(0, lastBreak + (lastNewline === lastBreak ? 0 : 1));
    return slice.trim() + '…';
  }

  function buildResponse(section, opts) {
    opts = opts || {};
    var clean = section.raw
      .replace(/[#*_`>]/g, '')
      .replace(/^\s*[-*]\s+/gm, '• ')      // - o * con espacio → •
      .replace(/^\s*(\d+)\.\s+/gm, '$1. ')  // 1. item → 1. item (preserva numeración)
      .replace(/\n{2,}/g, '\n')
      .trim();
    var max = opts.full ? 900 : 320;
    return { text: truncateToSentence(clean, max), source: section.title };
  }

  // ═════════════════════════════════════════════
  // CHIPS ENGINE — sugerencias dinámicas por tags compartidos + fallback fijo
  // ═════════════════════════════════════════════
  function relatedSections(allSections, section, limit) {
    if (!section || !section.meta.tags.length) return [];
    return allSections.filter(function (s) {
      return s !== section && s.meta.tags.some(function (t) { return section.meta.tags.indexOf(t) !== -1; });
    }).slice(0, limit);
  }

  var FAQ_PROMPT_CHIPS = [
    { label: '¿Quién eres?', query: 'quien eres' },
    { label: '¿Qué haces?', query: 'que haces' },
    { label: '¿Qué proyectos has hecho?', query: 'que proyectos has hecho' },
    { label: '¿Qué habilidades tienes?', query: 'que habilidades tienes' },
    { label: '¿Cómo puedo contactarte?', query: 'como contacto' },
    { label: '¿Cuál es tu proceso de diseño?', query: 'como diseñas' }
  ];

  var FAQ_ANSWER_MAP = {
    'quien eres': 'Soy Gregory Durán, Product Designer con formación en Ingeniería de Software.',
    'que haces': 'Diseño productos digitales y me enfoco en entender el problema completo antes de pensar en una solución visual.',
    'que proyectos has hecho': 'He trabajado en proyectos como Baseball Scoreboard, Jobs Hunter, Pulse e HidroCity.',
    'que habilidades tienes': 'Tengo experiencia en diseño de producto, UX/UI, investigación, arquitectura de información y desarrollo frontend con HTML, CSS, JavaScript, TypeScript y React.',
    'como contacto': 'Puedes escribirme a gregorymduran01@outlook.com.',
    'como diseñas': 'No sigo una metodología fija. A veces empiezo escribiendo ideas, otras haciendo diagramas mentales o diseñando directamente según el contexto del proyecto.'
  };

  function isFaqPrompt(query) {
    var q = normalize(query);
    return q === 'faq' || q === 'preguntas frecuentes' || q === 'preguntas' || q === 'dudas' || q.indexOf('preguntas frecuentes') !== -1 || q.indexOf('preguntas del faq') !== -1;
  }

  function buildChips(allSections, lastSection) {
    var related = relatedSections(allSections, lastSection, 2);
    var recommended = [
      { label: 'FAQ', query: 'preguntas frecuentes' },
      { label: '¿Quién eres?', query: 'quien eres' },
      { label: '¿Qué proyectos has hecho?', query: 'que proyectos has hecho' },
      { label: '¿Qué habilidades tienes?', query: 'que habilidades tienes' },
      { label: '¿Cómo contacto?', query: 'como contacto' }
    ];

    if (related.length) {
      var relatedChips = related.map(function (s) { return { label: s.title, query: s.title }; });
      return recommended.concat(relatedChips).slice(0, 6);
    }

    return recommended;
  }

  // ═════════════════════════════════════════════
  // CHAT UI — HTML/CSS aislado, liquid glass, barra flotante persistente sin botón de enviar
  // ═════════════════════════════════════════════
  var STYLE = `
  .gd-agent-bar{
    position:fixed;left:50%;bottom:20px;transform:translateX(-50%);
    z-index:9999;width:640px;max-width:calc(100vw - 32px);
    background:rgba(245,245,245,.35);
    -webkit-backdrop-filter:blur(24px) saturate(180%);
    backdrop-filter:blur(24px) saturate(180%);
    border:1px solid rgba(0,0,0,.06);
    border-radius:28px;
    box-shadow:
      0 32px 72px -24px rgba(0,0,0,.12),
      0 8px 24px -12px rgba(0,0,0,.08),
      inset 0 1px 0 rgba(255,255,255,.80),
      inset 0 -1px 1px rgba(0,0,0,.02);
    font-family:'DM Sans',sans-serif;
    display:flex;flex-direction:column;overflow:hidden;
  }

  .gd-agent-inputrow{
    display:flex;gap:10px;padding:14px 14px 14px 14px;border-top:1px solid rgba(0,0,0,.04);
    flex-shrink:0;background:rgba(255,255,255,.04);align-items:center;
  }
  
  .gd-agent-input{
    flex:1;border:1px solid rgba(0,0,0,.12);border-radius:52px;
    padding:12px 18px;font-size:13px;font-family:inherit;outline:none;
    background:rgba(0,0,0,.02);color:rgba(0,0,0,.88);min-width:0;
    transition:all 220ms cubic-bezier(.2,.0,.8,1);
    -webkit-font-smoothing:antialiased;box-sizing:border-box;
    position:relative;isolation:isolate;
  }

  .gd-agent-input::before{
    content:"";position:absolute;inset:-1px;border-radius:inherit;padding:1px;
    background:linear-gradient(90deg, rgba(59,130,246,.55), rgba(168,85,247,.55), rgba(236,72,153,.55), rgba(59,130,246,.55));
    background-size:220% 100%;opacity:0;pointer-events:none;z-index:-1;
    -webkit-mask:linear-gradient(#fff 0 0) content-box,linear-gradient(#fff 0 0);
    -webkit-mask-composite:xor;mask-composite:exclude;
    transition:opacity 220ms ease;
  }
  
  .gd-agent-input::placeholder{
    color:rgba(0,0,0,.45);opacity:1;
  }
  
  .gd-agent-input:hover{
    background:rgba(0,0,0,.04);border-color:rgba(0,0,0,.18);
  }
  
  .gd-agent-input:focus,
  .gd-agent-input:focus-visible{
    background:rgba(0,0,0,.05);border-color:rgba(0,0,0,.24);
    box-shadow:0 0 0 3px rgba(0,0,0,.08);
  }

  .gd-agent-input:focus::before,
  .gd-agent-input:focus-visible::before{
    opacity:1;animation:gdAgentInputGlow 2.4s linear infinite;
  }

  @keyframes gdAgentInputGlow{
    0%{background-position:0% 50%;}
    100%{background-position:200% 50%;}
  }
  
  .gd-agent-input:disabled{
    opacity:.60;cursor:not-allowed;
  }

  .gd-agent-toggle{
    background:rgba(0,0,0,.04);border:1px solid rgba(0,0,0,.08);cursor:pointer;
    color:rgba(0,0,0,.60);width:32px;height:32px;display:flex;align-items:center;
    justify-content:center;border-radius:50%;flex-shrink:0;
    transition:all 220ms cubic-bezier(.2,.0,.8,1);
  }
  .gd-agent-toggle:hover{
    background:rgba(0,0,0,.08);border-color:rgba(0,0,0,.12);color:rgba(0,0,0,.78);
  }
  .gd-agent-toggle:active{
    background:rgba(0,0,0,.12);
  }
  .gd-agent-toggle:focus-visible{
    outline:2px solid rgba(0,0,0,.24);outline-offset:2px;
  }
  .gd-agent-bar.collapsed .gd-agent-toggle{transform:rotate(180deg)}

  .gd-agent-body{
    display:flex;flex-direction:column;max-height:380px;overflow:hidden;
    transition:max-height 240ms cubic-bezier(.2,.0,.8,1);
  }
  .gd-agent-bar.collapsed .gd-agent-body{max-height:0}

  .gd-agent-messages{
    overflow-y:auto;padding:16px 16px;display:flex;flex-direction:column;
    gap:12px;max-height:260px;
  }
  
  .gd-agent-messages::-webkit-scrollbar{width:8px}
  .gd-agent-messages::-webkit-scrollbar-track{background:transparent;margin:4px 0}
  .gd-agent-messages::-webkit-scrollbar-thumb{
    background:rgba(0,0,0,.20);border-radius:4px;
    transition:background 220ms cubic-bezier(.2,.0,.8,1);
  }
  .gd-agent-messages::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.35)}

  .gd-agent-msg{
    max-width:88%;font-size:13px;line-height:1.6;padding:11px 14px;
    border-radius:16px;white-space:pre-wrap;word-wrap:break-word;
    transition:all 220ms cubic-bezier(.2,.0,.8,1);
  }
  
  .gd-agent-msg.bot{
    align-self:flex-start;background:rgba(255,255,255,.55);color:rgba(0,0,0,.88);
    -webkit-backdrop-filter:blur(14px);backdrop-filter:blur(14px);
    border:1px solid rgba(0,0,0,.06);border-bottom-left-radius:6px;
    box-shadow:0 4px 12px rgba(0,0,0,.06),inset 0 1px 0 rgba(255,255,255,.70);
  }
  
  .gd-agent-msg.user{
    align-self:flex-end;background:rgba(0,0,0,.88);color:#fff;
    border-bottom-right-radius:6px;
    box-shadow:0 4px 12px rgba(0,0,0,.16);
  }
  
  .gd-agent-msg .gd-agent-src{
    display:block;margin-top:8px;font-size:10px;font-weight:700;
    letter-spacing:.08em;text-transform:uppercase;
    color:rgba(0,0,0,.45);opacity:.80;
  }
  .gd-agent-msg.user .gd-agent-src{color:rgba(255,255,255,.65)}

  .gd-agent-chips{
    display:flex;flex-wrap:wrap;gap:8px;padding:0 16px 16px;flex-shrink:0;
  }
  
  .gd-agent-chip{
    font-size:12px;font-weight:500;color:rgba(0,0,0,.70);
    border:1px solid rgba(0,0,0,.12);border-radius:24px;padding:8px 14px;
    background:rgba(0,0,0,.02);cursor:pointer;
    transition:all 220ms cubic-bezier(.2,.0,.8,1);
    display:inline-flex;align-items:center;justify-content:center;
  }
  
  .gd-agent-chip:hover{
    background:rgba(0,0,0,.06);border-color:rgba(0,0,0,.18);
    color:rgba(0,0,0,.88);
  }
  
  .gd-agent-chip:active{
    background:rgba(0,0,0,.10);
  }
  
  .gd-agent-chip:focus-visible{
    outline:2px solid rgba(0,0,0,.24);outline-offset:1px;
  }

  @media(max-width:700px){
    .gd-agent-bar{
      left:16px;right:16px;bottom:16px;transform:none;width:auto;max-width:none;
      border-radius:24px;
    }
    .gd-agent-messages{max-height:50vh;padding:12px 14px}
    .gd-agent-chips{padding:0 14px 14px}
    .gd-agent-inputrow{padding:12px 12px}
    .gd-agent-input{padding:11px 16px;font-size:14px}
  }

  @media(max-width:480px){
    .gd-agent-bar{bottom:12px;left:12px;right:12px}
    .gd-agent-messages{padding:10px 12px;gap:10px}
    .gd-agent-msg{max-width:92%;font-size:12.5px;padding:9px 12px}
    .gd-agent-chips{padding:0 12px 12px;gap:6px}
    .gd-agent-chip{padding:6px 12px;font-size:11px}
    .gd-agent-input{padding:10px 14px;font-size:13px}
  }
  
  @media(prefers-reduced-motion:reduce){
    .gd-agent-bar,.gd-agent-toggle,.gd-agent-body,.gd-agent-msg,.gd-agent-chip,.gd-agent-input{
      transition:none !important;animation:none !important;
    }
  }
  `;

  function injectStyle() {
    var tag = document.createElement('style');
    tag.setAttribute('data-gd-agent', 'true');
    tag.textContent = STYLE;
    document.head.appendChild(tag);
  }

  function buildWidget() {
    var wrap = document.createElement('div');
    wrap.innerHTML =
      '<div class="gd-agent-bar" id="gdAgentBar">' +
        '<div class="gd-agent-body" id="gdAgentBody">' +
          '<div class="gd-agent-messages" id="gdAgentMessages"></div>' +
          '<div class="gd-agent-chips" id="gdAgentChips"></div>' +
        '</div>' +
        '<div class="gd-agent-inputrow">' +
          '<input class="gd-agent-input" id="gdAgentInput" type="text" placeholder="Pregúntame sobre este portafolio…" autocomplete="off">' +
          '<button class="gd-agent-toggle" id="gdAgentToggle" aria-label="Minimizar/expandir conversación">' +
            '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>' +
          '</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(wrap);
  }

  function addMessage(container, text, who, sourceTitle) {
    var el = document.createElement('div');
    el.className = 'gd-agent-msg ' + who;
    el.textContent = text;
    if (sourceTitle) {
      var src = document.createElement('span');
      src.className = 'gd-agent-src';
      src.textContent = '§ ' + sourceTitle;
      el.appendChild(src);
    }
    container.appendChild(el);
    container.scrollTop = container.scrollHeight;
  }

  function renderChips(container, chips, onPick) {
    container.innerHTML = '';
    chips.forEach(function (chip) {
      var btn = document.createElement('button');
      btn.className = 'gd-agent-chip';
      btn.textContent = chip.label;
      btn.dataset.q = chip.query;
      btn.addEventListener('click', function () { onPick(chip.query); });
      container.appendChild(btn);
    });
  }

  // ═════════════════════════════════════════════
  // BOOTSTRAP
  // ═════════════════════════════════════════════
  function init() {
    injectStyle();
    buildWidget();

    var bar = document.getElementById('gdAgentBar');
    var toggle = document.getElementById('gdAgentToggle');
    var messages = document.getElementById('gdAgentMessages');
    var input = document.getElementById('gdAgentInput');
    var chipsEl = document.getElementById('gdAgentChips');

    var sections = [];
    var index = { byTitle: {}, byIntent: {}, byKeyword: {}, byAlias: {}, byFile: {} };
    var ready = false;

    toggle.addEventListener('click', function () { bar.classList.toggle('collapsed'); });
    input.addEventListener('click', function (e) { e.stopPropagation(); });

    function showChips(lastSection) {
      renderChips(chipsEl, buildChips(sections, lastSection), handleQuery);
    }

    function showFaqOptions() {
      addMessage(messages, 'Elige una de estas preguntas para ver la respuesta:', 'bot');
      renderChips(chipsEl, FAQ_PROMPT_CHIPS, handleQuery);
    }

    function respondWithFaqAnswer(query) {
      var key = normalize(query);
      var answer = FAQ_ANSWER_MAP[key];
      if (!answer) return false;
      addMessage(messages, answer, 'bot');
      ContextManager.push(query, { title: 'FAQ', sourceFile: 'portfolio.md', order: 0, meta: { intent: 'faq' } });
      showChips(null);
      return true;
    }

    // Loader + Parser + Indexer
    loadAgentFiles().then(function (results) {
      var failed = [];
      results.forEach(function (r) {
        if (r.ok) {
          sections = sections.concat(parseMarkdown(r.text, r.file));
        } else {
          failed.push(r.file + ' (' + r.error + ')');
        }
      });

      if (!sections.length) {
        addMessage(messages, 'No pude cargar el contenido del agente. Verifica que: (1) la carpeta ./agent/ exista, (2) contiene portfolio.md, (3) ambos están en la raíz del sitio junto a index.html. Errores: ' + failed.join(', '), 'bot');
        return;
      }

      index = buildIndex(sections);
      ready = true;
      addMessage(messages, '¡Hola! Soy el asistente local de este portafolio. Pregúntame sobre proyectos, habilidades o cómo contactar a Gregory.', 'bot');
      showChips(null);

      if (failed.length) {
        addMessage(messages, 'Aviso: no se pudo cargar ' + failed.join(', ') + '. El resto del contenido sí está disponible.', 'bot');
      }
    });

    function respondWithSection(section, opts) {
      var response = buildResponse(section, opts);
      addMessage(messages, response.text, 'bot', response.source);
      ContextManager.push(input.value, section);
      showChips(section);
      if (section.meta.intent) DOMActions.triggerAction(section.meta.intent);
    }

    function handleQuery(query) {
      query = (query || '').trim();
      if (!query) return;
      if (bar.classList.contains('collapsed')) bar.classList.remove('collapsed');
      addMessage(messages, query, 'user');
      input.value = '';

      if (!ready) {
        addMessage(messages, 'Todavía estoy cargando el contenido del portafolio, un momento…', 'bot');
        return;
      }

      setTimeout(function () {
        if (isFaqPrompt(query)) {
          showFaqOptions();
          return;
        }

        if (respondWithFaqAnswer(query)) return;

        // ContextManager: resuelve follow-ups antes que FAQ/SearchEngine
        var last = ContextManager.last();
        if (last && ContextManager.isFollowUp(query)) {
          if (ContextManager.isNextRequest(query)) {
            var fileSections = index.byFile[last.section.sourceFile] || [];
            var next = fileSections[last.section.order + 1];
            if (next) { respondWithSection(next); return; }
            addMessage(messages, 'No hay una sección siguiente después de "' + last.section.title + '" en el contenido del agente.', 'bot');
            showChips(last.section);
            return;
          }
          if (ContextManager.isExpandRequest(query)) {
            respondWithSection(last.section, { full: true });
            return;
          }
        }

        // FAQ fast path -> SearchEngine (con IntentEngine + scoring)
        var result = faqLookup(index, query) || searchSectionsWithIndex(index, sections, query);

        if (result) {
          respondWithSection(result);
        } else {
          addMessage(messages, 'No encontré una sección específica sobre eso en el contenido del agente. Prueba con "proyectos", "habilidades" o "contacto".', 'bot');
          var intent = inferIntent(query);
          if (intent) DOMActions.triggerAction(intent);
          showChips(last ? last.section : null);
        }
      }, 180);
    }

    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleQuery(input.value);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
