# Guía de diseño — Sigma Data Club

Documento de referencia sobre **cómo debe verse y sentirse** el sitio, a nivel
general. No describe componentes concretos: define el lenguaje de diseño que
toda la web debe respetar.

---

## Concepto rector

**Brutalismo editorial elevado, nivel Awwwards.** Audaz y con carácter, pero
refinado y profesional — nunca "friki" de programador. La meta es que parezca
una revista de diseño que resulta que va de datos, no una demo técnica. Cada
decisión busca **impacto visual con sobriedad**.

---

## Tono y atmósfera

- **Tema claro**, luminoso y con mucho aire. La página respira; el espacio en
  blanco es un material de diseño, no un hueco que rellenar.
- Sensación **serena pero potente**: el contraste fuerte y la tipografía grande
  aportan la energía; el vacío la equilibra.

---

## Color

- Paleta **mínima y disciplinada**: blanco y negro como base absoluta.
- Un **único acento** (turquesa `#36B9BA`), usado **con moderación** — para
  marcar, no para decorar. Un punto de color en momentos clave (un detalle, un
  estado *hover*, una cresta del 3D) vale más que salpicarlo por todas partes.
- Los tres colores clave viven en **variables** (tokens), de modo que toda la
  identidad cuelga de ellos:

  | Token             | Valor      | Uso                                  |
  | ----------------- | ---------- | ------------------------------------ |
  | `--color-bg`      | `#ffffff`  | Fondo (blanco)                       |
  | `--color-ink`     | `#0b0b0b`  | Texto y elementos (negro)            |
  | `--color-accent`  | `#36b9ba`  | Acento, con moderación               |

---

## Tipografía

- **Protagonista del diseño.** Titulares enormes, tensos y de peso, que dominan
  la composición y a veces "sangran" sobre los fondos.
- Jerarquía clarísima: **pocos tamaños, muy diferenciados**. Lo grande es muy
  grande; lo pequeño es funcional y limpio.
- Una **display con personalidad** para los titulares y una **grotesca neutra y
  legible** para el cuerpo. Nada de monoespaciada ni estética de terminal.

---

## Estructura y layout

- **Retícula visible y firme**: líneas y reglas que organizan el contenido,
  bloques de **bordes vivos** (esquinas a 90°, sin redondeos blandos).
- Lenguaje **editorial**: secciones numeradas (01, 02, 03…) y etiquetas tipo
  *kicker* que dan ritmo de "publicación".
- Composición por **contraste de escalas**: titular gigante junto a texto
  pequeño, zonas densas frente a zonas vacías.

---

## Movimiento e interacción

- **3D como atmósfera, no como circo.** El 3D aporta una capa viva y sutil
  (una superficie/malla de datos), siempre supeditada al contenido y a la
  legibilidad — nunca compite con el texto.
- Animaciones **discretas y elegantes**: aparición suave al hacer scroll,
  microinteracciones medidas en *hover*. Nada estridente.
- **Legibilidad por encima de todo**: cuando texto y fondo animado conviven, se
  resuelve con recursos integrados (degradados/halos que disuelven el fondo,
  jerarquía de capas) en vez de cajas que rompan la estética.

---

## Principios transversales

- **Responsive y cuidado en todas las plataformas**: la jerarquía y el aire se
  mantienen del móvil al desktop; los elementos escalan con fluidez.
- **Accesibilidad y rendimiento**: respeta `prefers-reduced-motion`, mantiene
  contrastes altos y modera el 3D en pantallas pequeñas.
- **Coherencia**: todo nace de un **sistema corto** (3 colores, 2 tipografías,
  una retícula, un acento) aplicado con consistencia.

---

## En una frase

> Blanco y negro, tipografía monumental, retícula brutalista y un solo acento
> turquesa — con un 3D atmosférico que acompaña sin estorbar, y la legibilidad
> siempre ganando.
