const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const projectsDir = path.join(root, 'proyectos');
const indexPath = path.join(root, 'index.html');
const startMarker = '<!-- PROJECTS:START -->';
const endMarker = '<!-- PROJECTS:END -->';

const knownProjects = [
  {
    slug: 'baseball-scoreboard',
    name: 'Baseball Scoreboard',
    type: 'Web App',
    status: 'live',
    esDesc: 'La decisión importante aquí no fue visual, fue arquitectónica: sincronizar consola y pantalla en el cliente, sin depender de un servidor. Diseñé la interfaz, escribí el código, y lo usé en producción durante el torneo del Ministerio Cristiano HOME.',
    enDesc: 'The important decision here wasn\'t visual, it was architectural: sync the operator console and projection screen on the client, without a server. I designed the interface, wrote the code, and used it in production during the Ministerio Cristiano HOME tournament.',
    esAria: 'Baseball Scoreboard — Ver caso de estudio',
    enAria: 'Baseball Scoreboard — View case study',
    image: 'assets/img/baseball-scoreboard/cover.jpg',
    imageAlt: 'Preview Baseball Scoreboard',
    useImageComment: true
  },
  {
    slug: 'jobs-hunter',
    name: 'Jobs Hunter',
    type: 'Case Study',
    esDesc: 'Rediseño de una plataforma de búsqueda de empleo. Analicé competidores no para copiar patrones, sino para entender qué problema resolvía cada uno. Las comparativas antes/después se validaron con usuarios reales.',
    enDesc: 'Redesign of a job search platform. I analyzed competitors not to copy patterns, but to understand what problem each one solved. Before/after comparisons were validated with real users.',
    esAria: 'Jobs Hunter — Ver caso de estudio',
    enAria: 'Jobs Hunter — View case study',
    image: 'assets/img/jobs-hunter/cover.jpg',
    imageAlt: 'Preview Jobs Hunter',
    useImageComment: true
  },
  {
    slug: 'pulse',
    name: 'Pulse',
    type: 'Windows 11 App',
    status: 'wip',
    esDesc: 'App de Windows 11 para freelancers creativos, aún en diseño. Está construida sobre Fluent Design System porque el SO resuelve la mayoría de la coherencia visual. El trabajo está en aprovechar eso, no en reinventar.',
    enDesc: 'Windows 11 time tracking app for creative freelancers, still in design. Built on Fluent Design System because the OS solves most of the visual coherence. The work is leveraging that, not reinventing it.',
    esAria: 'Pulse — Ver proceso de diseño',
    enAria: 'Pulse — View design process',
    image: 'assets/img/pulse/cover.jpg',
    imageAlt: 'Preview Pulse App',
    useImageComment: true
  }
];

function readProjectFiles() {
  if (!fs.existsSync(projectsDir) || !fs.statSync(projectsDir).isDirectory()) {
    throw new Error('No se encontró la carpeta proyectos/');
  }

  return fs.readdirSync(projectsDir)
    .filter((file) => path.extname(file).toLowerCase() === '.html')
    .map((file) => path.basename(file, '.html'))
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

function escapeValue(value) {
  return String(value || '')
    .replace(/\\/g, '\\\\')
    .replace(/'/g, "\\'")
    .replace(/\r?\n/g, '\\n');
}

function buildProjectCard(slug, index) {
  const number = String(index + 1).padStart(2, '0');
  const cardKey = `proj${number}`;
  const project = knownProjects.find((item) => item.slug === slug) || null;
  const name = project ? project.name : slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
  const type = project ? project.type : 'Web Project';
  const esDesc = project ? project.esDesc : 'Proyecto nuevo agregado automáticamente. Detalles en desarrollo.';
  const enDesc = project ? project.enDesc : 'New project added automatically. Details in development.';
  const esAria = project ? project.esAria : `${name} — Ver caso de estudio`;
  const enAria = project ? project.enAria : `${name} — View case study`;
  const imageAlt = project ? project.imageAlt : `Preview ${name}`;
  const imageBlock = project && project.useImageComment
    ? `              <!-- REEMPLAZAR: sube tu screenshot a ${project.image} y descomenta -->\n              <img src="" alt="${imageAlt}">\n              <!-- <img src="${project.image}" alt="${imageAlt}"> -->`
    : `              <img src="" alt="${imageAlt}">`;
  const status = project && project.status
    ? `\n                <span class="proj-status ${project.status}" data-i18n="${project.status === 'live' ? 'status-live' : 'status-wip'}">${project.status === 'live' ? 'Desplegado' : 'En diseño'}</span>`
    : '';

  return {
    html: `          <!-- ${number} ${name} -->\n          <div class="proj rv" role="listitem">\n            <a href="proyectos/${slug}.html" class="proj-link" data-i18n-aria="${cardKey}-aria" aria-label="${esAria}"></a>\n            <div class="proj-img">\n${imageBlock}\n            </div>\n            <div class="proj-body">\n              <div class="proj-meta">\n                <span class="proj-num">${number}</span>\n                <span class="proj-type" data-i18n="${cardKey}-type">${type}</span>${status}\n              </div>\n              <p class="proj-name" data-i18n="${cardKey}-name">${name}</p>\n              <p class="proj-desc" data-i18n="${cardKey}-desc">${esDesc}</p>\n            </div>\n          </div>`,
    translations: {
      es: {
        [`${cardKey}-aria`]: esAria,
        [`${cardKey}-type`]: type,
        [`${cardKey}-name`]: name,
        [`${cardKey}-desc`]: esDesc
      },
      en: {
        [`${cardKey}-aria`]: enAria,
        [`${cardKey}-type`]: type,
        [`${cardKey}-name`]: name,
        [`${cardKey}-desc`]: enDesc
      }
    }
  };
}

function findSection(html, tokenStart, tokenEnd) {
  const startIndex = html.indexOf(tokenStart);
  const endIndex = html.indexOf(tokenEnd, startIndex);
  if (startIndex === -1 || endIndex === -1) return null;
  return { startIndex, endIndex, body: html.slice(startIndex + tokenStart.length, endIndex) };
}

function updateProjectsSection(html, cards) {
  const section = findSection(html, startMarker, endMarker);
  if (!section) {
    throw new Error('No se encontraron los marcadores PROJECTS:START / PROJECTS:END en index.html');
  }

  const cardHtml = cards.map((card) => card.html).join('\n\n');
  return html.slice(0, section.startIndex + startMarker.length) + '\n' + cardHtml + '\n          ' + html.slice(section.endIndex);
}

function parseTranslationSection(sectionText) {
  const entries = {};
  const regex = /'([^']+)':\s*'((?:\\'|[^'])*)'/g;
  let match;
  while ((match = regex.exec(sectionText)) !== null) {
    entries[match[1]] = match[2].replace(/\\'/g, "'");
  }
  return entries;
}

function updateTranslationSection(html, lang, values) {
  const token = `${lang}: {`;
  const section = findSection(html, token, '}');
  if (!section) return html;

  const existing = parseTranslationSection(section.body);
  const merged = Object.assign({}, existing, values);
  const indentation = section.body.match(/^(\s*)'/m)?.[1] || '        ';
  const lines = Object.keys(merged).sort().map((key) => `        '${key}': '${escapeValue(merged[key])}',`);
  const replacement = `${token}\n${lines.join('\n')}\n      }`;

  return html.slice(0, section.startIndex) + replacement + html.slice(section.endIndex + 1);
}

function main() {
  const slugs = readProjectFiles();
  const cards = slugs.map((slug, index) => buildProjectCard(slug, index));
  const html = fs.readFileSync(indexPath, 'utf8');
  const updated = updateProjectsSection(html, cards);

  const esValues = {};
  const enValues = {};
  cards.forEach((card) => {
    Object.assign(esValues, card.translations.es);
    Object.assign(enValues, card.translations.en);
  });

  const withEs = updateTranslationSection(updated, 'es', esValues);
  const withEn = updateTranslationSection(withEs, 'en', enValues);

  fs.writeFileSync(indexPath, withEn, 'utf8');
  console.log(`index.html actualizado con ${slugs.length} proyectos y traducciones sincronizadas.`);
}

main();
