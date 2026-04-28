import type { APIRoute } from 'astro';
import { getEntry } from 'astro:content';

export const GET = (async ({ params, request }) => {
  const { slug } = params;

  const post = await getEntry('blog', slug!);

  if (!post) {
    return new Response(
      JSON.stringify({
        message: `slug: '${slug}' - not found`,
      }),
      {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }

  return new Response(JSON.stringify(post), { status: 200, headers: { 'Content-Type': 'application/json' } });
}) satisfies APIRoute;

export const POST = (async ({ params, request }) => {
  const body = await request.json();

  return new Response(
    JSON.stringify({
      metod: 'POST',
      ...body,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}) satisfies APIRoute;

export const PUT = (async ({ params, request }) => {
  const body = await request.json();
  const { slug } = params;

  return new Response(
    JSON.stringify({
      metod: 'PUT',
      slug,
      ...body,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}) satisfies APIRoute;

export const PATCH = (async ({ params, request }) => {
  const body = await request.json();
  const { slug } = params;

  return new Response(
    JSON.stringify({
      metod: 'PATCH',
      slug,
      ...body,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}) satisfies APIRoute;

export const DELETE = (async ({ params, request }) => {
  const body = await request.json();
  const { slug } = params;

  return new Response(
    JSON.stringify({
      metod: 'DELETE',
      slug,
    }),
    {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );
}) satisfies APIRoute;
