/* Metáforas abstractas por card — sin modelos literales */

export type ProjectVisualId =
  | "signal"
  | "flow"
  | "lattice"
  | "match"
  | "aperture"
  | "metric";

export type ProjectVisualMeta = {
  id: ProjectVisualId;
  /** Una línea editorial (opcional, para debug / tooltips futuros) */
  metaphor: string;
};

/** Orden alineado con projects.items en site.ts */
export const projectVisuals: ProjectVisualMeta[] = [
  { id: "signal", metaphor: "Serie temporal · pulso de demanda" },
  { id: "flow", metaphor: "Trayectorias · flujo urbano" },
  { id: "lattice", metaphor: "Tokens · estructura del lenguaje" },
  { id: "match", metaphor: "Afinidad · nodos que convergen" },
  { id: "aperture", metaphor: "Foco · campo de visión" },
  { id: "metric", metaphor: "Métrica · pulso de datos" },
];

export function getProjectVisual(index: number): ProjectVisualMeta {
  return projectVisuals[index % projectVisuals.length]!;
}
