import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createDb } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async () => {
  const db = createDb(env);
  const allClients = await db.select().from(clients).all();

  return Response.json(allClients);
};

export const POST: APIRoute = async ({ request }) => {
  const body = (await request.json()) as { name?: unknown; age?: unknown; isActive?: unknown };

  if (!body.name || typeof body.name !== 'string') {
    return Response.json({ message: 'name is required and must be a string.' }, { status: 400 });
  }

  if (typeof body.age !== 'number' || body.age < 0) {
    return Response.json({ message: 'age is required and must be a positive number' }, { status: 400 });
  }

  const db = createDb(env);
  const result = await db
    .insert(clients)
    .values({
      name: body.name,
      age: body.age,
      isActive: typeof body.isActive === 'boolean' ? body.isActive : true,
    })
    .returning();

  return Response.json(result[0], { status: 201 });
};

export const PATCH: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id || isNaN(Number(id))) {
    return Response.json({ message: 'id query param is required and must be a number' }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.age !== undefined) updateData.age = body.age;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  if (Object.keys(updateData).length === 0) {
    return Response.json({ message: 'No fields provided to update' }, { status: 400 });
  }

  const db = createDb(env);
  const updated = await db
    .update(clients)
    .set(updateData)
    .where(eq(clients.id, Number(id)))
    .returning();

  if (updated.length === 0) {
    return Response.json({ message: `Client with id ${id} not found` }, { status: 404 });
  }

  return Response.json(updated[0]);
};

export const DELETE: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const id = url.searchParams.get('id');

  if (!id || isNaN(Number(id))) {
    return Response.json({ message: 'id query param is required and must be a number' }, { status: 400 });
  }

  const db = createDb(env);
  const deleted = await db
    .delete(clients)
    .where(eq(clients.id, Number(id)))
    .returning();

  if (deleted.length === 0) {
    return Response.json({ message: `Client with id ${id} not found` }, { status: 404 });
  }

  return Response.json(deleted[0]);
};
