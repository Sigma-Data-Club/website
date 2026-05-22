import type { ComponentType } from "react";
import { HeroSphere } from "./HeroSphere";
import { HeroSurface } from "./HeroSurface";
import { HeroGraph } from "./HeroGraph";
import { HeroType } from "./HeroType";
import { HeroFlow } from "./HeroFlow";

export type HeroVariant = {
  id: string;
  name: string;
  desc: string;
  Component: ComponentType;
};

export const heroVariants: HeroVariant[] = [
  {
    id: "1",
    name: "Esfera de datos",
    desc: "Miles de puntos sobre una esfera deformada con ruido. Cada punto, un dato.",
    Component: HeroSphere,
  },
  {
    id: "2",
    name: "Superficie ondulada",
    desc: "Una malla 3D que fluye como un paisaje topográfico de datos.",
    Component: HeroSurface,
  },
  {
    id: "3",
    name: "Grafo de nodos",
    desc: "Una red neuronal viva: nodos conectados que respiran y derivan.",
    Component: HeroGraph,
  },
  {
    id: "4",
    name: "Tipográfico XL",
    desc: "El titular como protagonista, con un icosaedro wireframe de acento.",
    Component: HeroType,
  },
  {
    id: "5",
    name: "Campo de flujo",
    desc: "Partículas que fluyen por un campo de ruido, como corrientes de datos.",
    Component: HeroFlow,
  },
];

export function getHeroVariant(id: string) {
  return heroVariants.find((v) => v.id === id);
}
