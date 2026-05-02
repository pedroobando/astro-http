import { createDb } from '@/db';
import { Posts } from '@/db/schema';
import { humanizeSlug } from '@/utils/humanizeSlug';
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { eq } from 'drizzle-orm';

export const GET = (async ({ params }) => {
  const postId = params.id;

  const db = createDb(env.clients);
  const result = await db.select().from(Posts).where(eq(Posts.id, postId!)).all();

  if (result.length === 0) {
    return Response.json({ message: `Post with id ${postId} not found`, like: 0 }, { status: 404 });
  }

  return Response.json({ like: result[0].likes });
}) satisfies APIRoute;

export const PUT = (async ({ params, request }) => {
  const postId = params.id;

  if (!postId) {
    return Response.json({ message: 'id parameter is required' }, { status: 400 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return Response.json({ message: 'Invalid JSON body' }, { status: 400 });
  }

  if (typeof body.likes !== 'number' || !Number.isFinite(body.likes)) {
    return Response.json({ message: 'likes is required and must be a valid number' }, { status: 400 });
  }

  const likesToAdd = body.likes;

  const db = createDb(env.clients);
  const existing = await db.select().from(Posts).where(eq(Posts.id, postId)).all();

  if (existing.length === 0) {
    const title = humanizeSlug(postId);

    const created = await db
      .insert(Posts)
      .values({
        id: postId,
        title,
        likes: likesToAdd,
      })
      .returning();

    return Response.json(created[0], { status: 201 });
  }

  const currentLikes = existing[0].likes ?? 0;
  const newLikes = currentLikes + likesToAdd;

  await db.update(Posts).set({ likes: newLikes }).where(eq(Posts.id, postId));
  console.log(existing[0].likes, newLikes);
  return Response.json({ likes: newLikes });
}) satisfies APIRoute;
