export interface ManifestoItem {
  number: string;
  short: string;
  note: string;
  title: string;
  body: string;
}

export const manifesto: ManifestoItem[] = [
  {
    number: '01',
    short: 'código > slides',
    note: 'el repo es la diapositiva.',
    title: 'Aprender haciendo',
    body: 'Cada sesión es terminal abierta y editor de código. Si necesitas slides para explicar algo, probablemente todavía no lo entiendes lo bastante.',
  },
  {
    number: '02',
    short: 'dataset real > toy',
    note: 'si no pica, no enseña.',
    title: 'Datasets que pican',
    body: 'Trabajamos con datos reales abiertos o de retos. Toy data enseña algoritmos. Los datos reales enseñan cómo se usan en la práctica.',
  },
  {
    number: '03',
    short: 'junior arrastra a senior',
    note: 'explicar es el mejor test.',
    title: 'Sin gatekeeping',
    body: 'Si nunca has tocado Python pero te interesa, vienes igual. Quien lleva más tiempo enseña a quien empieza y aprende explicando.',
  },
  {
    number: '04',
    short: 'constancia > intensidad',
    note: 'consistencia compone interés.',
    title: 'Constancia > intensidad',
    body: 'No hacemos hackatones de fin de semana que queman. Hacemos jueves consecutivos durante años. Más lento. Más útil. La industria también funciona así.',
  },
];
