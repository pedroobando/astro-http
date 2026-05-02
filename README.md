# astro-http

> Blog con Astro 6.x en modo SSR — Cloudflare Workers, D1 Database, Drizzle ORM, API endpoints, **Astro Actions** y Content Collections.
>
> Parte del curso **"Astro: La Guia Completa"** impartido por [Fernando Herrera](https://fernando-herrera.com/) en [Udemy](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING).

Este proyecto parte del template oficial `blog` y se adapta para ejecutarse en modo **`server`** utilizando el adapter de **Cloudflare**. Incluye **D1 Database** con **Drizzle ORM** para persistencia tipada, endpoints REST en `src/pages/api/`, **Astro Actions** para comunicacion type-safe cliente-servidor, y manejo de contenido con Content Collections.

## 📋 Requisitos previos

- [Node.js](https://nodejs.org/) **>= 22.12.0**
- [pnpm](https://pnpm.io/) (recomendado)

## 🏁 Primeros pasos

1. **Instala las dependencias:**

   ```bash
   pnpm install
   ```

2. **Genera los tipos de TypeScript desde Wrangler:**

   ```bash
   pnpm g-types
   ```

3. **Crea la base de datos local (solo la primera vez):**

   ```bash
   npx wrangler d1 create clients
   ```

   Copia el `database_id` que te devuelve y pegalo en `wrangler.jsonc`.

4. **Genera y aplica las migraciones iniciales:**

   ```bash
   pnpm db:generate
   npx wrangler d1 execute clients --local --file=./drizzle/0000_xxx.sql
   ```

5. **Levanta el servidor de desarrollo:**

   ```bash
   pnpm dev
   ```

   Abri [http://localhost:4321](http://localhost:4321) en tu navegador.

## ¿Que se practica aqui?

- **SSR con Astro:** Configuracion de `output: 'server'` y el adapter `@astrojs/cloudflare`.
- **D1 Database:** Base de datos SQLite serverless nativa de Cloudflare.
- **Drizzle ORM:** ORM type-safe para SQLite/D1 con sintaxis SQL-like.
- **Migrations:** Generacion y aplicacion de migraciones con `drizzle-kit`.
- **API Routes:** Endpoints REST en `src/pages/api/` para servir datos JSON.
- **Astro Actions:** Funciones type-safe que reemplazan `fetch()` manual para comunicacion cliente-servidor interna.
- **Content Collections:** Manejo de posts en Markdown con esquemas tipados via Zod.
- **Fuentes locales:** Uso del provider `fontProviders.local()` para cargar la fuente Atkinson sin dependencias externas.
- **Despliegue en Cloudflare:** Configuracion de `wrangler.jsonc` para deploy en Workers.

## 🚀 Estructura del proyecto

```text
├── public/                     # Activos estaticos
├── src/
│   ├── actions/                # Astro Actions (funciones type-safe cliente-servidor)
│   │   ├── index.ts            # Registro de todas las actions
│   │   ├── greetings/          # Actions de ejemplo (getGreeting)
│   │   └── posts/              # Actions para posts (getPostLike, updLike)
│   ├── assets/
│   │   └── fonts/              # Fuentes locales (Atkinson)
│   ├── components/             # Componentes Astro y React
│   │   └── likes/              # Componentes de likes (2 enfoques didacticos)
│   │       ├── LikeCounter.tsx         # Enfoque tradicional con fetch + API Routes
│   │       └── LikeCounterAction.tsx   # Enfoque moderno con Astro Actions
│   ├── content/
│   │   └── blog/               # Posts en Markdown / MDX
│   ├── db/                     # Drizzle ORM schema y seed
│   │   ├── index.ts            # Cliente de Drizzle para D1
│   │   ├── schema.ts           # Definicion de tablas tipadas
│   │   └── seed.sql            # Datos de prueba para desarrollo local
│   ├── pages/
│   │   ├── api/                # Endpoints de API (REST tradicional)
│   │   │   ├── clients/
│   │   │   ├── posts/
│   │   │   └── likes/
│   │   └── blog/               # Rutas del blog
│   ├── utils/                  # Utilidades compartidas
│   ├── consts.ts               # Constantes globales
│   └── content.config.ts       # Definicion de colecciones y schemas
├── drizzle/                    # Archivos SQL de migraciones
├── scripts/                    # Scripts de utilidad
│   ├── generate-seed.ts        # Generador de seed SQL
│   └── migrate-remote.ts       # Aplicador de migraciones a D1 remota
├── astro.config.mjs
├── drizzle.config.ts           # Configuracion de Drizzle Kit
├── package.json
├── tsconfig.json
├── wrangler.jsonc              # Configuracion de Cloudflare Workers + D1
└── README.md
```

## 🧞 Scripts disponibles

| Comando                | Accion                                                  |
| :--------------------- | :------------------------------------------------------ |
| `pnpm install`         | Instala las dependencias                                |
| `pnpm dev`             | Levanta el servidor de desarrollo en `localhost:4321`  |
| `pnpm build`           | Compila el sitio para produccion en `./dist/`           |
| `pnpm preview`         | Previsualiza la build localmente                        |
| `pnpm astro ...`       | Ejecuta comandos del CLI de Astro                       |
| `pnpm g-types`         | Genera tipos de TypeScript desde wrangler               |
| `pnpm db:generate`     | Genera migraciones SQL con Drizzle Kit                  |
| `pnpm db:migrate`      | Aplica migraciones locales con Drizzle Kit              |
| `pnpm db:migrate:remote`| Aplica migraciones a D1 remota (Cloudflare)            |
| `pnpm db:studio`       | Abre Drizzle Studio para explorar la base de datos      |
| `pnpm db:seed`         | Inserta datos de prueba en la base de datos local       |
| `pnpm db:seed:remote`  | Inserta datos de prueba en la base de datos remota      |

## 🔌 Endpoints de API (REST Tradicional)

| Ruta                     | Metodo | Descripcion                                                    |
| :----------------------- | :----- | :------------------------------------------------------------- |
| `/api/clients`           | GET    | Lista todos los clientes desde D1                              |
| `/api/clients`           | POST   | Crea un nuevo cliente en D1                                    |
| `/api/clients/<id>`      | GET    | Obtiene un cliente especifico por ID                           |
| `/api/clients/<id>`      | PATCH  | Actualiza un cliente existente                                 |
| `/api/clients/<id>`      | DELETE | Elimina un cliente                                             |
| `/api/posts`             | GET    | Lista todos los posts del blog ordenados por fecha descendente |
| `/api/posts?slug=<slug>` | GET    | Obtiene un post especifico por query param                     |
| `/api/posts/<slug>`      | GET    | Obtiene un post especifico por parametro de ruta               |
| `/api/likes/<id>`        | GET    | Obtiene los likes de un post                                   |
| `/api/likes/<id>`        | PUT    | Incrementa los likes de un post                                |
| `/api/get-person.json`   | GET    | Endpoint de ejemplo que retorna un JSON                        |

## ⚡ Astro Actions (Type-Safe)

Las Actions son funciones de backend definidas en `src/actions/` que se llaman desde el cliente como funciones tipadas, **sin usar `fetch()` manual**.

### Actions disponibles

| Action                | Input                           | Retorno                      | Descripcion                          |
| :-------------------- | :------------------------------ | :--------------------------- | :----------------------------------- |
| `actions.getGreeting` | `{ name, age, isActive? }`      | `string`                     | Action de ejemplo con validacion Zod |
| `actions.getPostLike` | `postId: string`                | `{ likes: number, exist: boolean }` | Obtiene likes de un post             |
| `actions.updLike`     | `{ postId: string, increment: number }` | `{ likes: number }` | Incrementa likes de un post          |

### Uso en el cliente

```tsx
import { actions } from 'astro:actions';

// Una sola linea, type-safe, sin fetch ni JSON.parse
const { data, error } = await actions.updLike({ postId: 'my-post', increment: 1 });

if (error) {
  console.log(error.code); // "BAD_REQUEST", "UNAUTHORIZED", etc.
} else {
  console.log(data.likes); // TypeScript sabe que es number
}
```

### Comparacion: API Routes vs Actions

Este proyecto incluye **dos implementaciones del mismo feature** (boton de likes) para fines didacticos:

| Aspecto | `LikeCounter.tsx` (API Routes) | `LikeCounterAction.tsx` (Actions) |
| :------ | :----------------------------- | :-------------------------------- |
| **Comunicacion** | `fetch()` manual a `/api/likes/...` | `actions.updLike({...})` |
| **Validacion** | Manual en el endpoint | Automatica con Zod |
| **Type-safety** | Manual con `as` | Automatica end-to-end |
| **Boilerplate** | Alto (fetch, headers, JSON) | Nulo |
| **Errores** | Mezclados en un try/catch | Separados (`error.code`) |
| **Cuando usar** | APIs publicas, webhooks, archivos | Formularios, CRUD interno |

## ⚙️ Configuracion clave

### Astro + Cloudflare

El archivo `astro.config.mjs` esta configurado para **modo servidor** con Cloudflare:

```js
output: 'server',
adapter: cloudflare(),
```

### D1 Database

La base de datos esta configurada en `wrangler.jsonc`:

```json
"d1_databases": [
  {
    "binding": "clients",
    "database_name": "clients",
    "database_id": "cea973db-382f-454e-a99e-935fc090e25b"
  }
]
```

> **Nota:** Si estas forkeando este proyecto, reemplaza el `database_id` por el de tu propia base de datos D1.

### Drizzle ORM

El schema se define en `src/db/schema.ts`:

```ts
export const Clients = sqliteTable('clients', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  age: integer('age').notNull(),
  isActive: integer('is_active', { mode: 'boolean' }).default(true),
  createdAt: integer('created_at', { mode: 'timestamp' }).$defaultFn(() => new Date()),
});

export const Posts = sqliteTable('posts', {
  id: text('id').primaryKey().unique(),
  title: text('title').notNull(),
  likes: integer('likes').default(0),
});
```

## 🗄️ Flujo de trabajo con la base de datos

### 1. Generar migraciones (despues de modificar schema.ts)

```bash
pnpm db:generate
```

Esto crea un archivo SQL en `./drizzle/`.

### 2. Aplicar migraciones a D1 local

```bash
npx wrangler d1 execute clients --local --file=./drizzle/0000_xxx.sql
```

### 3. Seedear datos de prueba (local)

```bash
pnpm db:seed
```

Esto ejecuta `src/db/seed.sql` en la copia local de D1, limpiando las tablas antes de insertar para evitar duplicados.

### 4. Aplicar migraciones a D1 remota (produccion)

```bash
pnpm db:migrate:remote
```

Este script ejecuta **todos los archivos `.sql` de `./drizzle/`** contra tu base de datos remota en Cloudflare.

### 5. Seedear datos de prueba (remoto)

```bash
pnpm db:seed:remote
```

## 📦 Dependencias principales

- `astro` — Framework web
- `@astrojs/cloudflare` — Adapter para despliegue en Cloudflare Workers
- `@astrojs/mdx` — Soporte para MDX
- `@astrojs/rss` — Generacion de feeds RSS
- `@astrojs/sitemap` — Generacion de sitemap
- `@astrojs/react` — Integracion con React
- `drizzle-orm` — ORM type-safe para SQLite/D1
- `drizzle-kit` — CLI para generar y aplicar migraciones
- `canvas-confetti` — Animaciones de confetti para el boton de likes
- `sharp` — Optimizacion de imagenes
- `wrangler` — CLI de Cloudflare para deploy y tipos

> **Nota sobre versiones:** Las dependencias estan **pinneadas a versiones exactas** (sin `^`) para evitar incompatibilidades sorpresa.

## 🚀 Despliegue

Este proyecto se despliega en **Cloudflare Workers**:

1. Aplica migraciones en produccion:

   ```bash
   pnpm db:migrate:remote
   ```

2. Compila la app:

   ```bash
   pnpm build
   ```

3. Publica con Wrangler:
   ```bash
   npx wrangler deploy
   ```

> **Nota sobre dominio:** El archivo `wrangler.jsonc` ya tiene configurado el dominio personalizado `astro-http.db9.uk`. Si vas a desplegar tu propia version, actualiza o elimina esa configuracion de `routes`.

## 👀 ¿Queres aprender mas?

Este proyecto forma parte del curso completo de Astro en Udemy:

👉 **[Astro: La Guia Completa — Fernando Herrera](https://www.udemy.com/course/astro-guia-completa/?couponCode=KEEPLEARNING)**

Tambien podes consultar la [documentacion oficial de Astro](https://docs.astro.build) o unirte a su [Discord](https://astro.build/chat).
