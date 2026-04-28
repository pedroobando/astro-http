import type { APIRoute } from 'astro';
export const prerender = true;

export const GET = (async ({ params, request }) => {
  const person = { name: 'Pedro Obando', age: 55, date: new Date() };

  return new Response(JSON.stringify(person), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}) satisfies APIRoute;
