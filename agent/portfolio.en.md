# Gregory Durán {tags: intro, identity, product, technology}

Product Designer with a Software Engineering background.

I design digital products with an understanding of both the experience and the system that makes it possible: flows, states, rules, and error prevention for people who work under pressure.

I'm fascinated by the space where software meets everyday life.

---

## Who am I? {intent: identity; aliases: who are you, who're you, about you, introduce yourself, tell me about yourself, gregory; tags: identity, intro; priority: 10}

I'm Gregory Durán, a Product Designer with a Software Engineering background, based in the Dominican Republic.

I've always loved technology. Before I learned design, I spent hours looking at futuristic Windows concepts, imagining how operating systems and the way people interact with computers might change.

Over time I realized I wanted to help build those products. That's why I studied Software Engineering at Universidad APEC and ended up specializing in product design.

---

## What do I do? {intent: what_i_do; aliases: what do you do, what's your role, your role, value, what value do you bring; tags: identity, product; priority: 10}

I design clear digital products, interaction systems, and experiences that hold up under real technical and real-world constraints.

My edge is understanding how what I design gets built. That lets me treat technical constraints as part of the design, not something discovered at the end.

My two main case studies, Baseball Scoreboard and Kerygma Stage, are products in real use that I designed and built end to end.

---

## How do I think? {intent: mindset; aliases: how do you think, your mindset, your philosophy, your criteria, how you think; tags: philosophy, mindset; priority: 10}

I understand the system before I design the screen.

I start by understanding how the process works today, where it breaks, and what people actually need.

I think in systems: every screen is part of something bigger, with its own rules, states, and dependencies.

And for me, design and engineering are one conversation: the best decisions account for people and for the technical reality of the product at the same time.

---

## How do I design? {intent: design_process; aliases: how do you design, your process, your workflow, your methodology, how you work; tags: process, ux, ui; priority: 10}

I don't follow a fixed methodology; every project needs its own process.

I start by understanding how the real process works and where the friction is. Sometimes that means observing, sometimes running the system myself (on Baseball Scoreboard I was the scoreboard operator), and sometimes I only understand the problem once I'm prototyping.

I try to tie every decision to an observed problem: problem, insight, decision, and why.

I validate in real use: with real users, in the real context, on real hardware.

---

## What do I value? {intent: philosophy; aliases: your values, your principles, what you value; tags: philosophy; priority: 9}

I think standards matter because they bring clarity and consistency.

But many products end up feeling the same. Every product should develop its own way of relating to the people who use it, when that difference adds value.

I care about understanding why a solution works, not about following trends.

---

## Software Engineering {intent: engineering; aliases: engineering, university, studies, education, software engineering, apec; tags: engineering, education; priority: 9}

I studied Software Engineering at Universidad APEC.

That background changed how I design: I learned to think about requirements, architecture, technical constraints, and scalability.

That's why an interface is never just a screen: it's also a set of states, rules, dependencies, and edge cases that someone will have to build and maintain.

---

## Skills {intent: skills; aliases: skills, stack, technologies, tools, what do you know, capabilities; tags: skills; priority: 8}

I put capabilities ahead of tools.

### Design {tags: design}

- Product Design
- Interaction Design
- UX/UI
- Prototyping
- Accessibility (WCAG 2.1 AA)

Tools: Figma, Figma Make, Affinity.

### Research {tags: research}

- Contextual observation
- Domain and rules analysis
- Competitive product analysis
- Validation in real use

### Systems {tags: systems}

- Design systems
- Information architecture
- States and flows
- Error prevention

Reference: Fluent Design System.

### Engineering {tags: frontend, engineering}

- HTML/CSS
- JavaScript / TypeScript
- React
- Python
- Git

I've also used Vite and Tauri (Rust) in projects.

---

## What inspires me? {intent: inspiration; aliases: inspiration, references, influences, windows, fluent; tags: inspiration; priority: 8}

Operating systems inspire me the most.

I enjoy analyzing Windows, Fluent Design, iOS, iPadOS, Microsoft Office, Notion, Feedly, and DoorDash.

Not to copy how they look: I want to understand how they organize information, build identity, and solve interaction problems.

---

## Projects {intent: projects; aliases: projects, portfolio, cases, work, case studies; tags: projects; priority: 8}

My two main case studies are products in real use that I designed and built end to end:

- Baseball Scoreboard: a live scoreboard and projection screen for a community Bible Baseball tournament.
- Kerygma Stage: presentation software for live church services, used every week at a church.

Each case covers the context, research, design decisions, iteration, results (separating usage, measured, and expected outcomes), and what I learned.

### Baseball Scoreboard {intent: baseball_scoreboard; aliases: baseball, scoreboard, bible baseball; tags: realtime, sports, offline; priority: 10}

A live scoreboard and projection screen for the community Bible Baseball tournament run by Ministerio Cristiano HOME.

The problem: a single volunteer logged every play by hand on whiteboards and PowerPoint while the game kept going, and any mistake was projected in front of everyone. That volunteer was me.

My role: Product Designer and front-end developer, end to end (React, TypeScript, Vite).

---

### Baseball Scoreboard: design decisions {intent: baseball_decisions; aliases: baseball decisions, scoreboard decisions; tags: baseball, decisions; priority: 8}

Four main decisions, each tied to an observed problem:

1. One click for frequent actions, because outs, runs, and inning changes repeat dozens of times per game.
2. A projection designed on its own, not a mirror of the console: the audience needs to read the score from a distance, the operator needs controls.
3. Prevent and recover: destructive actions kept apart, confirmation for anything irreversible, a play history, and undo for the last play.
4. Work without internet: the console and the projection sync inside the browser, with no server.

---

### Baseball Scoreboard: results {intent: baseball_results; aliases: baseball results, baseball impact, baseball metrics, metrics; tags: baseball, results; priority: 8}

Usage: 10–15 games run on the system, 6 teams, and 25–50 in-person spectators per game day. It was used throughout the tournament.

Real use surfaced rules that hadn't been accounted for, and they were added later.

I didn't measure error rates or timings before and after, so I don't report quantitative improvements. Fewer visible mistakes and a lighter load for the operator are the design intent, not measured results.

---

### Kerygma Stage {intent: kerygma_stage; aliases: kerygma, presentation software, church, service; tags: realtime, church, offline, rust; priority: 10}

Desktop software for projecting lyrics, verses, and announcements during a live church service. Iglesia Hogar de Salvación y Alabanza uses it every week.

The problem: in general-purpose tools like PowerPoint or Google Slides, preparing means exposing. Fixing a typo, finding a verse, or improvising all happens in front of the whole congregation.

My role: Product Designer and full-stack developer, end to end: a React interface on a Rust back end (Tauri).

---

### Kerygma Stage: design decisions {intent: kerygma_decisions; aliases: kerygma decisions, preview, live, offline first, suggest; tags: kerygma, decisions; priority: 8}

Three decisions matter more than every feature combined:

1. Preview vs. live: the operator prepares and reviews in the preview; nothing reaches the projection until they confirm it, even when editing live.
2. Suggest vs. automate: when the system detects a verse in what's being said, it suggests it to the operator; the projection doesn't change until they confirm.
3. Offline-first: everything works with no connection; captions and verse detection run on the device and the audio never leaves the building.

Other features: Bible search, Ctrl+K, editor, multi-monitor, phone remote control, and a confidence monitor.

---

### Kerygma Stage: results {intent: kerygma_results; aliases: kerygma results, kerygma impact; tags: kerygma, results; priority: 8}

Usage: weekly, in services at Iglesia Hogar de Salvación y Alabanza, serving three audiences with the same app: operator, stage, and congregation.

Testing in real services surfaced problems the tests didn't catch (microphone permissions, audio dropouts, spoken numbers), and they were fixed.

There are no formal before-and-after metrics yet; the rest are expected outcomes, not measured ones.

---

### What I learned {intent: learnings; aliases: learnings, what did you learn, lessons, what would you do differently; tags: learnings; priority: 7}

Understand the domain before designing: without fieldwork, any interface would have solved the wrong problem.

Design against real pressure, not an ideal scenario.

What I'd do differently: define how to measure from the start, for example by logging mistakes and corrections before replacing a process, so I can talk about impact with data.

---

### Concept work {intent: concept_projects; aliases: jobs hunter, pulse, hidrocity, nexo, concepts; tags: concepts; priority: 6}

I've also worked on concept projects such as Jobs Hunter, Pulse, HidroCity, and Nexo. They aren't published as case studies because they don't yet have enough documented process to present with evidence.

---

## How do I use AI? {intent: ai_workflow; aliases: ai, artificial intelligence, chatgpt, claude, copilot; tags: ai, process; priority: 9}

I use AI as a design and engineering copilot to explore ideas, analyze information, challenge assumptions, and speed up implementation.

Product decisions, design direction, validation, and final judgment are mine.

On Baseball Scoreboard I used it to explore interface alternatives and edge cases, and as a coding copilot. On Kerygma Stage, as a coding copilot. In both cases I reviewed, adapted, and tested everything in real use.

---

## What kind of products do I enjoy? {intent: interests; aliases: what products do you like, favorite products, your interests; tags: interests; priority: 8}

I'm especially interested in:

- Operating systems.
- Productivity tools.
- Dashboards.
- Enterprise software.
- Products used under pressure or in real time.
- Interfaces where interaction plays an important role.

With unlimited resources, I'd spend years designing an operating system: it's the digital product that connects nearly every experience we have with technology.

---

## FAQ {intent: faq; aliases: faq, frequently asked questions, questions; tags: faq; priority: 10}

Some questions that come up often:

Who are you? I'm Gregory Durán, a Product Designer with a Software Engineering background.

What do you do? I design digital products with an understanding of both the experience and the system that makes it possible.

Are you a designer or a developer? I'm a Product Designer. My Software Engineering background lets me design with an understanding of how the product gets built, and I also implemented both of my case studies.

Which project best represents you? Baseball Scoreboard and Kerygma Stage: products in real use where technical constraints shaped many of the experience decisions.

Do you have impact metrics? I report real usage data (for example, 10–15 games on Baseball Scoreboard and weekly use of Kerygma Stage). I didn't formally measure errors or timings before and after, so I don't present quantitative improvements.

How do you do research? Through contextual observation, domain and competitive analysis, and validation in real use. On Baseball Scoreboard I was the operator; on Kerygma Stage I started from problems reported by presentation operators.

What tools do you use? Figma, Figma Make, and Affinity for design; HTML/CSS, JavaScript, TypeScript, React, Python, and Git as technical context. Tools come second to judgment.

Do you use AI? Yes, as a copilot to explore, challenge assumptions, and speed up implementation. The decisions and the validation are mine.

How do you work with developers? I try to understand technical constraints from the start and keep an ongoing conversation so design and development evolve together.

How do you take feedback? I listen first. I want to understand the reasoning behind each comment before deciding whether a solution should change or stay.

What are you looking for right now? Full-time remote Product Design roles where I can take part in how the product evolves, not just in designing screens.

Which languages do you work in? Spanish and English.

How can I contact you? Email me at: gregorymduran01@outlook.com

---

## Contact {intent: contact; aliases: contact, get in touch, email, hire, work together, availability, available, cv, resume, linkedin; tags: contact; priority: 10}

I'm open to full-time remote Product Design opportunities. I work in Spanish and English.

Email: gregorymduran01@outlook.com

You can also find me on LinkedIn (linkedin.com/in/gregmduran), GitHub (github.com/gregorymduran), and Behance (behance.net/gregmduran). My CV is available in the contact section.
