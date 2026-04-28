# astro-http

> Blog con Astro 6.x en modo SSR — Cloudflare Workers, Turso Database, Drizzle ORM, API endpoints y Content Collections.
>
> Parte del curso **"Astro: La Guía Completa"** impartido por [Fernando Herrera](https://fernando-herrera.com/) en [Udemy](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING).

Este proyecto parte del template oficial `blog` y se adapta para ejecutarse en modo **`server`** utilizando el adapter de **Cloudflare**. Incluye **Turso Database** con **Drizzle ORM** para persistencia tipada, endpoints REST en `src/pages/api/` y manejo de contenido con Content Collections.

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) **>= 22.12.0**
- [pnpm](https://pnpm.io/) (recomendado)

## 🏁 Primeros pasos

1. **Instalá las dependencias:**

   ```bash
   pnpm install
   ```

2. **Generá los tipos de TypeScript desde Wrangler:**

   ```bash
   pnpm g-types
   ```

3. **Configurá las variables de entorno:**

   Copiá el archivo de ejemplo:

   ```bash
   cp .env.example .env
   ```

   Completá `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` con los datos de tu base de datos Turso.

4. **Generá y aplicá las migraciones iniciales:**

   ```bash
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Levantá el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

   Abrí [http://localhost:4321](http://localhost:4321) en tu navegador.

## ¿Qué se practica aquí?

- **SSR con Astro:** Configuración de `output: 'server'` y el adapter `@astrojs/cloudflare`.
- **Turso Database:** Base de datos SQLite serverless distribuida por Turso (libSQL).
- **Drizzle ORM:** ORM type-safe para SQLite/Turso con sintaxis SQL-like.
- **Migrations:** Generación y aplicación de migraciones con `drizzle-kit`.
- **API Routes:** Endpoints REST en `src/pages/api/` para servir datos JSON.
- **Content Collections:** Manejo de posts en Markdown con esquemas tipados vía Zod.
- **Fuentes locales:** Uso del provider `fontProviders.local()` para cargar la fuente Atkinson sin dependencias externas.
- **Despliegue en Cloudflare:** Configuración de `wrangler.jsonc` para deploy en Workers.

## 🚀 Estructura del proyecto

```text
├── public/                     # Activos estáticos
├── src/
│   ├── assets/
│   │   └── fonts/              # Fuentes locales (Atkinson)
│   ├── components/             # Componentes Astro reutilizables
│   ├── content/
│   │   └── blog/               # Posts en Markdown / MDX
│   ├── db/                     # Drizzle ORM schema y migraciones
│   │   ├── index.ts            # Factory de Drizzle para Turso
│   │   ├── schema.ts           # Definición de tablas tipadas
│   │   └── migrations/         # Archivos SQL de migraciones
│   ├── layouts/                # Layouts de página
│   ├── pages/
│   │   ├── api/                # Endpoints de API
│   │   │   ├── clients/
│   │   │   │   ├── index.ts       # GET/POST /api/clients — listar/crear
│   │   │   │   └── [clientId].ts  # GET/PATCH/DELETE /api/clients/:id
│   │   │   ├── posts/
│   │   │   │   ├── index.ts    # GET /api/posts — listar posts
│   │   │   │   └── [slug].ts   # GET /api/posts/:slug — post por slug
│   │   │   └── get-person.json.ts
│   │   ├── blog/               # Rutas del blog
│   │   ├── about.astro
│   │   └── index.astro
│   ├── consts.ts               # Constantes globales
│   └── content.config.ts       # Definición de colecciones y schemas
├── astro.config.mjs
├── drizzle.config.ts           # Configuración de Drizzle Kit
├── package.json
├── tsconfig.json
├── wrangler.jsonc              # Configuración de Cloudflare Workers + Turso
└── README.md
```

## 🧞 Scripts disponibles

| Comando            | Acción                                                |
| :----------------- | :---------------------------------------------------- |
| `pnpm install`     | Instala las dependencias                              |
| `pnpm dev`         | Levanta el servidor de desarrollo en `localhost:4321` |
| `pnpm build`       | Compila el sitio para producción en `./dist/`         |
| `pnpm preview`     | Previsualiza la build localmente                      |
| `pnpm astro ...`   | Ejecuta comandos del CLI de Astro                     |
| `pnpm g-types`     | Genera tipos de TypeScript desde wrangler             |
| `pnpm db:generate` | Genera migraciones SQL con Drizzle Kit                |
| `pnpm db:migrate`  | Aplica migraciones pendientes                         |
| `pnpm db:studio`   | Abre Drizzle Studio para explorar la base de datos    |

## 🔌 Endpoints de API

| Ruta                     | Método | Descripción                                                    |
| :----------------------- | :----- | :------------------------------------------------------------- |
| `/api/clients`           | GET    | Lista todos los clientes desde Turso                           |
| `/api/clients`           | POST   | Crea un nuevo cliente en Turso                                 |
| `/api/clients/<id>`      | GET    | Obtiene un cliente específico por ID                           |
| `/api/clients/<id>`      | PATCH  | Actualiza un cliente existente                                 |
| `/api/clients/<id>`      | DELETE | Elimina un cliente                                             |
| `/api/posts`             | GET    | Lista todos los posts del blog ordenados por fecha descendente |
| `/api/posts?slug=<slug>` | GET    | Obtiene un post específico por query param                     |
| `/api/posts/<slug>`      | GET    | Obtiene un post específico por parámetro de ruta               |
| `/api/get-person.json`   | GET    | Endpoint de ejemplo que retorna un JSON                        |

## ⚙️ Configuración clave

### Astro + Cloudflare

El archivo `astro.config.mjs` está configurado para **modo servidor** con Cloudflare:

```js
output: 'server',
adapter: cloudflare(),
```

### Turso Database

Las credenciales se acceden mediante el módulo `cloudflare:workers`, que el adapter emula automáticamente en desarrollo cargando las variables del archivo `.env`:

```ts
import { env } from 'cloudflare:workers';
```

En producción, Cloudflare inyecta estos valores como bindings del Worker.

El archivo `wrangler.jsonc` tiene placeholders para desarrollo:

```json
"vars": {
  "TURSO_DATABASE_URL": "libsql://your-database.turso.io",
  "TURSO_AUTH_TOKEN": "your-auth-token"
}
```

> **Importante:** Para producción usá **Cloudflare Secrets** en lugar de `vars`:
> ```bash
> wrangler secret put TURSO_DATABASE_URL
> wrangler secret put TURSO_AUTH_TOKEN
> ```

### Patrón Factory para la base de datos

El cliente de Drizzle se crea mediante una **factory function** (`createDb`) que recibe las credenciales como parámetro:

```ts
// src/db/index.ts
export function createDb(env: TursoEnv) {
  const client = createClient({
    url: env.TURSO_DATABASE_URL,
    authToken: env.TURSO_AUTH_TOKEN,
  });
  return drizzle({ client });
}
```

En los endpoints se importa `env` directamente desde el módulo de Cloudflare. El adapter lo emula en desarrollo y carga automáticamente las variables del `.env`:

```ts
import { env } from 'cloudflare:workers';
import { createDb } from '@/db';

export const GET: APIRoute = async () => {
  const db = createDb(env);
  // ...
};
```

### Drizzle ORM

El schema se define en `src/db/schema.ts`:

```ts
export const clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});
```

## 🗄️ Flujo de trabajo con la base de datos

### 1. Generar migraciones (después de modificar schema.ts)

```bash
pnpm db:generate
```

Esto crea un archivo SQL en `drizzle/`.

### 2. Aplicar migraciones a Turso

```bash
pnpm db:migrate
```

### 3. Seedear datos de prueba

Usá el CLI de Turso o Drizzle Studio:

```bash
pnpm db:studio
```

## 📦 Dependencias principales

- `astro` — Framework web
- `@astrojs/cloudflare` — Adapter para despliegue en Cloudflare Workers
- `@astrojs/mdx` — Soporte para MDX
- `@astrojs/rss` — Generación de feeds RSS
- `@astrojs/sitemap` — Generación de sitemap
- `drizzle-orm` — ORM type-safe para SQLite/Turso
- `drizzle-kit` — CLI para generar y aplicar migraciones
- `sharp` — Optimización de imágenes
- `wrangler` — CLI de Cloudflare para deploy y tipos

> **Nota sobre versiones:** Las dependencias están **pinneadas a versiones exactas** (sin `^`) para evitar incompatibilidades sorpresa.

## 🚀 Despliegue

Este proyecto se despliega en **Cloudflare Workers**:

1. Asegurate de tener las credenciales configuradas como Secrets:

   ```bash
   wrangler secret put TURSO_DATABASE_URL
   wrangler secret put TURSO_AUTH_TOKEN
   ```

2. Aplicá migraciones en producción:

   ```bash
   pnpm db:migrate
   ```

3. Compilá la app:

   ```bash
   pnpm build
   ```

4. Publicá con Wrangler:
   ```bash
   npx wrangler deploy
   ```

> **Nota sobre dominio:** El archivo `wrangler.jsonc` ya tiene configurado el dominio personalizado `astro-http.db9.uk`. Si vas a desplegar tu propia versión, actualizá o eliminá esa configuración de `routes`.

## 👀 ¿Querés aprender más?

Este proyecto forma parte del curso completo de Astro en Udemy:

👉 **[Astro: La Guía Completa — Fernando Herrera](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING)**

También podés consultar la [documentación oficial de Astro](https://docs.astro.build) o unirte a su [Discord](https://astro.build/chat).
