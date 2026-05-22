/* ============================================================
   LABORATORIO 3D — exploraciones de UI/UX con Three.js
   Cada entrada es una página (URL) con un concepto distinto.
   El texto vive aquí para mantener las escenas limpias.
   ============================================================ */

export type LabSlug = "nube" | "campo" | "sigma" | "red";

export type LabExperiment = {
  slug: LabSlug;
  index: string; // "01"
  kind: string; // etiqueta corta
  title: string; // título editorial grande
  intro: string; // una frase
  hint: string; // pista de interacción
  technique: string; // técnica three.js
};

export const labExperiments: LabExperiment[] = [
  {
    slug: "nube",
    index: "01",
    kind: "Nube de puntos",
    title: "Datos como materia",
    intro:
      "Nueve mil puntos que pasan del ruido a la forma: el caos de los datos crudos condensándose en la Σ del club.",
    hint: "Mueve el cursor para empujar la nube",
    technique: "GPU points · morphing · simplex noise",
  },
  {
    slug: "campo",
    index: "02",
    kind: "Campo instanciado",
    title: "Un dataset que respira",
    intro:
      "Un terreno de miles de columnas que oscila como un mapa de calor vivo. Tu cursor levanta una onda a su paso.",
    hint: "Recorre el campo con el cursor",
    technique: "InstancedMesh · 2.500 columnas · ruido animado",
  },
  {
    slug: "sigma",
    index: "03",
    kind: "Tipografía 3D",
    title: "La marca en el espacio",
    intro:
      "La sigma como objeto: un sólido editorial con un borde de luz en el acento del club, suspendido y girando.",
    hint: "Mueve el cursor para orbitar la pieza",
    technique: "Geometría extruida · shader fresnel",
  },
  {
    slug: "red",
    index: "04",
    kind: "Grafo de comunidad",
    title: "Todo está conectado",
    intro:
      "Cada nodo es un tema; cada arista, las personas que los unen. Gira el grafo y pásate por encima para explorarlo.",
    hint: "Arrastra para rotar · pasa el cursor sobre un nodo",
    technique: "Grafo 3D · raycasting · etiquetas HTML",
  },
];

export function getExperiment(slug: LabSlug): LabExperiment {
  return labExperiments.find((e) => e.slug === slug)!;
}

/** Temas que viajan por el grafo de la comunidad (concepto 04). */
export const labTopics = [
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
  "Series Temporales",
  "Embeddings",
  "Transformers",
  "PyTorch",
  "D3",
  "GeoData",
  "Edge ML",
  "Recomendadores",
  "dbt",
  "Looker",
  "Ética de datos",
  "Hackathon",
  "Notebooks",
  "Pandas",
];
