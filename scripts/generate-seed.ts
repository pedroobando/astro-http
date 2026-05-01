import fs from 'node:fs';
import path from 'node:path';

const blogDir = path.resolve('src/content/blog');
const seedPath = path.resolve('src/db/seed.sql');

function getBlogFiles(dir: string): string[] {
  return fs.readdirSync(dir).filter((f) => f.endsWith('.md') || f.endsWith('.mdx'));
}

function parseTitle(filePath: string): string {
  const content = fs.readFileSync(filePath, 'utf-8');
  const match = content.match(/^---\s*\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error(`No frontmatter found in ${filePath}`);
  }
  const titleMatch = match[1].match(/title:\s*(['"])(.*?)\1/);
  if (!titleMatch) {
    throw new Error(`No title found in frontmatter of ${filePath}`);
  }
  return titleMatch[2];
}

function escapeSqlString(value: string): string {
  return value.replace(/'/g, "''");
}

function generateSeed() {
  const files = getBlogFiles(blogDir);

  if (files.length === 0) {
    console.warn('⚠️ No blog posts found in src/content/blog/');
  }

  const posts = files.map((file) => {
    const id = file.replace(/\.(md|mdx)$/, '');
    const filePath = path.join(blogDir, file);
    const title = parseTitle(filePath);
    const likes = Math.floor(Math.random() * (9 - 3 + 1)) + 3; // 3 to 9 inclusive
    return { id, title, likes };
  });

  const clients = [
    { name: 'Alice Johnson', age: 28, isActive: 1 },
    { name: 'Bob Smith', age: 34, isActive: 1 },
    { name: 'Charlie Brown', age: 22, isActive: 0 },
    { name: 'Diana Prince', age: 30, isActive: 1 },
    { name: 'Evan Wright', age: 45, isActive: 1 },
  ];

  let sql = `-- Seed data for local D1 database\n`;
  sql += `-- Auto-generated from src/content/blog/\n`;
  sql += `-- Run with: pnpm db:seed\n\n`;
  sql += `-- Clean existing data to avoid duplicates\n`;
  sql += `DELETE FROM clients;\n`;
  sql += `DELETE FROM posts;\n\n`;

  sql += `-- Clients\n`;
  sql += `INSERT INTO clients (name, age, is_active) VALUES\n`;
  sql += clients.map((c) => `  ('${escapeSqlString(c.name)}', ${c.age}, ${c.isActive})`).join(',\n');
  sql += `;\n\n`;

  sql += `-- Posts (titles and slugs from src/content/blog/)\n`;
  sql += `INSERT INTO posts (id, title, likes) VALUES\n`;
  sql += posts.map((p) => `  ('${p.id}', '${escapeSqlString(p.title)}', ${p.likes})`).join(',\n');
  sql += `;\n`;

  fs.writeFileSync(seedPath, sql);
  console.log(`✅ Generated seed.sql with ${posts.length} posts`);
}

generateSeed();
