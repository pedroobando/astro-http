# astro-http

> Blog con Astro 6.x en modo SSR — Cloudflare Workers, D1 Database, Drizzle ORM, API endpoints y Content Collections.
>
> Parte del curso **"Astro: La Guía Completa"** impartido por [Fernando Herrera](https://fernando-herrera.com/) en [Udemy](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING).

Este proyecto parte del template oficial `blog` y se adapta para ejecutarse en modo **`server`** utilizando el adapter de **Cloudflare**. Incluye **D1 Database** con **Drizzle ORM** para persistencia tipada, endpoints REST en `src/pages/api/` y manejo de contenido con Content Collections.

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

3. **Creá la base de datos local (solo la primera vez):**

   ```bash
   npx wrangler d1 create clients
   ```

   Copiá el `database_id` que te devuelve y pegalo en `wrangler.jsonc`.

4. **Generá y aplicá las migraciones iniciales:**

   ```bash
   pnpm db:generate
   npx wrangler d1 execute clients --local --file=./src/db/migrations/0000_xxx.sql
   ```

5. **Levantá el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

   Abrí [http://localhost:4321](http://localhost:4321) en tu navegador.

## ¿Qué se practica aquí?

- **SSR con Astro:** Configuración de `output: 'server'` y el adapter `@astrojs/cloudflare`.
- **D1 Database:** Base de datos SQLite serverless nativa de Cloudflare.
- **Drizzle ORM:** ORM type-safe para SQLite/D1 con sintaxis SQL-like.
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
│   │   ├── index.ts            # Cliente de Drizzle para D1
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
├── wrangler.jsonc              # Configuración de Cloudflare Workers + D1
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
| `/api/clients`           | GET    | Lista todos los clientes desde D1                              |
| `/api/clients`           | POST   | Crea un nuevo cliente en D1                                    |
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

### D1 Database

La base de datos está configurada en `wrangler.jsonc`:

```json
"d1_databases": [
  {
    "binding": "clients",
    "database_name": "clients",
    "database_id": "cea973db-382f-454e-a99e-935fc090e25b"
  }
]
```

> **Nota:** Si estás forkeando este proyecto, reemplazá el `database_id` por el de tu propia base de datos D1.

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

Esto crea un archivo SQL en `src/db/migrations/`.

### 2. Aplicar migraciones a D1 local

```bash
npx wrangler d1 execute clients --local --file=./src/db/migrations/0000_xxx.sql
```

### 3. Seedear datos de prueba

```bash
npx wrangler d1 execute clients --local --command="INSERT INTO clients (name, age, is_active) VALUES ('Kasim', 32, 1)"
```

### 4. Para producción

```bash
npx wrangler d1 execute clients --remote --file=./src/db/migrations/0000_xxx.sql
```

## 📦 Dependencias principales

- `astro` — Framework web
- `@astrojs/cloudflare` — Adapter para despliegue en Cloudflare Workers
- `@astrojs/mdx` — Soporte para MDX
- `@astrojs/rss` — Generación de feeds RSS
- `@astrojs/sitemap` — Generación de sitemap
- `drizzle-orm` — ORM type-safe para SQLite/D1
- `drizzle-kit` — CLI para generar y aplicar migraciones
- `sharp` — Optimización de imágenes
- `wrangler` — CLI de Cloudflare para deploy y tipos

> **Nota sobre versiones:** Las dependencias están **pinneadas a versiones exactas** (sin `^`) para evitar incompatibilidades sorpresa.

## 🚀 Despliegue

Este proyecto se despliega en **Cloudflare Workers**:

1. Aplicá migraciones en producción:

   ```bash
   npx wrangler d1 execute clients --remote --file=./src/db/migrations/0000_xxx.sql
   ```

2. Compilá la app:

   ```bash
   pnpm build
   ```

3. Publicá con Wrangler:
   ```bash
   npx wrangler deploy
   ```

> **Nota sobre dominio:** El archivo `wrangler.jsonc` ya tiene configurado el dominio personalizado `astro-http.db9.uk`. Si vas a desplegar tu propia versión, actualizá o eliminá esa configuración de `routes`.

## 👀 ¿Querés aprender más?

Este proyecto forma parte del curso completo de Astro en Udemy:

👉 **[Astro: La Guía Completa — Fernando Herrera](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING)**

También podés consultar la [documentación oficial de Astro](https://docs.astro.build) o unirte a su [Discord](https://astro.build/chat).
