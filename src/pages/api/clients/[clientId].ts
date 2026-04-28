import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { createDb } from '@/db';
import { clients } from '@/db/schema';
import { eq } from 'drizzle-orm';

export const GET: APIRoute = async ({ params }) => {
  const { clientId } = params;

  if (!clientId || isNaN(Number(clientId))) {
    return Response.json({ message: 'clientId is required and must be a number' }, { status: 400 });
  }

  const db = createDb(env.clients);
  const result = await db
    .select()
    .from(clients)
    .where(eq(clients.id, Number(clientId)))
    .all();

  if (result.length === 0) {
    return Response.json({ message: `Client with id ${clientId} not found` }, { status: 404 });
  }

  return Response.json(result[0]);
};

export const PATCH: APIRoute = async ({ params, request }) => {
  const { clientId } = params;

  if (!clientId || isNaN(Number(clientId))) {
    return Response.json({ message: 'clientId is required and must be a number' }, { status: 400 });
  }

  const body = (await request.json()) as Record<string, unknown>;

  const updateData: Record<string, unknown> = {};
  if (body.name !== undefined) updateData.name = body.name;
  if (body.age !== undefined) updateData.age = body.age;
  if (body.isActive !== undefined) updateData.isActive = body.isActive;

  if (Object.keys(updateData).length === 0) {
    return Response.json({ message: 'No fields provided to update.' }, { status: 400 });
  }

  const db = createDb(env.clients);
  const updated = await db
    .update(clients)
    .set(updateData)
    .where(eq(clients.id, Number(clientId)))
    .returning();

  if (updated.length === 0) {
    return Response.json({ message: `Client with id ${clientId} not found` }, { status: 404 });
  }

  return Response.json(updated[0]);
};

export const DELETE: APIRoute = async ({ params }) => {
  const { clientId } = params;

  if (!clientId || isNaN(Number(clientId))) {
    return Response.json({ message: 'clientId is required and must be a number' }, { status: 400 });
  }

  const db = createDb(env.clients);
  const deleted = await db
    .delete(clients)
    .where(eq(clients.id, Number(clientId)))
    .returning();

  if (deleted.length === 0) {
    return Response.json({ message: `Client with id ${clientId} not found` }, { status: 404 });
  }

  return Response.json(deleted[0]);
};
