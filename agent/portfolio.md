# Gregory Durán {tags: intro, identity, product, technology}

Product Designer con formación en Ingeniería de Software.

Diseño productos digitales entendiendo tanto la experiencia como el sistema que la hace posible: flujos, estados, reglas y prevención de errores para personas que operan bajo presión.

Me fascina el espacio donde el software y la vida cotidiana se cruzan.

---

## ¿Quién soy? {intent: identity; aliases: quien eres, quién eres, sobre ti, presentate, preséntate, háblame de ti, gregory; tags: identity, intro; priority: 10}

Soy Gregory Durán, Product Designer con formación en Ingeniería de Software, de República Dominicana.

Siempre me ha gustado la tecnología. Antes de aprender diseño ya pasaba horas viendo conceptos futuristas de Windows, imaginando cómo podrían cambiar los sistemas operativos y la interacción entre las personas y las computadoras.

Con el tiempo entendí que quería participar en la construcción de esos productos. Por eso estudié Ingeniería de Software en la Universidad APEC y terminé especializándome en diseño de producto.

---

## ¿Qué hago? {intent: what_i_do; aliases: que haces, qué haces, a que te dedicas, a qué te dedicas, rol, propuesta de valor, valor; tags: identity, product; priority: 10}

Diseño productos digitales claros, sistemas de interacción y experiencias que funcionan bajo restricciones reales de tecnología y de uso.

Mi ventaja es entender cómo se construye lo que diseño. Por eso puedo tratar las restricciones técnicas como parte del diseño, no como algo que se descubre al final.

Mis dos casos de estudio principales, Baseball Scoreboard y Kerygma Stage, son productos en uso real que diseñé y construí de punta a punta.

---

## ¿Cómo pienso? {intent: mindset; aliases: como piensas, cómo piensas, filosofia personal, criterio, forma de pensar; tags: philosophy, mindset; priority: 10}

Entiendo el sistema antes de diseñar la pantalla.

Primero intento entender cómo funciona el proceso hoy, dónde se rompe y qué necesitan realmente las personas.

Pienso en sistemas: cada pantalla forma parte de algo más grande, con reglas, estados y dependencias.

Y para mí diseño e ingeniería son una misma conversación: las mejores decisiones consideran a la vez a las personas y la realidad técnica del producto.

---

## ¿Cómo diseño? {intent: design_process; aliases: como diseñas, cómo diseñas, proceso, workflow, metodologia, metodología, forma de trabajar; tags: process, ux, ui; priority: 10}

No sigo una metodología fija; cada proyecto necesita su propio proceso.

Empiezo por entender cómo funciona el proceso real y dónde aparece la fricción. A veces eso significa observar, a veces operar el sistema yo mismo (en Baseball Scoreboard yo era el operador del marcador) y a veces entiendo el problema mientras prototipo.

Cada decisión la intento conectar con un problema observado: problema, hallazgo, decisión y por qué.

Valido en uso real: con usuarios reales, en el contexto real y con hardware real.

---

## ¿Qué valoro? {intent: philosophy; aliases: filosofia, filosofía, principios, valores; tags: philosophy; priority: 9}

Creo que los estándares son importantes, porque aportan claridad y consistencia.

Pero también creo que muchos productos terminan sintiéndose iguales. Cada producto debería desarrollar una forma propia de relacionarse con quienes lo usan, cuando esa diferencia aporta valor.

Me interesa comprender por qué una solución funciona, no seguir tendencias.

---

## Ingeniería de Software {intent: engineering; aliases: ingenieria, ingeniería, universidad, estudios, educación, educacion, software, apec; tags: engineering, education; priority: 9}

Estudié Ingeniería de Software en la Universidad APEC.

Esa formación cambió cómo diseño: aprendí a pensar en requisitos, arquitectura, restricciones técnicas y escalabilidad.

Por eso una interfaz nunca es solo una pantalla: también es un conjunto de estados, reglas, dependencias y casos límite que alguien tendrá que construir y mantener.

---

## Habilidades {intent: skills; aliases: habilidades, stack, tecnologias, tecnologías, herramientas, conocimientos, capacidades; tags: skills; priority: 8}

Priorizo capacidades sobre herramientas.

### Diseño {tags: design}

- Product Design
- Diseño de interacción
- UX/UI
- Prototipado
- Accesibilidad (WCAG 2.1 AA)

Herramientas: Figma, Figma Make, Affinity.

### Investigación {tags: research}

- Observación en contexto
- Análisis de dominio y reglas
- Análisis de productos existentes
- Validación en uso real

### Sistemas {tags: systems}

- Sistemas de diseño
- Arquitectura de información
- Estados y flujos
- Prevención de errores

Referencia: Fluent Design System.

### Ingeniería {tags: frontend, engineering}

- HTML/CSS
- JavaScript / TypeScript
- React
- Python
- Git

En proyectos también he usado Vite y Tauri (Rust).

---

## ¿Qué me inspira? {intent: inspiration; aliases: inspiracion, inspiración, referencias, influencias, windows, fluent; tags: inspiration; priority: 8}

Me inspiran especialmente los sistemas operativos.

Disfruto analizando Windows, Fluent Design, iOS, iPadOS, Microsoft Office, Notion, Feedly y DoorDash.

No porque quiera copiar su apariencia: me interesa entender cómo organizan la información, cómo construyen identidad y cómo resuelven problemas de interacción.

---

## Proyectos {intent: projects; aliases: proyectos, portafolio, portfolio, casos, trabajos, case studies, casos de estudio; tags: projects; priority: 8}

Mis dos casos de estudio principales son productos en uso real que diseñé y construí de punta a punta:

- Baseball Scoreboard: marcador en vivo y proyección para un torneo comunitario de Béisbol Bíblico.
- Kerygma Stage: software de proyección para cultos en vivo, usado cada semana en una iglesia.

Cada caso muestra el contexto, la investigación, las decisiones de diseño, la iteración, los resultados (separando uso, resultados medidos y esperados) y lo que aprendí.

### Baseball Scoreboard {intent: baseball_scoreboard; aliases: baseball, beisbol, béisbol, marcador, scoreboard; tags: realtime, sports, offline; priority: 10}

Marcador en vivo y pantalla de proyección para el torneo comunitario de Béisbol Bíblico del Ministerio Cristiano HOME.

El problema: un solo voluntario registraba cada jugada a mano en pizarras y PowerPoint mientras el partido seguía, y cualquier error quedaba proyectado frente a todos. Ese voluntario era yo.

Mi rol: Product Designer y desarrollador frontend, de punta a punta (React, TypeScript, Vite).

---

### Baseball Scoreboard: decisiones de diseño {intent: baseball_decisions; aliases: decisiones baseball, decisiones del marcador; tags: baseball, decisions; priority: 8}

Cuatro decisiones principales, cada una conectada con un problema observado:

1. Acciones frecuentes a un solo clic, porque out, carrera y cambio de turno se repiten decenas de veces por partido.
2. Una proyección diseñada aparte, no un espejo de la consola: el público necesita leer el marcador a distancia y el operador necesita controles.
3. Prevenir y recuperar: acciones destructivas separadas, confirmación para lo irreversible, historial de jugadas y deshacer la última jugada.
4. Funcionar sin internet: consola y proyección se sincronizan en el navegador, sin servidor.

---

### Baseball Scoreboard: resultados {intent: baseball_results; aliases: resultados baseball, impacto baseball, metricas baseball, métricas; tags: baseball, results; priority: 8}

Uso: 10–15 partidos operados con el sistema, 6 equipos y entre 25 y 50 espectadores presenciales por jornada. Se usó durante todo el torneo.

El uso real reveló reglas que no estaban contempladas y se incorporaron después.

No medí tasas de error ni tiempos antes y después, así que no reporto mejoras cuantitativas. Menos errores visibles y menor carga para el operador son la intención del diseño, no resultados medidos.

---

### Kerygma Stage {intent: kerygma_stage; aliases: kerygma, proyeccion, proyección, iglesia, culto; tags: realtime, church, offline, rust; priority: 10}

Software de escritorio para proyectar letras, versículos y anuncios durante un culto en vivo. Lo usa semanalmente la Iglesia Hogar de Salvación y Alabanza.

El problema: en herramientas genéricas como PowerPoint o Google Slides, preparar es exponer. Corregir, buscar un versículo o improvisar ocurre a la vista de toda la congregación.

Mi rol: Product Designer y desarrollador full-stack, de punta a punta: interfaz en React sobre un backend en Rust (Tauri).

---

### Kerygma Stage: decisiones de diseño {intent: kerygma_decisions; aliases: decisiones kerygma, vista previa, en vivo, offline first, sugerir; tags: kerygma, decisions; priority: 8}

Tres decisiones pesan más que todas las funciones:

1. Vista previa vs. en vivo: el operador prepara y revisa en la vista previa; nada llega a la proyección hasta que lo confirma, incluso al editar en vivo.
2. Sugerir vs. automatizar: cuando el sistema detecta un versículo en lo que se dice, lo sugiere al operador; la proyección no cambia hasta que él lo confirma.
3. Offline-first: todo funciona sin conexión; subtítulos y detección de versículos corren en el dispositivo y el audio nunca sale del edificio.

Otras funciones: búsqueda bíblica, Ctrl+K, editor, multi-monitor, control remoto desde el celular y pantalla de confidencia.

---

### Kerygma Stage: resultados {intent: kerygma_results; aliases: resultados kerygma, impacto kerygma; tags: kerygma, results; priority: 8}

Uso: semanal, en los cultos de la Iglesia Hogar de Salvación y Alabanza, sirviendo a tres audiencias con la misma app: operador, escenario y congregación.

Las pruebas en cultos reales revelaron problemas que los tests no detectaban (permisos de micrófono, cortes de audio, números hablados) y se corrigieron.

Todavía no hay métricas formales de antes y después; lo demás son resultados esperados, no medidos.

---

### Lo que aprendí {intent: learnings; aliases: aprendizajes, que aprendiste, qué aprendiste, lecciones, que harias diferente, qué harías diferente; tags: learnings; priority: 7}

Entender el dominio antes de diseñar: sin trabajo de campo, cualquier interfaz habría resuelto el problema equivocado.

Diseñar contra la presión real, no contra un escenario ideal.

Lo que haría diferente: definir desde el inicio cómo medir, por ejemplo registrar errores y correcciones antes de reemplazar un proceso, para hablar de impacto con datos.

---

### Exploraciones conceptuales {intent: concept_projects; aliases: jobs hunter, pulse, hidrocity, nexo, conceptos; tags: concepts; priority: 6}

También he trabajado en proyectos conceptuales como Jobs Hunter, Pulse, HidroCity y Nexo. No están publicados como casos de estudio porque todavía no tienen suficiente proceso documentado para presentarlos con evidencia.

---

## ¿Cómo uso la IA? {intent: ai_workflow; aliases: ia, inteligencia artificial, ai, chatgpt, claude, copiloto; tags: ai, process; priority: 9}

Uso IA como copiloto de diseño e ingeniería para explorar ideas, analizar información, cuestionar supuestos y acelerar la implementación.

Las decisiones de producto, la dirección de diseño, la validación y el criterio final son míos.

En Baseball Scoreboard la usé para explorar alternativas de interfaz y casos límite, y como copiloto de código. En Kerygma Stage, como copiloto de código. En ambos revisé, adapté y probé todo en uso real.

---

## ¿Qué tipo de productos disfruto? {intent: interests; aliases: que productos te gustan, productos favoritos, intereses; tags: interests; priority: 8}

Me interesan especialmente:

- Sistemas operativos.
- Herramientas de productividad.
- Dashboards.
- Software empresarial.
- Productos que se usan bajo presión o en tiempo real.
- Interfaces donde la interacción tenga un papel importante.

Si tuviera recursos ilimitados dedicaría varios años a diseñar un sistema operativo: es el producto digital que conecta prácticamente todas las experiencias que vivimos con la tecnología.

---

## FAQ {intent: faq; aliases: faq, preguntas frecuentes, dudas, preguntas; tags: faq; priority: 10}

Algunas preguntas que suelen aparecer:

¿Quién eres? Soy Gregory Durán, Product Designer con formación en Ingeniería de Software.

¿Qué haces? Diseño productos digitales entendiendo tanto la experiencia como el sistema que la hace posible.

¿Eres diseñador o desarrollador? Soy Product Designer. Mi formación en Ingeniería de Software me permite diseñar entendiendo cómo se construye el producto, y en mis dos casos de estudio también lo implementé.

¿Qué proyecto te representa mejor? Baseball Scoreboard y Kerygma Stage: productos en uso real donde las restricciones técnicas definieron muchas decisiones de experiencia.

¿Tienes métricas de impacto? Reporto datos de uso reales (por ejemplo, 10–15 partidos en Baseball Scoreboard y uso semanal en Kerygma Stage). No medí formalmente errores ni tiempos antes y después, así que no presento mejoras cuantitativas.

¿Cómo haces investigación? Con observación en contexto, análisis del dominio y de productos existentes, y validación en uso real. En Baseball Scoreboard fui el operador; en Kerygma Stage partí de los problemas que reportan los operadores de proyección.

¿Qué herramientas utilizas? Figma, Figma Make y Affinity para diseño; HTML/CSS, JavaScript, TypeScript, React, Python y Git como contexto técnico. Las herramientas son secundarias frente al criterio.

¿Usas IA? Sí, como copiloto para explorar, cuestionar supuestos y acelerar la implementación. Las decisiones y la validación son mías.

¿Cómo trabajas con desarrolladores? Intento comprender las restricciones técnicas desde el principio y mantener conversaciones constantes para que diseño y desarrollo evolucionen juntos.

¿Cómo recibes el feedback? Escucho primero. Me interesa entender el razonamiento detrás de cada comentario antes de decidir si una solución debe cambiar o mantenerse.

¿Qué buscas actualmente? Roles remotos de tiempo completo en Product Design, donde pueda participar en la evolución del producto, no únicamente en el diseño de pantallas.

¿En qué idiomas puedes trabajar? Español e inglés.

¿Cómo puedo contactarte? Puedes escribirme a: gregorymduran01@outlook.com

---

## Contacto {intent: contact; aliases: contacto, contactar, correo, email, trabajar, contratar, disponibilidad, disponible, cv, linkedin; tags: contact; priority: 10}

Estoy abierto a oportunidades remotas de tiempo completo en Product Design. Respondo en español e inglés.

Correo: gregorymduran01@outlook.com

También estoy en LinkedIn (linkedin.com/in/gregmduran), GitHub (github.com/gregorymduran) y Behance (behance.net/gregmduran). Mi CV está disponible en la sección de contacto.
