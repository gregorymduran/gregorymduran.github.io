const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const projectsDir = path.join(root, 'proyectos');
const indexPath = path.join(root, 'index.html');
const localesDir = path.join(root, 'locales');
const startMarker = '<!-- PROJECTS:START -->';
const endMarker = '<!-- PROJECTS:END -->';

// slug = nombre del archivo en proyectos/*.html
// alias = prefijo usado en las claves de traducción (data-i18n="projects.<alias>.*"),
// tal como viven hoy en locales/es.json y locales/en.json
const knownProjects = [
  {
    slug: 'baseball-scoreboard',
    alias: 'baseball',
    type: 'Web App',
    status: 'live',
    image: 'assets/img/baseball-scoreboard/cover.jpg',
    imageAlt: 'Preview Baseball Scoreboard',
    esTitle: 'Baseball Scoreboard',
    enTitle: 'Baseball Scoreboard',
    esDesc: 'La decisión importante aquí no fue visual, fue arquitectónica: sincronizar consola y pantalla en el cliente, sin depender de un servidor. Diseñé la interfaz, escribí el código, y lo usé en producción durante el torneo del Ministerio Cristiano HOME.',
    enDesc: 'The important decision here wasn’t visual, it was architectural: synchronizing the operator console and projection screen on the client without relying on a server. I designed the interface, wrote the code, and used it in production during the Ministerio Cristiano HOME tournament.',
    esAria: 'Baseball Scoreboard — Ver caso de estudio',
    enAria: 'Baseball Scoreboard — View case study',
    esStatus: 'Desplegado',
    enStatus: 'Deployed'
  },
  {
    slug: 'nexo',
    alias: 'nexo',
    type: 'Web Project',
    status: 'wip',
    image: 'assets/img/nexo/cover.jpg',
    imageAlt: 'Preview Nexo',
    esTitle: 'Nexo',
    enTitle: 'Nexo',
    esDesc: 'Proyecto nuevo agregado automáticamente. Detalles en desarrollo.',
    enDesc: 'New project added automatically. Details in development.',
    esAria: 'Nexo — Ver caso de estudio',
    enAria: 'Nexo — View case study',
    esStatus: 'En progreso',
    enStatus: 'In progress'
  },
  {
    slug: 'jobs-hunter',
    alias: 'jobs-hunter',
    type: 'Case Study',
    image: 'assets/img/jobs-hunter/cover.jpg',
    imageAlt: 'Preview Jobs Hunter',
    esTitle: 'Jobs Hunter',
    enTitle: 'Jobs Hunter',
    esDesc: 'Rediseño de una plataforma de búsqueda de empleo. Analicé competidores no para copiar patrones, sino para entender qué problema resolvía cada uno. Las comparativas antes/después se validaron con usuarios reales.',
    enDesc: 'Redesign of a job search platform. I analyzed competitors not to copy patterns, but to understand what problem each one solved. Before/after comparisons were validated with real users.',
    esAria: 'Jobs Hunter — Ver caso de estudio',
    enAria: 'Jobs Hunter — View case study'
  },
  {
    slug: 'pulse',
    alias: 'pulse',
    type: 'Windows 11 App',
    status: 'wip',
    image: 'assets/img/pulse/cover.jpg',
    imageAlt: 'Preview Pulse App',
    esTitle: 'Pulse',
    enTitle: 'Pulse',
    esDesc: 'App de Windows 11 para freelancers creativos, aún en diseño. Está construida sobre Fluent Design System porque el SO resuelve la mayoría de la coherencia visual. El trabajo está en aprovechar eso, no en reinventar.',
    enDesc: 'Windows 11 time tracking app for creative freelancers, still in design. Built on Fluent Design System because the OS solves most of the visual coherence. The work is leveraging that, not reinventing it.',
    esAria: 'Pulse — Ver proceso de diseño',
    enAria: 'Pulse — View design process',
    esStatus: 'En diseño',
    enStatus: 'In design'
  }
];

function readProjectSlugs() {
  if (!fs.existsSync(projectsDir) || !fs.statSync(projectsDir).isDirectory()) {
    throw new Error('No se encontró la carpeta proyectos/');
  }

  return fs.readdirSync(projectsDir)
    .filter((file) => path.extname(file).toLowerCase() === '.html')
    .map((file) => path.basename(file, '.html'))
    .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
}

function resolveProject(slug) {
  const known = knownProjects.find((item) => item.slug === slug);
  if (known) return known;

  // Proyecto sin metadata todavía: alias = slug, texto de relleno explícito
  const name = slug.replace(/[-_]/g, ' ').replace(/\b\w/g, (ch) => ch.toUpperCase());
  return {
    slug,
    alias: slug,
    type: 'Web Project',
    image: `assets/img/${slug}/cover.jpg`,
    imageAlt: `Preview ${name}`,
    esTitle: name,
    enTitle: name,
    esDesc: 'Proyecto nuevo agregado automáticamente. Detalles en desarrollo.',
    enDesc: 'New project added automatically. Details in development.',
    esAria: `${name} — Ver caso de estudio`,
    enAria: `${name} — View case study`
  };
}

function buildProjectCard(project, index) {
  const number = String(index + 1).padStart(2, '0');
  const imageBlock = `              <!-- REEMPLAZAR: sube tu screenshot a ${project.image} y descomenta -->\n              <!-- <img src="${project.image}" alt="${project.imageAlt}"> -->`;
  const status = project.status
    ? `\n                <span class="proj-status ${project.status}" data-i18n="projects.${project.alias}.status"></span>`
    : '';

  const html = `          <!-- ${number} ${project.esTitle} -->\n          <div class="proj rv" role="listitem">\n            <a href="proyectos/${project.slug}.html" class="proj-link" data-i18n-aria="projects.${project.alias}.aria"></a>\n            <div class="proj-img">\n${imageBlock}\n            </div>\n            <div class="proj-body">\n              <div class="proj-meta">\n                <span class="proj-num">${number}</span>\n                <span class="proj-type" data-i18n="projects.${project.alias}.type"></span>${status}\n              </div>\n              <p class="proj-name" data-i18n="projects.${project.alias}.title"></p>\n              <p class="proj-desc" data-i18n="projects.${project.alias}.description"></p>\n            </div>\n          </div>`;

  const translations = {
    es: {
      [`projects.${project.alias}.aria`]: project.esAria,
      [`projects.${project.alias}.type`]: project.type,
      [`projects.${project.alias}.title`]: project.esTitle,
      [`projects.${project.alias}.description`]: project.esDesc
    },
    en: {
      [`projects.${project.alias}.aria`]: project.enAria,
      [`projects.${project.alias}.type`]: project.type,
      [`projects.${project.alias}.title`]: project.enTitle,
      [`projects.${project.alias}.description`]: project.enDesc
    }
  };

  if (project.status) {
    translations.es[`projects.${project.alias}.status`] = project.esStatus || project.status;
    translations.en[`projects.${project.alias}.status`] = project.enStatus || project.status;
  }

  return { html, translations };
}

function findSection(html, tokenStart, tokenEnd) {
  const startIndex = html.indexOf(tokenStart);
  const endIndex = html.indexOf(tokenEnd, startIndex);
  if (startIndex === -1 || endIndex === -1) return null;
  return { startIndex, endIndex };
}

function updateProjectsSection(html, cards) {
  const section = findSection(html, startMarker, endMarker);
  if (!section) {
    throw new Error('No se encontraron los marcadores PROJECTS:START / PROJECTS:END en index.html');
  }

  const cardHtml = cards.map((card) => card.html).join('\n\n');
  return html.slice(0, section.startIndex + startMarker.length) + '\n' + cardHtml + '\n          ' + html.slice(section.endIndex);
}

function updateLocaleFile(lang, values) {
  const localePath = path.join(localesDir, `${lang}.json`);
  const existing = JSON.parse(fs.readFileSync(localePath, 'utf8'));
  const merged = Object.assign(existing, values);
  fs.writeFileSync(localePath, JSON.stringify(merged, null, 2) + '\n', 'utf8');
}

function main() {
  const slugs = readProjectSlugs();
  const projects = slugs.map(resolveProject);
  const cards = projects.map((project, index) => buildProjectCard(project, index));

  const html = fs.readFileSync(indexPath, 'utf8');
  const updated = updateProjectsSection(html, cards);
  fs.writeFileSync(indexPath, updated, 'utf8');

  const esValues = {};
  const enValues = {};
  cards.forEach((card) => {
    Object.assign(esValues, card.translations.es);
    Object.assign(enValues, card.translations.en);
  });

  updateLocaleFile('es', esValues);
  updateLocaleFile('en', enValues);

  console.log(`index.html y locales/{es,en}.json actualizados con ${slugs.length} proyecto(s): ${slugs.join(', ')}.`);
}

main();
