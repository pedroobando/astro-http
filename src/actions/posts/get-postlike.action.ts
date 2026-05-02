import { env } from 'cloudflare:workers';
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

import { createDb } from '@/db';
import { Posts } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const getPostLike = defineAction({
  // Validación automática con Zod
  accept: 'json',
  input: z.string(),

  // La lógica del servidor
  handler: async (postId): Promise<{ likes: number; exist: boolean }> => {
    const db = createDb(env.clients);
    const [post] = await db.select().from(Posts).where(eq(Posts.id, postId!));

    if (!post) {
      return { likes: 0, exist: false };
    }
    return { likes: post.likes! ?? 0, exist: true };
  },
});
