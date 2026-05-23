/* ============================================================
   PROPUESTAS 3D — dónde integrar WebGL en la home
   Una página por idea para que puedas comparar y elegir.
   ============================================================ */

export type PropuestaSlug =
  | "marquee"
  | "pilares"
  | "metricas"
  | "eventos"
  | "proyectos"
  | "equipo"
  | "recursos";

export type Propuesta = {
  slug: PropuestaSlug;
  index: string;
  /** Sección de la home donde encajaría */
  section: string;
  anchor: string;
  title: string;
  intro: string;
  hint: string;
  technique: string;
  /** Por qué mejora la UX */
  benefit: string;
};

export const propuestas: Propuesta[] = [
  {
    slug: "marquee",
    index: "01",
    section: "Marquee · debajo del hero",
    anchor: "#top",
    title: "Cinta orbital de disciplinas",
    intro:
      "Sustituye la tira CSS por un anillo 3D de chips que orbitan: el club se siente vivo antes de hacer scroll.",
    hint: "Mueve el cursor para inclinar el anillo",
    technique: "InstancedMesh · órbita paramétrica · tinte por acento",
    benefit:
      "Primer impacto dinámico sin pesar el hero; refuerza el vocabulario técnico del club.",
  },
  {
    slug: "pilares",
    index: "02",
    section: "About · pilares del club",
    anchor: "#club",
    title: "Cuatro pilares que respiran",
    intro:
      "Cada pilar del grid editorial se convierte en una columna 3D que pulsa con el tiempo y reacciona al cursor.",
    hint: "Pasa el cursor sobre el campo de columnas",
    technique: "InstancedMesh × 4 · onda radial · color por altura",
    benefit:
      "Metáfora visual directa de “fundamentos” y hace memorable la sección 01.",
  },
  {
    slug: "metricas",
    index: "03",
    section: "About · métricas",
    anchor: "#club",
    title: "Dashboard en volumen",
    intro:
      "Las cifras (120+, 35 talleres…) se leen como barras 3D proporcionales: datos como escultura, no solo tipografía.",
    hint: "Observa el pulso entre barras",
    technique: "Barras animadas · escala proporcional · wireframe sutil",
    benefit:
      "Credibilidad instantánea; las stats dejan de ser números planos.",
  },
  {
    slug: "eventos",
    index: "04",
    section: "Eventos · agenda",
    anchor: "#eventos",
    title: "Línea de tiempo espacial",
    intro:
      "La agenda se convierte en una espina 3D: nodos por evento, el activo brilla en acento según el cursor.",
    hint: "Mueve el cursor horizontalmente",
    technique: "Curva Catmull-Rom · esferas instanciadas · highlight por proximidad",
    benefit:
      "Navegación escaneable y premium; invita a explorar fechas sin leer todo el listado.",
  },
  {
    slug: "proyectos",
    index: "05",
    section: "Proyectos · grid de cards",
    anchor: "#proyectos",
    title: "Mosaico flotante",
    intro:
      "Las tarjetas de proyecto son losas en el espacio que ondulan suavemente; el hover levanta y acentúa una pieza.",
    hint: "Pasa el cursor sobre las losas",
    technique: "Grid 3D · raycasting · elevación + rotación al hover",
    benefit:
      "Sustituye el placeholder “01, 02…” por una vitrina que anticipa trabajo real.",
  },
  {
    slug: "equipo",
    index: "06",
    section: "Equipo · retratos",
    anchor: "#equipo",
    title: "Constelación de retratos",
    intro:
      "Discos metálicos con iniciales orbitan en una cuadrícula: placeholders elegantes hasta tener fotos reales.",
    hint: "Pasa el cursor sobre un disco",
    technique: "Cilindros PBR · emissive al hover · layout en rejilla",
    benefit:
      "Humaniza el equipo sin stock photos; coherente con el brutalismo editorial.",
  },
  {
    slug: "recursos",
    index: "07",
    section: "Recursos · enlaces",
    anchor: "#recursos",
    title: "Hub de enlaces",
    intro:
      "Cada recurso es un nodo en arco; líneas al centro σ sugieren que todo el conocimiento converge en el club.",
    hint: "Pasa el cursor cerca de un nodo",
    technique: "Nodos + aristas · etiquetas HTML · raycasting",
    benefit:
      "Convierte una lista lineal en mapa mental; refuerza la idea de ecosistema.",
  },
];

export function getPropuesta(slug: PropuestaSlug): Propuesta {
  return propuestas.find((p) => p.slug === slug)!;
}
