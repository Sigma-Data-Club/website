/* ============================================================
   CONTENIDO EDITABLE — Sigma Data Club
   Todo el texto/datos del sitio vive aquí. Edita libremente.
   (Es contenido de relleno realista; sustitúyelo por el real.)
   ============================================================ */

export const site = {
  name: "Sigma Data Club",
  shortName: "Sigma",
  symbol: "σ",
  tagline: "Club de Ciencia de Datos",
  university: "Universidad", // ← pon aquí el nombre de tu universidad
  email: "sigmaclub.upv@gmail.com",
  year: 2026,
};

export const nav = [
  { label: "Club", href: "#club" },
  { label: "Eventos", href: "#eventos" },
  { label: "Proyectos", href: "#proyectos" },
  { label: "Equipo", href: "#equipo" },
  { label: "Recursos", href: "#recursos" },
];

export const hero = {
  eyebrow: "Club de Ciencia de Datos",
  // Cada palabra es una línea en pantalla grande.
  headline: ["Aprende", "Construye", "Comparte"],
  intro:
    "Comunidad universitaria de datos e IA: aprendemos en práctica, construimos proyectos reales y compartimos lo que descubrimos — sin quedarnos en la teoría.",
  primaryCta: { label: "Únete al club", href: "#unete" },
  secondaryCta: { label: "Ver proyectos", href: "#proyectos" },
};

export const marquee = [
  "Python",
  "Machine Learning",
  "Visualización",
  "SQL",
  "Deep Learning",
  "Estadística",
  "NLP",
  "Big Data",
  "Computer Vision",
  "MLOps",
];

export const about = {
  number: "01",
  label: "El club",
  statement:
    "Transformamos la curiosidad por los datos en proyectos, comunidad y carrera.",
  body: [
    "Somos estudiantes de todas las carreras unidos por una idea: los datos cuentan historias y resuelven problemas reales. Cada semana nos juntamos para aprender haciendo.",
    "No necesitas experiencia previa. Necesitas ganas. Te acompañamos desde tu primer notebook hasta tu primer modelo en producción.",
  ],
  pillars: [
    {
      title: "Talleres prácticos",
      desc: "Sesiones semanales hands-on, de Pandas a redes neuronales.",
    },
    {
      title: "Proyectos reales",
      desc: "Trabajamos con datos abiertos y retos de empresas y la ciudad.",
    },
    {
      title: "Mentoría",
      desc: "Estudiantes senior y profesionales que te guían en tu camino.",
    },
    {
      title: "Comunidad",
      desc: "Una red de personas curiosas que aprenden y crecen juntas.",
    },
  ],
  stats: [
    { value: "120+", label: "Miembros activos" },
    { value: "35", label: "Talleres al año" },
    { value: "18", label: "Proyectos lanzados" },
    { value: "8", label: "Hackatones" },
  ],
};

export const events = {
  number: "02",
  label: "Eventos",
  title: "Lo que viene",
  items: [
    {
      date: "12 JUN",
      title: "Introducción a Pandas",
      type: "Taller",
      place: "Aula 3.2",
    },
    {
      date: "26 JUN",
      title: "MLOps: de notebook a producción",
      type: "Charla",
      place: "Auditorio",
    },
    {
      date: "10 JUL",
      title: "Hackathon Sigma 2026",
      type: "Hackathon",
      place: "Campus Central",
    },
    {
      date: "24 JUL",
      title: "Datatón: datos abiertos de la ciudad",
      type: "Competición",
      place: "Online",
    },
    {
      date: "07 AGO",
      title: "Visualización con D3 y Observable",
      type: "Taller",
      place: "Aula 3.2",
    },
  ],
};

export const projects = {
  number: "03",
  label: "Proyectos",
  title: "Lo que construimos",
  items: [
    {
      title: "Predicción de demanda energética",
      area: "Machine Learning",
      desc: "Modelos de series temporales para anticipar el consumo del campus.",
      tags: ["Python", "XGBoost", "Time Series"],
    },
    {
      title: "Movilidad urbana en tiempo real",
      area: "Data Viz",
      desc: "Dashboard interactivo del transporte público de la ciudad.",
      tags: ["D3", "GeoData", "React"],
    },
    {
      title: "Detector de noticias falsas",
      area: "NLP",
      desc: "Clasificador de desinformación con modelos de lenguaje.",
      tags: ["Transformers", "PyTorch", "NLP"],
    },
    {
      title: "Recomendador de asignaturas",
      area: "Sistemas de recomendación",
      desc: "Sugerencias personalizadas a partir del historial académico.",
      tags: ["Embeddings", "FastAPI"],
    },
    {
      title: "Visión por computador para reciclaje",
      area: "Computer Vision",
      desc: "Clasificación de residuos en tiempo real con la cámara del móvil.",
      tags: ["CNN", "ONNX", "Edge"],
    },
    {
      title: "Pulso de salud universitaria",
      area: "Analítica",
      desc: "Encuestas anónimas convertidas en insights para bienestar estudiantil.",
      tags: ["SQL", "dbt", "Looker"],
    },
  ],
};

export const team = {
  number: "04",
  label: "Equipo",
  title: "Quién mueve el club",
  memberCount: 162,
  crowd: {
    kicker: "La comunidad",
    line: "personas aprendiendo, construyendo y compartiendo datos.",
  },
  board: {
    title: "Junta directiva",
    subtitle: "Curso 2026/27.",
    page: "[ 01 / 02 ]",
    members: [
      {
        name: "Héctor Sánchez",
        role: "presidente",
        image: "/sigma-characters-images/junta-retrato-04.png",
        linkedin: "https://www.linkedin.com/in/h%C3%A9ctor-s%C3%A1nchez--",
      },
      {
        name: "Lara Ruiz",
        role: "coordinadora GE",
        image: "/sigma-characters-images/lara-ruiz.png",
        linkedin: "https://www.linkedin.com/in/lara-ruiz-casado",
      },
      {
        name: "Eva Lorente",
        role: "directora marketing",
        image: "/sigma-characters-images/junta-retrato-02.png",
        linkedin: "https://www.linkedin.com/in/eva-lorente-cutanda/",
      },
      {
        name: "Cristina Catalá",
        role: "directora eventos",
        image: "/sigma-characters-images/cristina-catala.png",
        linkedin: "https://www.linkedin.com/in/cristina-catal%C3%A1-saborit-a71748388",
      },
      {
        name: "Aitana Oñate",
        role: "directora partnerships",
        image: "/sigma-characters-images/junta-retrato-03.png",
        linkedin: "https://www.linkedin.com/in/aitana-o%C3%B1ate-jim%C3%A9nez-2385242b4",
      },
      {
        name: "Leire Sánchez",
        role: "responsable relaciones internas",
        image: "/sigma-characters-images/leire-sanchez.png",
        linkedin: "https://www.linkedin.com/in/leire-s%C3%A1nchez-garc%C3%ADa",
      },
      {
        name: "Vicente E. Tralci",
        role: "responsable administración",
        image: "/sigma-characters-images/vicente-tralci.png",
        linkedin: "https://www.linkedin.com/in/vicente-emilio-tralci-sindoni",
      },
      {
        name: "Lluc Climent",
        role: "project manager",
        image: "/sigma-characters-images/junta-retrato.png",
        linkedin: "https://www.linkedin.com/in/lluc-climent",
      },
      {
        name: "Juan López",
        role: "project manager",
        image: "/sigma-characters-images/juan-lopez.png",
        linkedin: "https://www.linkedin.com/in/juanlobl",
      },
      {
        name: "Hugo Carmona",
        role: "project manager",
        image: "/sigma-characters-images/hugo-carmona.png",
        linkedin: "https://www.linkedin.com/in/hugo-carmona-3553093a0",
      },
      {
        name: "Sergio Ortiz",
        role: "coordinador",
        image: "/sigma-characters-images/sergio-o.png",
        linkedin: "https://www.linkedin.com/in/sergioortizmontesinos",
      },
    ],
  },
  mentors: {
    title: "Mentores",
    subtitle: "Alumni que echan una mano y que nos inspiran.",
    page: "[ 02 / 02 ]",
    members: [
      {
        name: "Imad Rifai",
        role: "alumni · ex-presidente · 2025/26",
        bio: "Ex-presidente de Sigma Data Club.",
        image: "/sigma-characters-images/imad-r.png",
        linkedin: "https://www.linkedin.com/in/imadrifai",
      },
      {
        name: "Laiqian Ji",
        role: "alumni · founder · 2024",
        bio: "Fundador de Sigma Data Club. Actualmente AI Developer.",
        image: "/sigma-characters-images/laiqian-j.png",
        linkedin: "https://www.linkedin.com/in/jilaiqian",
      },
      {
        name: "Andreu Bonet Pavía",
        role: "alumni · cofundador · 2024",
        bio: "Cofundador de Sigma Data Club.",
        image: "/sigma-characters-images/andreu-b.png",
        linkedin: "https://www.linkedin.com/in/andreu-bonet-pavia-8a5a72298",
      },
      {
        name: "Ernesto Martínez Gómez",
        role: "alumni · cofundador · 2024",
        bio: "Cofundador de Sigma Data Club. Actualmente CDO en Eaship.",
        image: "/sigma-characters-images/ernesto-m.png",
        linkedin: "https://www.linkedin.com/in/ernestomg",
      },
    ],
  },
};

const resourceCategories = [
  {
    title: "fundamentos",
    items: [
      {
        kind: "curso",
        title: "CS50P · Introduction to Programming with Python",
        subtitle: "David Malan, Harvard",
        href: "https://cs50.harvard.edu/python/",
      },
      {
        kind: "libro",
        title: "Python for Data Analysis (3.ª ed.)",
        subtitle: "Wes McKinney",
        href: "https://wesmckinney.com/book/",
      },
      {
        kind: "curso",
        title: "Statistical Learning with Python",
        subtitle: "Hastie & Tibshirani, Stanford Online",
        href: "https://www.statlearning.com/",
      },
      {
        kind: "vídeo",
        title: "3Blue1Brown · Essence of Linear Algebra",
        subtitle: "Para refrescar antes de retomar deep learning",
        href: "https://www.youtube.com/playlist?list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab",
      },
    ],
  },
  {
    title: "machine learning",
    items: [
      {
        kind: "libro",
        title: "Hands-On Machine Learning (3.ª ed.)",
        subtitle: "Aurélien Géron · libro de referencia del club",
        href: "https://www.oreilly.com/library/view/hands-on-machine-learning/9781098125967/",
      },
      {
        kind: "curso",
        title: "Practical Deep Learning for Coders",
        subtitle: "fast.ai · Jeremy Howard",
        href: "https://course.fast.ai/",
      },
      {
        kind: "curso",
        title: "CS231n · CNNs for Visual Recognition",
        subtitle: "Stanford",
        href: "http://cs231n.stanford.edu/",
      },
      {
        kind: "paper",
        title: "Attention Is All You Need (anotado)",
        subtitle: "Vaswani et al. · versión comentada por el club",
        href: "https://arxiv.org/abs/1706.03762",
      },
    ],
  },
  {
    title: "nlp y llms",
    items: [
      {
        kind: "curso",
        title: "CS224n · NLP with Deep Learning",
        subtitle: "Stanford · imprescindible",
        href: "https://web.stanford.edu/class/cs224n/",
      },
      {
        kind: "curso",
        title: "Hugging Face NLP course",
        subtitle: "Gratis · práctico",
        href: "https://huggingface.co/learn/nlp-course",
      },
      {
        kind: "guía",
        title: "Build a Large Language Model (from scratch)",
        subtitle: "Sebastian Raschka",
        href: "https://www.manning.com/books/build-a-large-language-model-from-scratch",
      },
      {
        kind: "repo",
        title: "karpathy/nanoGPT",
        subtitle: "GPT educativo, <500 líneas",
        href: "https://github.com/karpathy/nanoGPT",
      },
    ],
  },
  {
    title: "datos & sql",
    items: [
      {
        kind: "libro",
        title: "Designing Data-Intensive Applications",
        subtitle: "Martin Kleppmann · clásico de sistemas de datos",
        href: "https://dataintensive.net/",
      },
      {
        kind: "curso",
        title: "CMU 15-445 · Database Systems",
        subtitle: "Andy Pavlo · grabaciones públicas",
        href: "https://15445.courses.cs.cmu.edu/",
      },
      {
        kind: "guía",
        title: "DuckDB · Friendly SQL",
        subtitle: "Por qué dejamos sqlite en proyectos del club",
        href: "https://duckdb.org/docs/",
      },
      {
        kind: "guía",
        title: "Modern data stack ELI5",
        subtitle: "Por Iván Costa, en el blog del club",
        href: "https://sigma-data-club.github.io/website/blog/",
      },
    ],
  },
  {
    title: "mlops & producción",
    items: [
      {
        kind: "libro",
        title: "Designing Machine Learning Systems",
        subtitle: "Chip Huyen",
        href: "https://www.oreilly.com/library/view/designing-machine-learning/9781098107956/",
      },
      {
        kind: "guía",
        title: "Made With ML · MLOps course",
        subtitle: "Goku Mohandas · gratis",
        href: "https://madewithml.com/",
      },
      {
        kind: "guía",
        title: "Setup interno del club: Prefect + DVC + MLflow",
        subtitle: "Guía paso a paso · blog del club",
        href: "https://sigma-data-club.github.io/website/blog/",
      },
    ],
  },
  {
    title: "datasets abiertos (recomendados)",
    items: [
      {
        kind: "dataset",
        title: "Portal de datos abiertos del Ayuntamiento de València",
        subtitle: "Ideal para proyectos urbanos",
        href: "https://www.valencia.es/dadesobertes/",
      },
      {
        kind: "dataset",
        title: "RENFE Open Data",
        subtitle: "Horarios, retrasos, cercanías",
        href: "https://data.renfe.com/",
      },
      {
        kind: "dataset",
        title: "AEMET OpenData",
        subtitle: "Meteorología nacional",
        href: "https://opendata.aemet.es/",
      },
      {
        kind: "dataset",
        title: "Datos abiertos GVA",
        subtitle: "Generalitat Valenciana",
        href: "https://dadesobertes.gva.es/",
      },
    ],
  },
] as const;

export const resources = {
  number: "05",
  label: "Recursos",
  title: "Material curado por la comunidad.",
  intro:
    "Lo que el club recomienda — no lo que sale en SEO. Lista mantenida por la junta, revisada cada semestre. Si crees que falta algo, abre un PR en GitHub.",
  categories: resourceCategories,
  items: resourceCategories.flatMap((category) =>
    category.items.map((item) => ({
      title: item.title,
      meta: item.kind,
      href: item.href,
    })),
  ),
};

export const join = {
  number: "06",
  label: "Únete",
  title: "¿Listo para empezar?",
  body: "Da el primer paso. Rellena el formulario y te invitamos al próximo evento — sin compromiso, sin requisitos previos.",
  formUrl:
    "https://docs.google.com/forms/d/e/1FAIpQLSeCZaMDBU2KllVEIURvsVr-29RzjZlPPeAHKv-Vzr9rD-Tu_Q/viewform?usp=dialog",
};

export const socials = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Discord", href: "#" },
];
