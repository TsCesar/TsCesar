/* ============================================================
 * César Méndez Castro — Portfolio
 * Vanilla JS, no build step, no dependencies.
 *
 * Organised as small internal modules inside one IIFE so the file
 * can still be opened straight from disk (file://) without a server.
 * ============================================================ */
(() => {
  "use strict";

  /* ══════════════════════════════════════════════════════════
   * 0 · UTILITIES
   * ══════════════════════════════════════════════════════════ */

  const $  = (sel, scope = document) => scope.querySelector(sel);
  const $$ = (sel, scope = document) => Array.prototype.slice.call(scope.querySelectorAll(sel));

  const mqReduced = window.matchMedia("(prefers-reduced-motion: reduce)");
  const mqCoarse  = window.matchMedia("(hover: none), (pointer: coarse)");

  const reduced   = () => mqReduced.matches;
  const canHover  = () => !mqCoarse.matches;

  /** Collapse bursts of events into one write per animation frame. */
  const rafThrottle = (fn) => {
    let queued = false;
    let lastArgs = null;
    return (...args) => {
      lastArgs = args;
      if (queued) return;
      queued = true;
      requestAnimationFrame(() => {
        queued = false;
        fn.apply(null, lastArgs);
      });
    };
  };

  const clamp = (v, min, max) => Math.min(Math.max(v, min), max);

  const escapeHtml = (str) => String(str).replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  })[c]);


  /* ══════════════════════════════════════════════════════════
   * 1 · DATA
   *
   * Every entry below is drawn from information supplied by
   * César. Nothing here is inferred, rated or invented.
   * ══════════════════════════════════════════════════════════ */

  const DEVICON = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/";
  const icon = (path) => DEVICON + path;

  /* Confirmed stack. cat = one or more filter groups. */
  /* Confirmed stack.
     `cat`  = one of the seven groups rendered below the core block.
     `core` = shown in the highlighted Core Stack row as well. */
  const TECH = [
    /* ── Languages & Web ── */
    { name: "Java",           cat: "web",    core: true, accent: "#ED8B00", icon: icon("java/java-original.svg"),             role: { en: "Programming language",         es: "Lenguaje de programación" } },
    { name: "Kotlin",         cat: "web",    core: true, accent: "#7F52FF", icon: icon("kotlin/kotlin-original.svg"),         role: { en: "JVM · Android",                es: "JVM · Android" } },
    { name: "Python",         cat: "web",    core: true, accent: "#3776AB", icon: icon("python/python-original.svg"),         role: { en: "Programming · Networking",     es: "Programación · Redes" } },
    { name: "JavaScript",     cat: "web",    accent: "#F7DF1E", icon: icon("javascript/javascript-original.svg"),             role: { en: "Web development",              es: "Desarrollo web" } },
    { name: "TypeScript",     cat: "web",    accent: "#3178C6", icon: icon("typescript/typescript-original.svg"),             role: { en: "Typed JavaScript",             es: "JavaScript tipado" } },
    { name: "HTML5",          cat: "web",    accent: "#E34F26", icon: icon("html5/html5-original.svg"),                       role: { en: "Semantic markup",              es: "Marcado semántico" } },
    { name: "CSS3",           cat: "web",    accent: "#1572B6", icon: icon("css3/css3-original.svg"),                         role: { en: "Responsive styling",           es: "Estilos responsive" } },
    { name: "JSON",           cat: "web",    accent: "#F8FAFC", fallback: "{ }",                                              role: { en: "Data interchange",             es: "Intercambio de datos" } },
    { name: "XML",            cat: "web",    accent: "#F97316", icon: icon("xml/xml-original.svg"), fallback: "XML",          role: { en: "Structured data",              es: "Datos estructurados" } },
    { name: "XHTML",          cat: "web",    accent: "#2563EB", fallback: "XH",                                               role: { en: "Web markup",                   es: "Marcado web" } },

    /* ── Backend & Data ── */
    { name: "SQL",            cat: "data",   core: true, accent: "#38BDF8", fallback: "SQL",                                  role: { en: "Queries & data definition",    es: "Consultas y definición de datos" } },
    { name: "Spring Boot",    cat: "data",   core: true, accent: "#6DB33F", icon: icon("spring/spring-original.svg"),         role: { en: "Java backend framework",       es: "Framework backend Java" } },
    { name: "MySQL",          cat: "data",   core: true, accent: "#4479A1", icon: icon("mysql/mysql-original.svg"),           role: { en: "Relational database",          es: "Base de datos relacional" } },
    { name: "Hibernate",      cat: "data",   accent: "#BCA37F", icon: icon("hibernate/hibernate-original.svg"), fallback: "Hb", role: { en: "ORM · Persistence",          es: "ORM · Persistencia" } },
    { name: "JDBC",           cat: "data",   accent: "#F59E0B", fallback: "JD",                                               role: { en: "Java database access",         es: "Acceso Java a BBDD" } },
    { name: "REST APIs",      cat: "data",   accent: "#14B8A6", fallback: "API",                                              role: { en: "API architecture",             es: "Arquitectura de APIs" } },
    { name: "SQLite",         cat: "data",   accent: "#0F80CC", icon: icon("sqlite/sqlite-original.svg"),                     role: { en: "Embedded SQL database",        es: "Base SQL embebida" } },
    { name: "JUnit 5",        cat: "data",   accent: "#25A162", icon: icon("junit/junit-original.svg"), fallback: "J5",       role: { en: "Unit testing",                 es: "Testing unitario" } },
    { name: "phpMyAdmin",     cat: "data",   accent: "#F59E0B", fallback: "pMA",                                              role: { en: "Database administration",      es: "Administración de BBDD" } },
    { name: "XAMPP",          cat: "data",   accent: "#FB7A24", fallback: "X",                                                role: { en: "Local development stack",      es: "Entorno local de desarrollo" } },

    /* ── Mobile ── */
    { name: "Android SDK",    cat: "mobile", accent: "#3DDC84", icon: icon("android/android-original.svg"),                   role: { en: "Android development",          es: "Desarrollo Android" } },
    { name: "Android Studio", cat: "mobile", accent: "#3DDC84", icon: icon("androidstudio/androidstudio-original.svg"),       role: { en: "Android IDE",                  es: "IDE Android" } },

    /* ── DevOps & Tooling ── */
    { name: "Docker",         cat: "devops", core: true, accent: "#2496ED", icon: icon("docker/docker-original.svg"),         role: { en: "Containers",                   es: "Contenedores" } },
    { name: "Git",            cat: "devops", core: true, accent: "#F05032", icon: icon("git/git-original.svg"),               role: { en: "Version control",              es: "Control de versiones" } },
    { name: "GitHub",         cat: "devops", accent: "#E5E7EB", icon: icon("github/github-original.svg"),                     role: { en: "Repositories & collaboration", es: "Repositorios y colaboración" } },
    { name: "GitHub Actions", cat: "devops", accent: "#2088FF", icon: icon("githubactions/githubactions-original.svg"), fallback: "GA", role: { en: "CI/CD automation",     es: "Automatización CI/CD" } },
    { name: "Gradle",         cat: "devops", accent: "#1B9AAA", icon: icon("gradle/gradle-original.svg"),                     role: { en: "Build automation",             es: "Automatización de build" } },
    { name: "Maven",          cat: "devops", accent: "#C71A36", icon: icon("maven/maven-original.svg"),                       role: { en: "Java build & dependencies",    es: "Build y dependencias Java" } },
    { name: "PowerShell",     cat: "devops", accent: "#5391FE", icon: icon("powershell/powershell-original.svg"), fallback: "PS", role: { en: "Automation & scripting",    es: "Automatización y scripting" } },
    { name: "Linux",          cat: "devops", accent: "#FCC624", icon: icon("linux/linux-original.svg"),                       role: { en: "Operating system",             es: "Sistema operativo" } },
    { name: "Windows",        cat: "devops", accent: "#0078D6", icon: icon("windows11/windows11-original.svg"),               role: { en: "Operating system",             es: "Sistema operativo" } },
    { name: "IntelliJ IDEA",  cat: "devops", accent: "#EC4899", icon: icon("intellij/intellij-original.svg"),                 role: { en: "Java / Kotlin IDE",            es: "IDE Java / Kotlin" } },
    { name: "VS Code",        cat: "devops", accent: "#007ACC", icon: icon("vscode/vscode-original.svg"),                     role: { en: "Code editor",                  es: "Editor de código" } },
    { name: "Eclipse",        cat: "devops", accent: "#8B7FD4", icon: icon("eclipse/eclipse-original.svg"),                   role: { en: "Java IDE",                     es: "IDE Java" } },
    { name: "NetBeans",       cat: "devops", accent: "#1B6AC6", fallback: "NB",                                               role: { en: "Java IDE",                     es: "IDE Java" } },
    { name: "PyCharm",        cat: "devops", accent: "#21D789", icon: icon("pycharm/pycharm-original.svg"),                   role: { en: "Python IDE",                   es: "IDE Python" } },
    { name: "draw.io",        cat: "devops", accent: "#F08705", fallback: "dio",                                              role: { en: "ER & UML diagrams",            es: "Diagramas E/R y UML" } },

    /* ── Game Development ── */
    { name: "Unreal Engine 5", cat: "game",  accent: "#C4B5FD", icon: icon("unrealengine/unrealengine-original.svg"),         role: { en: "Game development",             es: "Desarrollo de videojuegos" } },
    { name: "Blueprints",      cat: "game",  accent: "#0EA5E9", fallback: "BP",                                               role: { en: "Visual scripting",             es: "Scripting visual" } },

    /* ── Blockchain ── */
    { name: "Solidity",        cat: "chain", accent: "#A1A1AA", icon: icon("solidity/solidity-original.svg"),                 role: { en: "Smart contracts",              es: "Smart contracts" } },
    { name: "Smart Contracts", cat: "chain", accent: "#8B5CF6", fallback: "SC",                                               role: { en: "Blockchain development",       es: "Desarrollo blockchain" } },

    /* ── Legacy / Data ── */
    { name: "XBase",           cat: "legacy", accent: "#0891B2", fallback: "XB",                                              role: { en: "Legacy data & programming",    es: "Datos y programación legacy" } },
    { name: "FoxPro",          cat: "legacy", accent: "#7C3AED", fallback: "FP",                                              role: { en: "Legacy applications",          es: "Aplicaciones legacy" } },
    { name: "Clipper",         cat: "legacy", accent: "#64748B", fallback: "CL",                                              role: { en: "Legacy xBase environment",     es: "Entorno xBase legacy" } },
    { name: "DBF",             cat: "legacy", accent: "#0F766E", fallback: "DBF",                                             role: { en: "Legacy data files",            es: "Ficheros de datos legacy" } }
  ];

  /* Order of the groups rendered under the core block. */
  const TECH_GROUPS = ["web", "data", "mobile", "devops", "game", "chain", "legacy"];

  /* Introductory exposure only — deliberately kept separate. */
  const LEARNING = [
    { name: "React",     accent: "#61DAFB", icon: icon("react/react-original.svg"),
      en: "Introductory knowledge of component-based interfaces, state and modern SPA concepts.",
      es: "Conocimientos introductorios de interfaces por componentes, estado y conceptos de SPA modernas." },
    { name: "Angular",   accent: "#DD0031", icon: icon("angularjs/angularjs-original.svg"),
      en: "Basic exposure to TypeScript component architecture, services and routing concepts.",
      es: "Contacto básico con arquitectura de componentes en TypeScript, servicios y conceptos de routing." },
    { name: "Vue.js",    accent: "#42B883", icon: icon("vuejs/vuejs-original.svg"),
      en: "Introductory familiarity with reactive components and template-driven interfaces.",
      es: "Familiaridad introductoria con componentes reactivos e interfaces basadas en plantillas." },
    { name: "Astro",     accent: "#BC52EE", icon: icon("astro/astro-original.svg"),
      en: "Basic exposure to static-first web development and component composition.",
      es: "Contacto básico con desarrollo web static-first y composición de componentes." },
    { name: "Node.js",   accent: "#5FA04E", icon: icon("nodejs/nodejs-original.svg"),
      en: "Introductory knowledge of server-side JavaScript, npm and backend fundamentals.",
      es: "Conocimientos introductorios de JavaScript en servidor, npm y fundamentos de backend." },
    { name: "Django",    accent: "#44B78B", icon: icon("django/django-plain.svg"),
      en: "Basic familiarity with the Python web framework and how its projects are structured.",
      es: "Familiaridad básica con el framework web de Python y la estructura de sus proyectos." },
    { name: "Rust",      accent: "#F97316", icon: icon("rust/rust-original.svg"),
      en: "Introductory exposure to the language, its syntax and core systems-programming ideas.",
      es: "Contacto introductorio con el lenguaje, su sintaxis y conceptos básicos de programación de sistemas." },
    { name: "WordPress", accent: "#21759B", icon: icon("wordpress/wordpress-plain.svg"),
      en: "Basic knowledge of CMS workflows, content management and the WordPress ecosystem.",
      es: "Conocimientos básicos de flujos CMS, gestión de contenido y ecosistema WordPress." },
    { name: "Streamlit", accent: "#FF4B4B", icon: "https://cdn.simpleicons.org/streamlit/FF4B4B",
      en: "Basic experience building quick Python interfaces for scripts and data-oriented prototypes.",
      es: "Experiencia básica creando interfaces rápidas en Python para scripts y prototipos orientados a datos." }
  ];

  const ROLE_LINES = {
    en: [
      "Junior Software Developer",
      "Java · Kotlin · Backend",
      "SQL · Databases · Enterprise Software",
      "Android · Docker · Testing"
    ],
    es: [
      "Desarrollador de Software Junior",
      "Java · Kotlin · Backend",
      "SQL · Bases de datos · Software empresarial",
      "Android · Docker · Testing"
    ]
  };


  /* ══════════════════════════════════════════════════════════
   * 2 · TRANSLATIONS
   * ══════════════════════════════════════════════════════════ */

  const I18N = {
    en: {
      "a11y.skip": "Skip to main content",
      "a11y.home": "Back to top",
      "a11y.menu": "Open navigation menu",
      "a11y.menuClose": "Close navigation menu",
      "a11y.lang": "Switch language to Spanish",
      "a11y.palette": "Open the command palette",
      "a11y.backTop": "Back to top",

      "nav.about": "About", "nav.stack": "Stack", "nav.experience": "Experience",
      "nav.projects": "Projects", "nav.learning": "Learning", "nav.contact": "Contact",

      "hero.available": "Open to Junior Software Developer opportunities",
      "hero.eyebrow": "Junior Software Developer · León, Spain",
      "hero.hello": "Hi, I'm",
      "hero.name": "César Méndez Castro",
      "hero.roleStatic": "Junior Software Developer specialised in Java, Kotlin and backend development.",
      "hero.description": "Higher Technician in Multiplatform Application Development (DAM) with professional experience supporting enterprise software, working with SQL and DBF/XBase data, and a development focus on Java, Kotlin and backend engineering.",
      "hero.projects": "Explore projects",
      "hero.cv": "Download CV",
      "hero.scroll": "Scroll",
      "hero.factEdu": "Education", "hero.factEduVal": "DAM · Completed",
      "hero.factWork": "Currently",
      "hero.factFocus": "Focus",
      "hero.factLoc": "Based in", "hero.factLocVal": "León, Spain",

      "about.kicker": "About me",
      "about.title": "Software, data and real-world problem solving.",
      "about.p1": "I currently work at Proconsi in application support, diagnosing technical issues, maintaining enterprise software and working directly with SQL and DBF/XBase data.",
      "about.p2": "That experience taught me to understand an existing system before changing it, to validate data carefully, and to work through problems methodically instead of guessing.",
      "about.p3": "My development focus is backend engineering with Java and Kotlin, while I keep building knowledge across Android, web, testing, Docker, game development and blockchain.",
      "about.role1": "Junior Software Developer",
      "about.role2": "Java Developer Junior",
      "about.role3": "Backend Developer Junior",
      "about.role4": "Junior Programmer",
      "about.fact1Title": "DAM completed",
      "about.fact1Text": "Higher Technician in Multiplatform Application Development",
      "about.fact2Text": "Application Support · Enterprise Software",
      "about.fact3Text": "Full Stack Web Development · In progress",
      "about.fact4Title": "Spain · Remote",
      "about.fact4Text": "Open to junior software development opportunities",

      "stack.kicker": "Tech stack",
      "stack.title": "Everything I've worked with, organised by area.",
      "stack.subtitle": "Confirmed technologies only. Anything I'm still exploring lives in its own section further down.",
      "stack.core": "Core stack",
      "stack.coreNote": "The technologies I work with most and would bring to a role from day one.",
      "stack.additional": "Additional technologies & tooling",
      "stack.all": "All",
      "stack.group.web": "Languages & Web",
      "stack.group.data": "Backend & Data",
      "stack.group.mobile": "Mobile",
      "stack.group.devops": "DevOps & Tooling",
      "stack.group.game": "Game Development",
      "stack.group.chain": "Blockchain",
      "stack.group.legacy": "Legacy / Data",
      "stack.concepts": "Software engineering foundations",
      "stack.countAll": "{n} technologies",
      "stack.countFiltered": "{n} of {total} technologies",

      "experience.kicker": "Experience & education",
      "experience.title": "The professional context behind the code.",
      "experience.role": "Application Support · Enterprise Software",
      "experience.b1": "Technical support and diagnosis of incidents on enterprise software.",
      "experience.b2": "Work with SQL and DBF/XBase data: insertions, corrections and validation of records.",
      "experience.b3": "Writing and running SQL scripts and data-maintenance routines.",
      "experience.b4": "Application maintenance and direct support to users and customers.",
      "experience.b5": "Automation and scripting with PowerShell.",
      "experience.b6": "Working around legacy XBase, FoxPro and Clipper environments.",
      "education.dam": "Higher Technician in Multiplatform Application Development (DAM)",
      "education.damText": "Java, databases, Android, networking, concurrent programming, testing, software architecture and application development.",
      "education.fullstack": "Full Stack Web Development",
      "education.fullstackText": "Ongoing training in modern web technologies and software development, alongside my work and my backend focus.",

      "common.present": "Present", "common.current": "Current",
      "common.completed": "Completed", "common.inProgress": "In progress", "common.learning": "Learning",

      "projects.kicker": "Featured projects",
      "projects.title": "Projects that show how I think and build.",
      "projects.tfgContext": "Final degree project (TFG) — DAM",
      "projects.tfg": "Relational MySQL database for a road transport operator, taken from domain analysis and ER modelling through 3NF normalisation, physical design and SQL exploitation with joins and triggers.",
      "projects.pspContext": "Client-server systems · Python",
      "projects.psp": "Secure Python client-server system with TLS 1.2+, MySQL persistence, bcrypt password hashing, token-based sessions, role-based access control, threading, a JSON protocol and CRUD operations.",
      "projects.pongContext": "Game logic practice · Python",
      "projects.pong": "Arcade-style Pong built in Python to practise game loops, collision and input handling, and how to structure a small interactive application.",
      "projects.viewRepo": "View repository",
      "projects.all": "View all repositories",
      "projects.updated": "Updated {d}",

      "learning.kicker": "Currently exploring",
      "learning.title": "Technologies I'm currently exploring.",
      "learning.subtitle": "Deliberately kept apart from my core stack. These are technologies I've had contact with and am still exploring — not ones I'd claim to know well.",
      "learning.level": "Introductory knowledge",

      "focus.kicker": "Current focus",
      "focus.title": "Going deeper, not just wider.",
      "focus.copy": "My goal is to turn a broad technical base into stronger backend engineering skills and finished, well-documented projects.",
      "focus.arch": "Architecture", "focus.archValue": "Clean · Maintainable · Layered",
      "focus.testValue": "JUnit 5 · Better test design",
      "focus.data": "Data", "focus.dataValue": "SQL · Modelling · Normalisation",
      "focus.projects": "Projects", "focus.projectsValue": "Finished · Useful · Documented",

      "contact.kicker": "Let's connect",
      "contact.title": "Looking for a Junior Software Developer?",
      "contact.text": "I'm open to junior software development opportunities in Spain, remote, or international environments. The fastest way to reach me is email.",
      "contact.email": "Send me an email",
      "contact.copyEmail": "Copy email",

      "footer.made": "Built from scratch with HTML, CSS and JavaScript. No frameworks.",

      "palette.title": "Command palette",
      "palette.empty": "No matching command.",
      "palette.placeholder": "Jump to a section or run a command…",
      "palette.section": "Section",
      "palette.action": "Action",
      "palette.link": "Link",
      "palette.cmdCv": "Download CV",
      "palette.cmdCopy": "Copy email address",
      "palette.cmdLang": "Switch to Spanish",
      "palette.cmdGithub": "Open GitHub profile",
      "palette.cmdLinkedin": "Open LinkedIn profile",
      "palette.cmdTop": "Back to top",

      "toast.copied": "Email copied to clipboard",
      "toast.copyFailed": "Couldn't copy — cesarmencas19@gmail.com"
    },

    es: {
      "a11y.skip": "Saltar al contenido principal",
      "a11y.home": "Volver arriba",
      "a11y.menu": "Abrir el menú de navegación",
      "a11y.menuClose": "Cerrar el menú de navegación",
      "a11y.lang": "Cambiar el idioma a inglés",
      "a11y.palette": "Abrir la paleta de comandos",
      "a11y.backTop": "Volver arriba",

      "nav.about": "Sobre mí", "nav.stack": "Tecnologías", "nav.experience": "Experiencia",
      "nav.projects": "Proyectos", "nav.learning": "Aprendiendo", "nav.contact": "Contacto",

      "hero.available": "Abierto a oportunidades como Desarrollador de Software Junior",
      "hero.eyebrow": "Desarrollador de Software Junior · León, España",
      "hero.hello": "Hola, soy",
      "hero.name": "César Méndez Castro",
      "hero.roleStatic": "Desarrollador de Software Junior centrado en Java, Kotlin y desarrollo backend.",
      "hero.description": "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM), con experiencia profesional dando soporte a software empresarial, trabajando con datos SQL y DBF/XBase, y con un enfoque de desarrollo centrado en Java, Kotlin y backend.",
      "hero.projects": "Ver proyectos",
      "hero.cv": "Descargar CV",
      "hero.scroll": "Explorar",
      "hero.factEdu": "Formación", "hero.factEduVal": "DAM · Finalizado",
      "hero.factWork": "Actualmente",
      "hero.factFocus": "Enfoque",
      "hero.factLoc": "Ubicación", "hero.factLocVal": "León, España",

      "about.kicker": "Sobre mí",
      "about.title": "Software, datos y resolución de problemas reales.",
      "about.p1": "Actualmente trabajo en Proconsi en soporte de aplicaciones: diagnostico incidencias técnicas, mantengo software empresarial y trabajo directamente con datos SQL y DBF/XBase.",
      "about.p2": "Esa experiencia me ha enseñado a entender un sistema antes de tocarlo, a validar los datos con cuidado y a abordar los problemas de forma metódica en lugar de a base de suposiciones.",
      "about.p3": "Mi enfoque como desarrollador es el backend con Java y Kotlin, mientras sigo ampliando conocimientos en Android, web, testing, Docker, videojuegos y blockchain.",
      "about.role1": "Desarrollador de Software Junior",
      "about.role2": "Java Developer Junior",
      "about.role3": "Backend Developer Junior",
      "about.role4": "Programador Junior",
      "about.fact1Title": "DAM finalizado",
      "about.fact1Text": "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma",
      "about.fact2Text": "Soporte de Aplicaciones · Software Empresarial",
      "about.fact3Text": "Desarrollo Web Full Stack · En curso",
      "about.fact4Title": "España · Remoto",
      "about.fact4Text": "Abierto a oportunidades de desarrollo de software junior",

      "stack.kicker": "Stack tecnológico",
      "stack.title": "Todo lo que he trabajado, organizado por áreas.",
      "stack.subtitle": "Solo tecnologías confirmadas. Lo que todavía estoy explorando tiene su propia sección más abajo.",
      "stack.core": "Stack principal",
      "stack.coreNote": "Las tecnologías con las que más trabajo y que aportaría desde el primer día.",
      "stack.additional": "Tecnologías y herramientas adicionales",
      "stack.all": "Todo",
      "stack.group.web": "Lenguajes y Web",
      "stack.group.data": "Backend y Datos",
      "stack.group.mobile": "Mobile",
      "stack.group.devops": "DevOps y Herramientas",
      "stack.group.game": "Desarrollo de videojuegos",
      "stack.group.chain": "Blockchain",
      "stack.group.legacy": "Legacy / Datos",
      "stack.concepts": "Fundamentos de ingeniería de software",
      "stack.countAll": "{n} tecnologías",
      "stack.countFiltered": "{n} de {total} tecnologías",

      "experience.kicker": "Experiencia y formación",
      "experience.title": "El contexto profesional detrás del código.",
      "experience.role": "Soporte de Aplicaciones · Software Empresarial",
      "experience.b1": "Soporte técnico y diagnóstico de incidencias sobre software empresarial.",
      "experience.b2": "Trabajo con datos SQL y DBF/XBase: inserciones, correcciones y validación de registros.",
      "experience.b3": "Creación y ejecución de scripts SQL y rutinas de mantenimiento de datos.",
      "experience.b4": "Mantenimiento de aplicaciones y soporte directo a usuarios y clientes.",
      "experience.b5": "Automatización y scripting con PowerShell.",
      "experience.b6": "Trabajo en entornos legacy XBase, FoxPro y Clipper.",
      "education.dam": "Técnico Superior en Desarrollo de Aplicaciones Multiplataforma (DAM)",
      "education.damText": "Java, bases de datos, Android, redes, programación concurrente, testing, arquitectura de software y desarrollo de aplicaciones.",
      "education.fullstack": "Desarrollo Web Full Stack",
      "education.fullstackText": "Formación en curso en tecnologías web modernas y desarrollo de software, compaginada con mi trabajo y mi enfoque backend.",

      "common.present": "Actualidad", "common.current": "Actual",
      "common.completed": "Finalizado", "common.inProgress": "En curso", "common.learning": "Aprendiendo",

      "projects.kicker": "Proyectos destacados",
      "projects.title": "Proyectos que muestran cómo pienso y cómo construyo.",
      "projects.tfgContext": "Trabajo Fin de Grado (TFG) — DAM",
      "projects.tfg": "Base de datos relacional MySQL para una operadora de transporte por carretera, desarrollada desde el análisis del dominio y el modelo E/R hasta la normalización en 3FN, el diseño físico y la explotación SQL con JOINs y triggers.",
      "projects.pspContext": "Sistemas cliente-servidor · Python",
      "projects.psp": "Sistema cliente-servidor seguro en Python con TLS 1.2+, persistencia en MySQL, hashing de contraseñas con bcrypt, sesiones mediante tokens, control de acceso por roles, threading, protocolo JSON y operaciones CRUD.",
      "projects.pongContext": "Práctica de lógica de juego · Python",
      "projects.pong": "Pong estilo arcade desarrollado en Python para practicar el bucle de juego, la detección de colisiones, la gestión de entrada y la estructura de una aplicación interactiva pequeña.",
      "projects.viewRepo": "Ver repositorio",
      "projects.all": "Ver todos los repositorios",
      "projects.updated": "Actualizado {d}",

      "learning.kicker": "Actualmente explorando",
      "learning.title": "Tecnologías que estoy explorando actualmente.",
      "learning.subtitle": "Las mantengo separadas de mi stack principal a propósito. Son tecnologías con las que he tenido contacto y que sigo explorando, no tecnologías que diría dominar.",
      "learning.level": "Conocimiento introductorio",

      "focus.kicker": "En qué estoy centrado",
      "focus.title": "Profundizar, no solo ampliar.",
      "focus.copy": "Mi objetivo es convertir una base técnica amplia en mejores habilidades de backend y en proyectos terminados y bien documentados.",
      "focus.arch": "Arquitectura", "focus.archValue": "Limpia · Mantenible · Por capas",
      "focus.testValue": "JUnit 5 · Mejor diseño de tests",
      "focus.data": "Datos", "focus.dataValue": "SQL · Modelado · Normalización",
      "focus.projects": "Proyectos", "focus.projectsValue": "Terminados · Útiles · Documentados",

      "contact.kicker": "Contacto",
      "contact.title": "¿Buscas un Desarrollador de Software Junior?",
      "contact.text": "Estoy abierto a oportunidades de desarrollo de software junior en España, en remoto o en entornos internacionales. La vía más rápida para contactarme es el email.",
      "contact.email": "Envíame un email",
      "contact.copyEmail": "Copiar email",

      "footer.made": "Hecho desde cero con HTML, CSS y JavaScript. Sin frameworks.",

      "palette.title": "Paleta de comandos",
      "palette.empty": "Ningún comando coincide.",
      "palette.placeholder": "Ir a una sección o ejecutar un comando…",
      "palette.section": "Sección",
      "palette.action": "Acción",
      "palette.link": "Enlace",
      "palette.cmdCv": "Descargar el CV",
      "palette.cmdCopy": "Copiar la dirección de email",
      "palette.cmdLang": "Cambiar a inglés",
      "palette.cmdGithub": "Abrir el perfil de GitHub",
      "palette.cmdLinkedin": "Abrir el perfil de LinkedIn",
      "palette.cmdTop": "Volver arriba",

      "toast.copied": "Email copiado al portapapeles",
      "toast.copyFailed": "No se pudo copiar — cesarmencas19@gmail.com"
    }
  };

  const STORE_KEY = "portfolio-lang";

  let lang = (() => {
    try {
      const saved = localStorage.getItem(STORE_KEY);
      if (saved === "en" || saved === "es") return saved;
    } catch (e) { /* private mode */ }
    return (navigator.language || "en").toLowerCase().indexOf("es") === 0 ? "es" : "en";
  })();

  const t = (key, vars) => {
    let str = (I18N[lang] && I18N[lang][key]) || (I18N.en && I18N.en[key]) || "";
    if (vars) {
      Object.keys(vars).forEach((k) => {
        str = str.replace(new RegExp("\\{" + k + "\\}", "g"), vars[k]);
      });
    }
    return str;
  };


  /* ══════════════════════════════════════════════════════════
   * 3 · SCROLL REVEALS + SPLIT TEXT
   * ══════════════════════════════════════════════════════════ */

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      revealObserver.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });

  const initReveals = () => {
    $$(".reveal:not(.is-visible)").forEach((el) => {
      if (el.dataset.revealDelay) el.style.setProperty("--reveal-delay", el.dataset.revealDelay);
      revealObserver.observe(el);
    });
  };

  /**
   * Wrap each word in two spans so it can slide up from a masked line.
   * Re-runs after a language change, preserving whether it was already shown.
   */
  const splitText = (el) => {
    const wasVisible = el.classList.contains("is-visible");
    const words = (el.textContent || "").trim().split(/\s+/);

    el.textContent = "";
    const frag = document.createDocumentFragment();

    words.forEach((word, i) => {
      const outer = document.createElement("span");
      outer.className = "split-word";
      outer.style.setProperty("--w", String(i));

      const inner = document.createElement("span");
      inner.className = "split-inner";
      inner.textContent = word;

      outer.appendChild(inner);
      frag.appendChild(outer);
      if (i < words.length - 1) frag.appendChild(document.createTextNode(" "));
    });

    el.appendChild(frag);
    el.classList.add("split-ready");

    if (wasVisible) {
      el.classList.add("is-visible");
    } else {
      revealObserver.observe(el);
    }
  };

  const initSplits = () => $$("[data-split]").forEach(splitText);


  /* ══════════════════════════════════════════════════════════
   * 4 · AMBIENT CANVAS
   *
   * A drifting particle field. Links are only drawn between
   * particles close to the pointer, which keeps the per-frame
   * cost low and makes the field react to the mouse.
   * ══════════════════════════════════════════════════════════ */

  const Background = (() => {
    const canvas = $("#bg-canvas");
    if (!canvas) return { init() {} };

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return { init() {} };

    let particles = [];
    let w = 0, h = 0;
    let rafId = null;
    let running = false;
    let lastFrame = 0;
    const FRAME_MS = 1000 / 30;  // the field drifts slowly; 30fps is plenty
    const pointer = { x: -9999, y: -9999, active: false };

    const LINK_RADIUS = 150;     // pointer influence radius
    const LINK_DIST   = 120;     // max distance between two linked dots

    const build = () => {
      // The dots are 1px-ish and blurred by the eye anyway, so a full
      // retina backing store would quadruple the fill cost for nothing.
      const dpr = Math.min(window.devicePixelRatio || 1, mqCoarse.matches ? 1 : 1.5);
      w = window.innerWidth;
      h = window.innerHeight;

      canvas.width  = Math.round(w * dpr);
      canvas.height = Math.round(h * dpr);
      canvas.style.width  = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Scale the count to the viewport area, with a hard ceiling.
      const target = clamp(Math.round((w * h) / 20000), 24, mqCoarse.matches ? 45 : 85);

      particles = new Array(target).fill(0).map(() => ({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 1.3 + 0.35,
        vx: (Math.random() - 0.5) * 0.13,
        vy: (Math.random() - 0.5) * 0.13,
        a: Math.random() * 0.35 + 0.18
      }));
    };

    const drawStatic = () => {
      ctx.clearRect(0, 0, w, h);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(125, 211, 252, " + p.a.toFixed(2) + ")";
        ctx.fill();
      });
    };

    const frame = (now) => {
      rafId = requestAnimationFrame(frame);

      // Skip frames to hold ~30fps. Halves the work with no visible
      // difference on a field this slow, and leaves the main thread free.
      if (now - lastFrame < FRAME_MS) return;
      lastFrame = now;

      ctx.clearRect(0, 0, w, h);

      const near = [];

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap rather than bounce — avoids dots piling up on the edges.
        if (p.x < -10) p.x = w + 10; else if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10; else if (p.y > h + 10) p.y = -10;

        let alpha = p.a;

        if (pointer.active) {
          const dx = p.x - pointer.x;
          const dy = p.y - pointer.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < LINK_RADIUS * LINK_RADIUS) {
            near.push(p);
            alpha = Math.min(0.85, p.a + (1 - Math.sqrt(d2) / LINK_RADIUS) * 0.5);
          }
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(125, 211, 252, " + alpha.toFixed(2) + ")";
        ctx.fill();
      }

      // Only the handful of dots near the cursor get linked.
      if (near.length > 1) {
        ctx.lineWidth = 1;
        for (let i = 0; i < near.length; i++) {
          for (let j = i + 1; j < near.length; j++) {
            const dx = near[i].x - near[j].x;
            const dy = near[i].y - near[j].y;
            const d = Math.sqrt(dx * dx + dy * dy);
            if (d > LINK_DIST) continue;
            ctx.beginPath();
            ctx.moveTo(near[i].x, near[i].y);
            ctx.lineTo(near[j].x, near[j].y);
            ctx.strokeStyle = "rgba(139, 92, 246, " + ((1 - d / LINK_DIST) * 0.22).toFixed(3) + ")";
            ctx.stroke();
          }
        }
      }
    };

    const start = () => {
      if (running || reduced()) return;
      running = true;
      rafId = requestAnimationFrame(frame);
    };

    const stop = () => {
      running = false;
      if (rafId) cancelAnimationFrame(rafId);
      rafId = null;
    };

    return {
      init() {
        build();

        if (reduced()) {
          drawStatic();
        } else {
          start();
        }

        window.addEventListener("resize", rafThrottle(() => {
          build();
          if (reduced()) drawStatic();
        }), { passive: true });

        // Never burn frames on a backgrounded tab.
        document.addEventListener("visibilitychange", () => {
          if (document.hidden) stop();
          else if (!reduced()) start();
        });

        if (canHover()) {
          window.addEventListener("pointermove", (e) => {
            if (e.pointerType === "touch") return;
            pointer.x = e.clientX;
            pointer.y = e.clientY;
            pointer.active = true;
          }, { passive: true });

          document.addEventListener("pointerleave", () => { pointer.active = false; });
        }
      }
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 5 · POINTER EFFECTS — glow, tilt, magnetic, spotlight, parallax
   * ══════════════════════════════════════════════════════════ */

  const Pointer = (() => {

    const cursorGlow = () => {
      const glow = $(".cursor-glow");
      if (!glow) return;

      const move = rafThrottle((x, y) => {
        // transform only — never left/top, which would force layout
        glow.style.transform = "translate3d(" + x + "px," + y + "px,0)";
        glow.style.opacity = "1";
      });

      window.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        move(e.clientX, e.clientY);
      }, { passive: true });

      document.addEventListener("pointerleave", () => { glow.style.opacity = "0"; });
    };

    const tilt = () => {
      $$("[data-tilt]").forEach((el) => {
        const strength = Number(el.dataset.tiltStrength || 5);
        let rect = null;

        const apply = rafThrottle((x, y) => {
          if (!rect) return;
          const px = (x - rect.left) / rect.width - 0.5;
          const py = (y - rect.top) / rect.height - 0.5;
          el.style.transform =
            "perspective(1000px) rotateX(" + (-py * strength).toFixed(2) + "deg)" +
            " rotateY(" + (px * strength).toFixed(2) + "deg)";
        });

        el.addEventListener("pointerenter", (e) => {
          if (e.pointerType === "touch") return;
          rect = el.getBoundingClientRect();   // measured once per hover
          el.style.willChange = "transform";
        });

        el.addEventListener("pointermove", (e) => {
          if (e.pointerType === "touch" || !rect) return;
          apply(e.clientX, e.clientY);
        }, { passive: true });

        el.addEventListener("pointerleave", () => {
          rect = null;
          el.style.transform = "";
          el.style.willChange = "";
        });
      });
    };

    const magnetic = () => {
      $$(".magnetic").forEach((el) => {
        let rect = null;

        const apply = rafThrottle((x, y) => {
          if (!rect) return;
          const dx = (x - rect.left - rect.width / 2) * 0.16;
          const dy = (y - rect.top - rect.height / 2) * 0.22;
          el.style.transform = "translate(" + dx.toFixed(1) + "px," + (dy - 3).toFixed(1) + "px)";
        });

        el.addEventListener("pointerenter", (e) => {
          if (e.pointerType === "touch") return;
          rect = el.getBoundingClientRect();
        });

        el.addEventListener("pointermove", (e) => {
          if (e.pointerType === "touch" || !rect) return;
          apply(e.clientX, e.clientY);
        }, { passive: true });

        el.addEventListener("pointerleave", () => {
          rect = null;
          el.style.transform = "";
        });
      });
    };

    /**
     * Grid spotlight.
     * Each card caches its own offset inside the grid as CSS vars, so a
     * pointermove writes ONE variable pair on the grid and triggers no
     * layout reads at all.
     */
    const spotlight = () => {
      $$("[data-spotlight]").forEach((grid) => {

        const cacheOffsets = () => {
          $$(":scope > *", grid).forEach((card) => {
            card.style.setProperty("--ox", card.offsetLeft + "px");
            card.style.setProperty("--oy", card.offsetTop + "px");
          });
        };

        const write = rafThrottle((x, y) => {
          grid.style.setProperty("--px", x + "px");
          grid.style.setProperty("--py", y + "px");
        });

        let rect = null;

        grid.addEventListener("pointerenter", (e) => {
          if (e.pointerType === "touch") return;
          rect = grid.getBoundingClientRect();
        });

        grid.addEventListener("pointermove", (e) => {
          if (e.pointerType === "touch" || !rect) return;
          write(e.clientX - rect.left, e.clientY - rect.top);
        }, { passive: true });

        grid.addEventListener("pointerleave", () => {
          rect = null;
          grid.style.setProperty("--px", "-999px");
          grid.style.setProperty("--py", "-999px");
        });

        // Offsets change whenever the grid reflows.
        if ("ResizeObserver" in window) {
          new ResizeObserver(rafThrottle(cacheOffsets)).observe(grid);
        } else {
          window.addEventListener("resize", rafThrottle(cacheOffsets), { passive: true });
        }

        grid._cacheOffsets = cacheOffsets;
        cacheOffsets();
      });
    };

    /** Very light parallax on the hero's decorative layers. */
    const parallax = () => {
      const layers = $$("[data-parallax]");
      if (!layers.length) return;

      const apply = rafThrottle((x, y) => {
        layers.forEach((el) => {
          const k = Number(el.dataset.parallax || 0.04);
          el.style.setProperty("--par-x", (x * k).toFixed(1) + "px");
          el.style.setProperty("--par-y", (y * k).toFixed(1) + "px");
        });
      });

      window.addEventListener("pointermove", (e) => {
        if (e.pointerType === "touch") return;
        apply(e.clientX - window.innerWidth / 2, e.clientY - window.innerHeight / 2);
      }, { passive: true });
    };

    return {
      init() {
        if (reduced() || !canHover()) return;
        cursorGlow();
        tilt();
        magnetic();
        spotlight();
        parallax();
      },
      // exposed so the stack module can refresh offsets after filtering
      refreshSpotlight() {
        $$("[data-spotlight]").forEach((g) => { if (g._cacheOffsets) g._cacheOffsets(); });
      }
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 6 · TYPING EFFECT
   * ══════════════════════════════════════════════════════════ */

  const Typing = (() => {
    const target = $("[data-typing]");
    let timer = null;
    let token = 0;

    return {
      restart() {
        if (!target) return;
        token += 1;
        const myToken = token;
        clearTimeout(timer);

        const lines = ROLE_LINES[lang] || ROLE_LINES.en;

        if (reduced()) {
          target.textContent = lines[0];
          return;
        }

        target.textContent = lines[0].slice(0, 1);
        let line = 0, chars = 1, deleting = false;

        /* The terminal must never look empty. Deletion therefore stops at a
           single character instead of running down to zero, and the next line
           starts typing from that character immediately. */
        const MIN_CHARS  = 1;
        const TYPE_MS    = 55;
        const DELETE_MS  = 26;
        const HOLD_MS    = 1800;   // full sentence stays readable
        const SWITCH_MS  = 140;    // brief beat before the next line

        const tick = () => {
          if (myToken !== token) return;               // a newer run took over
          const text = lines[line];

          if (!deleting) {
            chars += 1;
            target.textContent = text.slice(0, chars);
            if (chars >= text.length) {
              deleting = true;
              timer = setTimeout(tick, HOLD_MS);
              return;
            }
            timer = setTimeout(tick, TYPE_MS);
          } else {
            chars -= 1;
            target.textContent = text.slice(0, Math.max(chars, MIN_CHARS));
            if (chars <= MIN_CHARS) {
              deleting = false;
              line = (line + 1) % lines.length;
              chars = MIN_CHARS;
              // Seed the next line straight away so nothing blanks out.
              target.textContent = lines[line].slice(0, MIN_CHARS);
              timer = setTimeout(tick, SWITCH_MS);
              return;
            }
            timer = setTimeout(tick, DELETE_MS);
          }
        };

        tick();
      }
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 7 · TECH STACK
   *
   * Two tiers: a highlighted Core Stack row, then the full set
   * split into labelled category groups. Built once; filtering
   * and language changes only toggle classes / text.
   * ══════════════════════════════════════════════════════════ */

  const Stack = (() => {
    const coreGrid = $("#core-grid");
    const groupsEl = $("#tech-groups");
    const countEl  = $("[data-stack-count]");

    let cards  = [];   // every small card, across all groups
    let groups = [];   // { key, el, cards[] }
    let filter = "all";

    /** Shared markup for a technology card. */
    const buildCard = (item, isCore) => {
      const li = document.createElement("li");
      li.className = isCore ? "core-card" : "tech-card";
      li.style.setProperty("--accent-card", item.accent);

      const short = item.fallback || item.name.slice(0, 2);
      const iconCls = isCore ? "core-icon" : "tech-icon";
      const nameCls = isCore ? "core-name" : "tech-name";
      const roleCls = isCore ? "core-role" : "tech-role";
      const size    = isCore ? 56 : 40;

      li.innerHTML =
        '<span class="' + iconCls + '">' +
          (item.icon
            ? '<img src="' + item.icon + '" alt="" width="' + size + '" height="' + size + '" loading="lazy" decoding="async">'
            : "") +
          '<span class="tech-fallback">' + escapeHtml(short) + "</span>" +
        "</span>" +
        '<h4 class="' + nameCls + '">' + escapeHtml(item.name) + "</h4>" +
        '<p class="' + roleCls + '"></p>';

      if (!item.icon) li.classList.add("has-fallback");

      const img = li.querySelector("img");
      if (img) {
        // Fall back to the monogram if the icon CDN is unreachable.
        img.addEventListener("error", () => li.classList.add("has-fallback"), { once: true });
      }

      li._data = item;
      return li;
    };

    const build = () => {
      if (coreGrid) {
        const frag = document.createDocumentFragment();
        TECH.filter((t) => t.core).forEach((item) => {
          const li = buildCard(item, true);
          cards.push(li);
          frag.appendChild(li);
        });
        coreGrid.appendChild(frag);
      }

      if (!groupsEl) return;

      const frag = document.createDocumentFragment();

      TECH_GROUPS.forEach((key) => {
        const items = TECH.filter((t) => t.cat === key);
        if (!items.length) return;

        const section = document.createElement("div");
        section.className = "tech-group";
        section.dataset.group = key;

        const head = document.createElement("h3");
        head.className = "tech-group-title";
        head.innerHTML =
          '<span data-group-label></span>' +
          '<span class="tech-group-count">' + items.length + "</span>";

        const ul = document.createElement("ul");
        ul.className = "tech-grid";
        ul.setAttribute("data-spotlight", "");

        const groupCards = [];
        items.forEach((item) => {
          const li = buildCard(item, false);
          cards.push(li);
          groupCards.push(li);
          ul.appendChild(li);
        });

        section.appendChild(head);
        section.appendChild(ul);
        frag.appendChild(section);

        groups.push({ key: key, el: section, cards: groupCards });
      });

      groupsEl.appendChild(frag);
    };

    /** Language pass: only rewrites text, never rebuilds the DOM. */
    const relabel = () => {
      cards.forEach((li) => {
        const role = li._data.role;
        const p = li.querySelector(".tech-role, .core-role");
        if (p) p.textContent = role[lang] || role.en;
      });

      groups.forEach((g) => {
        const label = g.el.querySelector("[data-group-label]");
        if (label) label.textContent = t("stack.group." + g.key);
      });

      updateCount();
    };

    const updateCount = () => {
      if (!countEl) return;
      const shown = groups.reduce(
        (n, g) => n + (g.el.classList.contains("is-gone") ? 0 : g.cards.length), 0);
      countEl.textContent = filter === "all"
        ? t("stack.countAll", { n: TECH.length })
        : t("stack.countFiltered", { n: shown, total: TECH.length });
    };

    const applyFilter = (next) => {
      filter = next;

      groups.forEach((g) => {
        const matches = next === "all" || g.key === next;
        clearTimeout(g._timer);

        if (matches) {
          g.el.classList.remove("is-gone");
          void g.el.offsetWidth;              // restart the transition
          g._timer = setTimeout(() => g.el.classList.remove("is-out"), 20);
        } else {
          g.el.classList.add("is-out");
          g._timer = setTimeout(() => g.el.classList.add("is-gone"), 240);
        }
      });

      // Offsets move once the grids have reflowed.
      setTimeout(() => {
        Pointer.refreshSpotlight();
        updateCount();
      }, 300);
    };

    const wireFilters = () => {
      const buttons = $$(".chip-filter");
      if (!buttons.length) return;

      buttons.forEach((btn, i) => {
        btn.addEventListener("click", () => {
          buttons.forEach((b) => {
            b.classList.remove("is-active");
            b.setAttribute("aria-pressed", "false");
          });
          btn.classList.add("is-active");
          btn.setAttribute("aria-pressed", "true");
          applyFilter(btn.dataset.filter);
        });

        btn.addEventListener("keydown", (e) => {
          let next = null;
          if (e.key === "ArrowRight") next = buttons[(i + 1) % buttons.length];
          else if (e.key === "ArrowLeft") next = buttons[(i - 1 + buttons.length) % buttons.length];
          else if (e.key === "Home") next = buttons[0];
          else if (e.key === "End") next = buttons[buttons.length - 1];
          if (next) { e.preventDefault(); next.focus(); }
        });
      });
    };

    return {
      init() { build(); wireFilters(); },
      relabel: relabel,
      cards: () => cards
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 8 · LEARNING GRID
   * ══════════════════════════════════════════════════════════ */

  const Learning = (() => {
    const grid = $("#learning-grid");
    let cards = [];

    return {
      init() {
        if (!grid) return;
        const frag = document.createDocumentFragment();

        LEARNING.forEach((item) => {
          const li = document.createElement("li");
          li.className = "learning-card";
          li.style.setProperty("--accent-card", item.accent);

          li.innerHTML =
            '<div class="learning-head">' +
              '<span class="learning-icon">' +
                '<img src="' + item.icon + '" alt="" width="30" height="30" loading="lazy" decoding="async">' +
                '<span class="learning-fallback">' + escapeHtml(item.name.slice(0, 2)) + "</span>" +
              "</span>" +
              "<div>" +
                "<h3>" + escapeHtml(item.name) + "</h3>" +
                '<span class="learning-level"></span>' +
              "</div>" +
            "</div>" +
            "<p></p>";

          const img = li.querySelector("img");
          if (img) img.addEventListener("error", () => li.classList.add("has-fallback"), { once: true });

          li._data = item;
          cards.push(li);
          frag.appendChild(li);
        });

        grid.appendChild(frag);
      },

      relabel() {
        cards.forEach((li) => {
          li.querySelector("p").textContent = li._data[lang] || li._data.en;
          li.querySelector(".learning-level").textContent = t("learning.level");
        });
      }
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 9 · PROJECTS — GitHub metadata + visual play/pause
   * ══════════════════════════════════════════════════════════ */

  const Projects = (() => {
    const CACHE_KEY = "gh-repos-cache";
    const CACHE_TTL = 30 * 60 * 1000;   // 30 minutes
    let repoMap = null;

    const readCache = () => {
      try {
        const raw = sessionStorage.getItem(CACHE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (!parsed || Date.now() - parsed.at > CACHE_TTL) return null;
        return parsed.data;
      } catch (e) { return null; }
    };

    const writeCache = (data) => {
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), data: data }));
      } catch (e) { /* storage full or unavailable — not important */ }
    };

    const render = () => {
      if (!repoMap) return;

      $$("[data-repo]").forEach((card) => {
        const info = repoMap[card.dataset.repo];
        const box = $("[data-repo-meta]", card);
        if (!info || !box) return;

        const langEl    = $("[data-repo-lang]", box);
        const starsEl   = $("[data-repo-stars]", box);
        const updatedEl = $("[data-repo-updated]", box);

        if (langEl)  langEl.textContent  = info.language || "";
        if (starsEl) starsEl.textContent = info.stars > 0 ? "★ " + info.stars : "";

        if (updatedEl && info.updated) {
          const d = new Date(info.updated);
          if (!isNaN(d)) {
            updatedEl.textContent = t("projects.updated", {
              d: d.toLocaleDateString(lang === "es" ? "es-ES" : "en-GB", { month: "short", year: "numeric" })
            });
          }
        }

        // Only reveal the row if at least one field actually has content.
        const hasContent = [langEl, starsEl, updatedEl].some((el) => el && el.textContent.trim());
        box.hidden = !hasContent;
      });
    };

    /** Pause the SVG/CSS visuals whenever they're off-screen. */
    const observeVisuals = () => {
      const visuals = $$(".project-visual[data-anim]");
      if (!visuals.length) return;

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-live", entry.isIntersecting);
        });
      }, { threshold: 0.15 });

      visuals.forEach((v) => io.observe(v));
    };

    return {
      init() {
        observeVisuals();

        const cached = readCache();
        if (cached) {
          repoMap = cached;
          render();
          return;
        }

        // One request for the whole profile instead of one per repository.
        fetch("https://api.github.com/users/TsCesar/repos?per_page=100&sort=updated", {
          headers: { Accept: "application/vnd.github+json" }
        })
          .then((r) => (r.ok ? r.json() : Promise.reject(new Error("GitHub API " + r.status))))
          .then((repos) => {
            if (!Array.isArray(repos)) return;
            repoMap = {};
            repos.forEach((r) => {
              repoMap[r.name] = {
                stars: r.stargazers_count || 0,
                language: r.language || "",
                updated: r.pushed_at || r.updated_at || ""
              };
            });
            writeCache(repoMap);
            render();
          })
          .catch(() => {
            // Rate-limited or offline: the badges simply stay hidden.
          });
      },
      relabel: render
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 10 · NAVIGATION — mobile panel, scroll spy, progress, header
   * ══════════════════════════════════════════════════════════ */

  const Nav = (() => {
    const header   = $(".site-header");
    const toggle   = $("[data-nav-toggle]");
    const panel    = $("#nav-panel");
    const links    = $$(".nav-links a");
    const progress = $("[data-progress-bar]");

    let sections = [];
    let docHeight = 1;
    let lastY = 0;
    let menuOpen = false;

    const measure = () => {
      sections = links
        .map((a) => {
          const id = a.getAttribute("href");
          const el = id && id.length > 1 ? document.querySelector(id) : null;
          return el ? { link: a, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter(Boolean)
        .sort((a, b) => a.top - b.top);

      docHeight = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const onScroll = rafThrottle(() => {
      const y = window.scrollY;

      if (header) {
        header.classList.toggle("is-scrolled", y > 16);
        // Hide on the way down, bring it back on the way up.
        const hide = !menuOpen && y > 320 && y > lastY + 6;
        const show = y < lastY - 6 || y < 320;
        if (hide) header.classList.add("is-hidden");
        else if (show) header.classList.remove("is-hidden");
      }

      if (progress) {
        progress.style.transform = "scaleX(" + clamp(y / docHeight, 0, 1).toFixed(4) + ")";
      }

      const probe = y + window.innerHeight * 0.32;
      let active = null;
      for (let i = 0; i < sections.length; i++) {
        if (sections[i].top <= probe) active = sections[i].link;
      }
      links.forEach((a) => a.classList.toggle("is-active", a === active));

      lastY = y;
    });

    const setMenu = (open) => {
      menuOpen = open;
      if (!panel || !toggle) return;
      panel.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", String(open));
      document.body.classList.toggle("is-locked", open);

      const label = $(".sr-only", toggle);
      if (label) label.textContent = t(open ? "a11y.menuClose" : "a11y.menu");

      if (open) header && header.classList.remove("is-hidden");
    };

    return {
      init() {
        measure();
        onScroll();

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", rafThrottle(() => { measure(); onScroll(); }), { passive: true });

        // Fonts and lazy images shift the layout; re-measure once settled.
        window.addEventListener("load", () => { measure(); onScroll(); });
        if (document.fonts && document.fonts.ready) {
          document.fonts.ready.then(() => { measure(); onScroll(); });
        }

        if (toggle) toggle.addEventListener("click", () => setMenu(!menuOpen));

        links.forEach((a) => a.addEventListener("click", () => setMenu(false)));

        document.addEventListener("keydown", (e) => {
          if (e.key === "Escape" && menuOpen) {
            setMenu(false);
            toggle && toggle.focus();
          }
        });

        // Tap outside the panel to dismiss it
        document.addEventListener("click", (e) => {
          if (!menuOpen || !panel || !toggle) return;
          if (panel.contains(e.target) || toggle.contains(e.target)) return;
          setMenu(false);
        });

        // Keep focus inside the open panel
        document.addEventListener("focusin", (e) => {
          if (!menuOpen || !panel || !toggle) return;
          if (panel.contains(e.target) || toggle.contains(e.target)) return;
          const first = panel.querySelector("a, button");
          first && first.focus();
        });

        // Closing the menu when the layout grows back to desktop
        const wide = window.matchMedia("(min-width: 901px)");
        const onWide = (e) => { if (e.matches) setMenu(false); };
        if (wide.addEventListener) wide.addEventListener("change", onWide);
        else if (wide.addListener) wide.addListener(onWide);
      },
      closeMenu() { setMenu(false); }
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 11 · TIMELINE RAIL + TOUCH HIGHLIGHTS
   * ══════════════════════════════════════════════════════════ */

  const Timeline = (() => {
    const list = $("[data-timeline]");
    if (!list) return { init() {} };

    return {
      init() {
        const items = $$(".timeline-item", list);
        if (!items.length) return;

        let done = 0;
        const io = new IntersectionObserver((entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            done += 1;
            list.style.setProperty("--timeline-progress", (done / items.length).toFixed(3));
            io.unobserve(entry.target);
          });
        }, { threshold: 0.35 });

        items.forEach((item) => io.observe(item));
      }
    };
  })();

  /** On touch devices, light up whichever card is centred in the viewport. */
  const TouchHighlights = {
    init() {
      if (canHover()) return;

      const cards = $$(".tech-card, .core-card, .learning-card");
      if (!cards.length) return;

      const io = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          entry.target.classList.toggle("is-touched", entry.isIntersecting);
        });
      }, { rootMargin: "-42% 0px -42% 0px" });

      cards.forEach((c) => io.observe(c));
    }
  };


  /* ══════════════════════════════════════════════════════════
   * 12 · COMMAND PALETTE  (⌘K / Ctrl+K)
   * ══════════════════════════════════════════════════════════ */

  const Palette = (() => {
    const root  = $("[data-palette]");
    const input = $("[data-palette-input]");
    const list  = $("[data-palette-list]");
    const empty = $("[data-palette-empty]");
    if (!root || !input || !list) return { init() {}, relabel() {} };

    let items = [];
    let filtered = [];
    let cursor = 0;
    let lastFocus = null;

    const buildItems = () => ([
      { label: t("nav.about"),      kind: t("palette.section"), run: () => go("#about") },
      { label: t("nav.stack"),      kind: t("palette.section"), run: () => go("#stack") },
      { label: t("nav.experience"), kind: t("palette.section"), run: () => go("#experience") },
      { label: t("nav.projects"),   kind: t("palette.section"), run: () => go("#projects") },
      { label: t("nav.learning"),   kind: t("palette.section"), run: () => go("#learning") },
      { label: t("nav.contact"),    kind: t("palette.section"), run: () => go("#contact") },
      { label: t("palette.cmdCv"),   kind: t("palette.action"), run: () => { const l = $("[data-cv-link]"); l && l.click(); } },
      { label: t("palette.cmdCopy"), kind: t("palette.action"), run: () => copyEmail() },
      { label: t("palette.cmdLang"), kind: t("palette.action"), run: () => setLang(lang === "en" ? "es" : "en") },
      { label: t("palette.cmdTop"),  kind: t("palette.action"), run: () => window.scrollTo({ top: 0, behavior: reduced() ? "auto" : "smooth" }) },
      { label: t("palette.cmdGithub"),   kind: t("palette.link"), run: () => window.open("https://github.com/TsCesar", "_blank", "noopener") },
      { label: t("palette.cmdLinkedin"), kind: t("palette.link"), run: () => window.open("https://www.linkedin.com/in/c%C3%A9sar-m%C3%A9ndez-castro-a0b315310/", "_blank", "noopener") }
    ]);

    const go = (hash) => {
      const el = document.querySelector(hash);
      if (!el) return;
      el.scrollIntoView({ behavior: reduced() ? "auto" : "smooth", block: "start" });
    };

    const paint = () => {
      list.innerHTML = "";

      filtered.forEach((item, i) => {
        const li = document.createElement("li");
        li.className = "palette-item";
        li.id = "palette-opt-" + i;
        li.setAttribute("role", "option");
        li.setAttribute("aria-selected", String(i === cursor));
        li.innerHTML =
          '<span class="palette-item-dot" aria-hidden="true"></span>' +
          "<span>" + escapeHtml(item.label) + "</span>" +
          '<span class="palette-item-kind">' + escapeHtml(item.kind) + "</span>";

        li.addEventListener("click", () => { close(); item.run(); });
        li.addEventListener("pointermove", () => {
          if (cursor === i) return;
          cursor = i;
          paint();
        });

        list.appendChild(li);
      });

      if (empty) empty.hidden = filtered.length > 0;
      input.setAttribute("aria-activedescendant", filtered.length ? "palette-opt-" + cursor : "");

      const active = list.children[cursor];
      if (active && active.scrollIntoView) active.scrollIntoView({ block: "nearest" });
    };

    const search = (q) => {
      const needle = q.trim().toLowerCase();
      filtered = !needle
        ? items.slice()
        : items.filter((it) => it.label.toLowerCase().indexOf(needle) !== -1
                            || it.kind.toLowerCase().indexOf(needle) !== -1);
      cursor = 0;
      paint();
    };

    const open = () => {
      if (!root.hidden) return;
      lastFocus = document.activeElement;
      items = buildItems();
      root.hidden = false;
      document.body.classList.add("is-locked");
      input.value = "";
      search("");
      input.focus();
    };

    const close = () => {
      if (root.hidden) return;
      root.hidden = true;
      document.body.classList.remove("is-locked");
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    };

    return {
      init() {
        items = buildItems();

        $$("[data-palette-open]").forEach((b) => b.addEventListener("click", open));
        $$("[data-palette-close]").forEach((b) => b.addEventListener("click", close));

        document.addEventListener("keydown", (e) => {
          if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
            e.preventDefault();
            root.hidden ? open() : close();
            return;
          }
          if (e.key === "Escape" && !root.hidden) {
            e.preventDefault();
            close();
          }
        });

        input.addEventListener("input", () => search(input.value));

        input.addEventListener("keydown", (e) => {
          if (!filtered.length) return;

          if (e.key === "ArrowDown") {
            e.preventDefault();
            cursor = (cursor + 1) % filtered.length;
            paint();
          } else if (e.key === "ArrowUp") {
            e.preventDefault();
            cursor = (cursor - 1 + filtered.length) % filtered.length;
            paint();
          } else if (e.key === "Enter") {
            e.preventDefault();
            const chosen = filtered[cursor];
            close();
            chosen && chosen.run();
          } else if (e.key === "Tab") {
            // Single focusable element — keep focus inside the dialog.
            e.preventDefault();
          }
        });
      },

      relabel() {
        items = buildItems();
        input.placeholder = t("palette.placeholder");
        if (!root.hidden) search(input.value);
      }
    };
  })();


  /* ══════════════════════════════════════════════════════════
   * 13 · TOAST + COPY EMAIL
   * ══════════════════════════════════════════════════════════ */

  const toastEl = $("[data-toast]");
  let toastTimer = null;

  const showToast = (message) => {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.add("is-visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove("is-visible"), 2200);
  };

  const copyEmail = () => {
    const address = "cesarmencas19@gmail.com";

    const legacyCopy = () => {
      try {
        const ta = document.createElement("textarea");
        ta.value = address;
        ta.setAttribute("readonly", "");
        ta.style.cssText = "position:fixed;top:-1000px;opacity:0";
        document.body.appendChild(ta);
        ta.select();
        const ok = document.execCommand("copy");
        document.body.removeChild(ta);
        return ok;
      } catch (e) { return false; }
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(address)
        .then(() => showToast(t("toast.copied")))
        .catch(() => showToast(legacyCopy() ? t("toast.copied") : t("toast.copyFailed")));
    } else {
      showToast(legacyCopy() ? t("toast.copied") : t("toast.copyFailed"));
    }
  };


  /* ══════════════════════════════════════════════════════════
   * 14 · LANGUAGE APPLICATION
   * ══════════════════════════════════════════════════════════ */

  const applyLang = () => {
    document.documentElement.lang = lang;

    $$("[data-i18n]").forEach((el) => {
      const value = t(el.dataset.i18n);
      if (value) el.textContent = value;
    });

    // Language switch state
    const en = $("[data-lang-en]");
    const es = $("[data-lang-es]");
    if (en) en.classList.toggle("is-active", lang === "en");
    if (es) es.classList.toggle("is-active", lang === "es");

    // CV in the matching language
    $$("[data-cv-link]").forEach((link) => {
      link.href = lang === "es"
        ? "./assets/cv/CV_CesarMendez.pdf"
        : "./assets/cv/CV_CesarMendez_EN.pdf";
    });

    // Palette placeholder + strings
    const paletteInput = $("[data-palette-input]");
    if (paletteInput) paletteInput.placeholder = t("palette.placeholder");

    // data-i18n rewrote textContent, so headings must be re-split.
    initSplits();

    Stack.relabel();
    Learning.relabel();
    Projects.relabel();
    Palette.relabel();
    Typing.restart();
    initReveals();
  };

  const setLang = (next) => {
    if (next !== "en" && next !== "es") return;
    lang = next;
    try { localStorage.setItem(STORE_KEY, lang); } catch (e) { /* private mode */ }
    applyLang();
  };


  /* ══════════════════════════════════════════════════════════
   * 15 · BOOT
   * ══════════════════════════════════════════════════════════ */

  const boot = () => {
    // Build the dynamic sections before the first translation pass.
    Stack.init();
    Learning.init();

    applyLang();

    Nav.init();
    Background.init();
    Pointer.init();
    Projects.init();
    Timeline.init();
    TouchHighlights.init();
    Palette.init();

    initReveals();

    // Language toggle
    const langBtn = $("[data-lang-toggle]");
    if (langBtn) {
      langBtn.addEventListener("click", () => setLang(lang === "en" ? "es" : "en"));
    }

    // Copy email
    $$("[data-copy-email]").forEach((btn) => btn.addEventListener("click", copyEmail));

    // Footer year
    $$("[data-year]").forEach((el) => { el.textContent = String(new Date().getFullYear()); });

    // Devicon monogram fallback for the orbiting hero chips
    $$(".orbit-chip img").forEach((img) => {
      img.addEventListener("error", () => img.parentElement.classList.add("has-fallback"), { once: true });
    });

    /* Shortcut hint matches the platform: ⌘K on Apple, Ctrl K elsewhere.
       The handler already accepts either modifier, so only the label changes.
       `userAgentData.platform` is preferred; `platform` is deprecated but is
       still the only thing older Safari exposes. */
    (() => {
      const raw = (navigator.userAgentData && navigator.userAgentData.platform) ||
                  navigator.platform || navigator.userAgent || "";
      const isApple = /mac|iphone|ipad|ipod/i.test(raw);
      $$("[data-palette-mod]").forEach((el) => {
        el.textContent = isApple ? "\u2318" : "Ctrl";
        el.classList.toggle("is-symbol", isApple);
      });
      document.documentElement.dataset.os = isApple ? "apple" : "other";
    })();

    // Respect a live change to the motion preference
    const onMotionChange = () => { Typing.restart(); };
    if (mqReduced.addEventListener) mqReduced.addEventListener("change", onMotionChange);
    else if (mqReduced.addListener) mqReduced.addListener(onMotionChange);
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
