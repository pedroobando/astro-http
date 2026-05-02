import { env } from 'cloudflare:workers';
import { defineAction } from 'astro:actions';
import { z } from 'astro/zod';

import { createDb } from '@/db';
import { Posts } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { humanizeSlug } from '@/utils/humanizeSlug';

export const updLike = defineAction({
  // Validación automática con Zod
  accept: 'json',
  input: z.object({
    postId: z.string(),
    increment: z.number().gt(0),
  }),

  // La lógica del servidor
  handler: async ({ postId, increment }): Promise<{ likes: number }> => {
    const db = createDb(env.clients);

    // NOTA: No podemos usar "actions.getPostLike()" aqui porque
    // "actions" es un modulo virtual para el CLIENTE. En el servidor
    // debemos hacer la consulta directamente a la base de datos.
    const [existingPost] = await db
      .select()
      .from(Posts)
      .where(eq(Posts.id, postId));

    if (!existingPost) {
      // El post no existe, lo creamos con el primer like
      const newPost = {
        id: postId,
        title: humanizeSlug(postId),
        likes: increment,
      };

      await db.insert(Posts).values(newPost);
      return { likes: increment };
    }

    // El post existe, incrementamos los likes
    const currentLikes = existingPost.likes ?? 0;
    const newLikes = currentLikes + increment;

    await db
      .update(Posts)
      .set({ likes: newLikes })
      .where(eq(Posts.id, postId));

    return { likes: newLikes };
  },
});
