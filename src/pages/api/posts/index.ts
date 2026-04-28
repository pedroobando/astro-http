import type { APIRoute } from 'astro';
import { getCollection, getEntry } from 'astro:content';

// export const prerender = false;

export const GET = (async ({ params, request }) => {
  const url = new URL(request.url);
  const slug = url.searchParams.get('slug');

  if (slug) {
    const post = await getEntry('blog', slug);

    if (post) {
      return new Response(JSON.stringify(post), {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      });
    }

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

  const posts = (await getCollection('blog')).sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  return new Response(JSON.stringify(posts), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}) satisfies APIRoute;
