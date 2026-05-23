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
  email: "hola@sigmadataclub.org",
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
    "Sigma Data Club es la comunidad estudiantil donde exploramos datos, IA y machine learning con proyectos reales — y mucha gente curiosa.",
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
  /** Miembros activos del club (la multitud 3D usa este número). */
  memberCount: 162,
  crowd: {
    kicker: "La comunidad",
    line: "personas aprendiendo, construyendo y compartiendo datos.",
  },
  members: [
    { name: "Nombre Apellido", role: "Presidencia" },
    { name: "Nombre Apellido", role: "Vicepresidencia" },
    { name: "Nombre Apellido", role: "Coord. de Talleres" },
    { name: "Nombre Apellido", role: "Coord. de Proyectos" },
    { name: "Nombre Apellido", role: "Comunicación" },
    { name: "Nombre Apellido", role: "Alianzas" },
  ],
};

export const resources = {
  number: "05",
  label: "Recursos",
  title: "Para seguir aprendiendo",
  items: [
    {
      title: "Ruta de aprendizaje: de cero a Data Scientist",
      meta: "Guía",
      href: "#",
    },
    { title: "Datasets curados por la comunidad", meta: "Datos", href: "#" },
    { title: "Plantillas de proyectos y notebooks", meta: "Toolkit", href: "#" },
    { title: "Grabaciones de talleres pasados", meta: "Vídeo", href: "#" },
    { title: "Bolsa de prácticas y empleo", meta: "Carrera", href: "#" },
  ],
};

export const join = {
  number: "06",
  label: "Únete",
  title: "¿Listo para empezar?",
  body: "Da el primer paso. Déjanos tus datos y te invitamos al próximo evento — sin compromiso, sin requisitos previos.",
  interests: ["Machine Learning", "Visualización", "NLP", "Data Engineering", "Aún no lo sé"],
};

export const socials = [
  { label: "GitHub", href: "#" },
  { label: "LinkedIn", href: "#" },
  { label: "Instagram", href: "#" },
  { label: "Discord", href: "#" },
];
