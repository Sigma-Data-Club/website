import { defineCollection, reference, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      authors: z.array(reference('equipo')),
      tags: z.array(z.string()).default([]),
      excerpt: z.string(),
      draft: z.boolean().default(false),
      hero: image().optional(),
    }),
});

const eventos = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    durationMin: z.number().default(120),
    location: z.string(),
    type: z.enum(['workshop', 'charla', 'datathon', 'social', 'open hack']),
    speaker: z.string(),
    description: z.string(),
    capacity: z.string().optional(),
    attendees: z.number().optional(),
    signupUrl: z.string().url().optional(),
    materialUrl: z.string().url().optional(),
  }),
});

const proyectos = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    thumb: z.string(),
    status: z.enum(['en curso', 'publicado', 'archivado']),
    category: z.enum(['NLP', 'Visión', 'ML', 'Open Data', 'MLOps', 'Otro']),
    tags: z.array(z.string()).default([]),
    summary: z.string(),
    contribCount: z.number(),
    repoUrl: z.string().url().optional(),
    demoUrl: z.string().url().optional(),
    contributors: z.array(reference('equipo')).optional(),
  }),
});

const equipo = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    kind: z.enum(['junta', 'mentor']),
    role: z.string(),
    initials: z.string(),
    bio: z.string(),
    grade: z.string().optional(),
    github: z.string().url().optional(),
    linkedin: z.string().url().optional(),
    period: z.string().optional(),
    order: z.number().default(0),
  }),
});

const tracks = defineCollection({
  type: 'data',
  schema: z.object({
    name: z.string(),
    lead: z.string(),
    program: z.string(),
    focus: z.string(),
    status: z.enum(['activo', 'en formación', 'vacante']),
    order: z.number().default(0),
  }),
});

const recursos = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    by: z.string().optional(),
    group: z.enum([
      'fundamentos',
      'machine learning',
      'nlp y llms',
      'datos & sql',
      'mlops & producción',
      'datasets',
      'apuntes',
    ]),
    kind: z.enum(['curso', 'libro', 'paper', 'vídeo', 'guía', 'repo', 'dataset']),
    url: z.string().url(),
    order: z.number().default(0),
  }),
});

export const collections = { blog, eventos, proyectos, equipo, tracks, recursos };
