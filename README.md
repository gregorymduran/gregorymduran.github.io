# Portafolio — Gregory Durán

Sitio estático (HTML/CSS/JS vanilla, sin frameworks) listo para publicarse con **GitHub Pages**.

## Estructura

```
/
├── index.html                          ← Landing principal (home)
├── .nojekyll                           ← Evita el procesamiento Jekyll de GitHub
├── proyectos/
│   ├── baseball-scoreboard.html        ← Caso de estudio (desplegado)
│   ├── jobs-hunter.html                ← Caso de estudio (pendiente de crear)
│   └── pulse.html                      ← Caso de estudio (pendiente de crear)
└── assets/
    ├── cv/
    │   └── gregory-duran-cv.pdf        ← Reemplazar con tu CV real
    └── img/
        ├── baseball-scoreboard/
        │   └── cover.jpg               ← Imagen de preview en el index
        ├── jobs-hunter/
        │   └── cover.jpg
        └── pulse/
            └── cover.jpg
```

## Publicar en GitHub Pages

1. Crea un repositorio en GitHub (puede ser `tu-usuario.github.io` para que quede en
   la raíz de tu dominio, o cualquier otro nombre si prefieres que quede en
   `tu-usuario.github.io/nombre-repo`).
2. Sube todo el contenido de esta carpeta a la raíz del repositorio (no a una subcarpeta).
3. Ve a **Settings → Pages** en GitHub.
4. En **Source**, selecciona la rama `main` y la carpeta `/ (root)`.
5. Guarda. El sitio queda publicado en unos minutos en la URL que GitHub te indique.

No hace falta build step, ni `npm install`, ni configuración adicional — todo el
sitio es HTML/CSS/JS plano.

## Reemplazar las imágenes de proyecto (placeholders)

Cada tarjeta de proyecto en `index.html` tiene un bloque así:

```html
<div class="proj-img">
  <!-- REEMPLAZAR: sube tu screenshot a assets/img/baseball-scoreboard/cover.jpg y descomenta -->
  <img src="" alt="Preview Baseball Scoreboard">
  <!-- <img src="assets/img/baseball-scoreboard/cover.jpg" alt="Preview Baseball Scoreboard"> -->
</div>
```

Para activar una imagen real:

1. Coloca tu captura en la carpeta correspondiente dentro de `assets/img/`
   (recomendado: 1600×1000px o proporción 16:10, formato `.jpg` o `.webp`).
2. Borra la línea `<img src="" ...>` vacía.
3. Quita los comentarios `<!-- -->` de la línea de abajo, que ya apunta a la ruta correcta.

El marcador "Preview" desaparece automáticamente en cuanto detecta una imagen con `src`.

## Reemplazar el CV

Sustituye el archivo en `assets/cv/gregory-duran-cv.pdf` por tu CV real,
manteniendo el mismo nombre de archivo (o actualiza el `href` en `index.html`
si usas otro nombre).

## Cómo agregar un nuevo caso de estudio

1. Duplica `proyectos/baseball-scoreboard.html` como punto de partida — ya tiene
   el header/footer correctamente enlazados a `../index.html`.
2. Renómbralo, por ejemplo `proyectos/jobs-hunter.html`.
3. Reemplaza el contenido (hero, problema, decisiones, resultados) por el del
   nuevo proyecto.
4. En `index.html`, dentro de la tarjeta correspondiente en `#work`, cambia el
   `href` del `<a class="proj-link">` para que apunte a tu nuevo archivo:
   ```html
   <a href="proyectos/jobs-hunter.html" class="proj-link" ...>
   ```
5. Agrega la imagen de preview en `assets/img/jobs-hunter/cover.jpg` y actívala
   como se explica arriba.

## Bilingüe (ES / EN)

`index.html` tiene un selector de idioma en el nav (`ES` / `EN`) que traduce todo
el texto de la página sin recargar. Las traducciones viven en el objeto `t` dentro
del `<script>` al final del archivo — para corregir o ampliar un texto, edita ahí
las claves `es` y `en` correspondientes.

Los casos de estudio en `/proyectos/` actualmente **no** tienen el selector de
idioma implementado — están solo en español. Si quieres añadirlo, se puede portar
el mismo patrón `data-i18n` usado en `index.html`.

## Pendientes de contenido (placeholders activos)

Busca estos marcadores en el código antes de publicar:

- `tu-email@dominio.com` — tu correo real (aparece en `index.html` y en el footer
  de los casos de estudio).
- `href="#"` en los links de GitHub y Behance — agrega tus URLs reales.
- `assets/cv/gregory-duran-cv.pdf` — sube el archivo real.
- `src=""` en las tres tarjetas de proyecto — activa las imágenes reales.
