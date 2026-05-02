import { z } from 'astro/zod';
import { defineAction } from 'astro:actions';

export const getGreeting = defineAction({
  // Validación automática con Zod
  accept: 'json',
  input: z.object({
    name: z.string().min(2),
    age: z.number(),
    isActive: z.boolean().default(false).optional(),
  }),

  // La lógica del servidor
  handler: async ({ name, age, isActive }) => {
    console.log({ name, age, isActive });
    return `Hello, ${name}..!`;
  },
});
