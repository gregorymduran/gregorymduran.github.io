const fs = require('fs');
const path = require('path');

// Regenera las tarjetas de proyecto de index.html (entre PROJECTS:START y PROJECTS:END)
// a partir de proyectos/*.html y de la metadata de abajo.
//
// Reglas:
// - Un proyecto sin metadata en knownProjects NO se publica (se avisa en consola):
//   nunca se genera texto de relleno ni imágenes vacías.
// - hidden: true deja la página accesible pero fuera de la home (p. ej. conceptos en curso).
// - Las traducciones solo se agregan si faltan: el copy editado a mano en
//   locales/{es,en}.json nunca se sobrescribe.
//
// Uso: node scripts/sync-project-cards.js

const root = path.resolve(__dirname, '..');
const projectsDir = path.join(root, 'proyectos');
const indexPath = path.join(root, 'index.html');
const localesDir = path.join(root, 'locales');
const startMarker = '<!-- PROJECTS:START -->';
const endMarker = '<!-- PROJECTS:END -->';

// slug = nombre del archivo en proyectos/*.html
// alias = prefijo de las claves de traducción (data-i18n="projects.<alias>.*")
const knownProjects = [
  {
    slug: 'baseball-scoreboard',
    alias: 'baseball',
    order: 1,
    image: 'assets/img/baseball-scoreboard/cover.jpg',
    facts: 3,
    es: {
      title: 'Baseball Scoreboard',
      type: 'Web App',
      status: 'En uso real',
      aria: 'Baseball Scoreboard — Ver caso de estudio',
      imageAlt: 'Consola del operador y pantalla de proyección de Baseball Scoreboard'
    },
    en: {
      title: 'Baseball Scoreboard',
      type: 'Web App',
      status: 'In real use',
      aria: 'Baseball Scoreboard — View case study',
      imageAlt: 'Baseball Scoreboard operator console and projection screen'
    }
  },
  {
    slug: 'kerygma-stage',
    alias: 'kerygma',
    order: 2,
    image: 'assets/img/kerygma-stage/cover.jpg',
    facts: 3,
    es: {
      title: 'Kerygma Stage',
      type: 'Desktop App',
      status: 'En uso semanal',
      aria: 'Kerygma Stage — Ver caso de estudio',
      imageAlt: 'Consola del operador de Kerygma Stage con vista previa y vista en vivo'
    },
    en: {
      title: 'Kerygma Stage',
      type: 'Desktop App',
      status: 'Used weekly',
      aria: 'Kerygma Stage — View case study',
      imageAlt: 'Kerygma Stage operator console with separate preview and live views'
    }
  },
  {
    // Concepto en curso: sin capturas ni resultados todavía.
    slug: 'nexo',
    alias: 'nexo',
    hidden: true
  }
];

function readProjectSlugs() {
  if (!fs.existsSync(projectsDir) || !fs.statSync(projectsDir).isDirectory()) {
    throw new Error('No se encontró la carpeta proyectos/');
  }

  return fs.readdirSync(projectsDir)
    .filter((file) => path.extname(file).toLowerCase() === '.html')
    .map((file) => path.basename(file, '.html'));
}

function readLocale(lang) {
  return JSON.parse(fs.readFileSync(path.join(localesDir, `${lang}.json`), 'utf8'));
}

function escapeAttr(value) {
  return String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;');
}

function buildProjectCard(project, index, es) {
  const number = String(index + 1).padStart(2, '0');
  const key = (name) => `projects.${project.alias}.${name}`;
  const text = (name) => es[key(name)] || '';
  const facts = Array.from({ length: project.facts || 0 }, (_, i) =>
    `                <li data-i18n="${key(`fact${i + 1}`)}">${text(`fact${i + 1}`)}</li>`
  ).join('\n');

  return `          <!-- ${number} ${project.es.title} -->
          <article class="proj rv" role="listitem">
            <a href="proyectos/${project.slug}.html" class="proj-link" data-i18n-aria="${key('aria')}" aria-label="${escapeAttr(text('aria'))}"></a>
            <div class="proj-img">
              <img src="${project.image}" data-i18n-alt="${key('imageAlt')}" alt="${escapeAttr(text('imageAlt'))}" width="1600" height="1000" loading="lazy">
            </div>
            <div class="proj-body">
              <div class="proj-meta">
                <span class="proj-num">${number}</span>
                <span class="proj-type" data-i18n="${key('type')}">${text('type')}</span>
                <span class="proj-status" data-i18n="${key('status')}">${text('status')}</span>
              </div>
              <h3 class="proj-name" data-i18n="${key('title')}">${text('title')}</h3>
              <p class="proj-desc" data-i18n="${key('description')}">${text('description')}</p>
              <p class="proj-role"><strong data-i18n="projects.roleLabel">${es['projects.roleLabel'] || 'Rol:'}</strong> <span data-i18n="${key('role')}">${text('role')}</span></p>
              <ul class="proj-kpi">
${facts}
              </ul>
              <span class="proj-cta" aria-hidden="true"><span data-i18n="projects.cta">${es['projects.cta'] || 'Ver caso de estudio'}</span>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
              </span>
            </div>
          </article>`;
}

function updateProjectsSection(html, cardsHtml) {
  const startIndex = html.indexOf(startMarker);
  const endIndex = html.indexOf(endMarker, startIndex);
  if (startIndex === -1 || endIndex === -1) {
    throw new Error('No se encontraron los marcadores PROJECTS:START / PROJECTS:END en index.html');
  }
  return html.slice(0, startIndex + startMarker.length) + '\n' + cardsHtml + '\n          ' + html.slice(endIndex);
}

function addMissingTranslations(lang, values) {
  const localePath = path.join(localesDir, `${lang}.json`);
  const existing = readLocale(lang);
  let added = 0;
  Object.keys(values).forEach((k) => {
    if (existing[k] === undefined) {
      existing[k] = values[k];
      added += 1;
    }
  });
  fs.writeFileSync(localePath, JSON.stringify(existing, null, 2) + '\n', 'utf8');
  return added;
}

function main() {
  const slugs = readProjectSlugs();
  const published = [];

  slugs.forEach((slug) => {
    const meta = knownProjects.find((item) => item.slug === slug);
    if (!meta) {
      console.warn(`⚠ proyectos/${slug}.html no tiene metadata en knownProjects: no se publica en la home.`);
      return;
    }
    if (meta.hidden) return;
    if (!fs.existsSync(path.join(root, meta.image))) {
      console.warn(`⚠ Falta la portada ${meta.image}: ${slug} no se publica en la home.`);
      return;
    }
    published.push(meta);
  });

  published.sort((a, b) => (a.order || 99) - (b.order || 99));

  ['es', 'en'].forEach((lang) => {
    const values = {};
    published.forEach((p) => {
      Object.keys(p[lang]).forEach((name) => {
        values[`projects.${p.alias}.${name}`] = p[lang][name];
      });
    });
    const added = addMissingTranslations(lang, values);
    if (added) console.log(`${lang}.json: ${added} clave(s) nuevas.`);
  });

  const es = readLocale('es');
  ['description', 'role'].forEach((name) => {
    published.forEach((p) => {
      if (!es[`projects.${p.alias}.${name}`]) {
        console.warn(`⚠ Falta projects.${p.alias}.${name} en locales/es.json y en.json: escríbelo a mano.`);
      }
    });
  });

  const cardsHtml = published.map((p, i) => buildProjectCard(p, i, es)).join('\n\n');
  const html = fs.readFileSync(indexPath, 'utf8');
  fs.writeFileSync(indexPath, updateProjectsSection(html, cardsHtml), 'utf8');

  console.log(`index.html actualizado con ${published.length} proyecto(s): ${published.map((p) => p.slug).join(', ')}.`);
}

main();
