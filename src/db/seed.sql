-- Seed data for local D1 database
-- Auto-generated from src/content/blog/
-- Run with: pnpm db:seed

-- Clean existing data to avoid duplicates
DELETE FROM clients;
DELETE FROM posts;

-- Clients
INSERT INTO clients (name, age, is_active) VALUES
  ('Alice Johnson', 28, 1),
  ('Bob Smith', 34, 1),
  ('Charlie Brown', 22, 0),
  ('Diana Prince', 30, 1),
  ('Evan Wright', 45, 1);

-- Posts (titles and slugs from src/content/blog/)
INSERT INTO posts (id, title, likes) VALUES
  ('first-post', 'First post', 3),
  ('markdown-style-guide', 'Markdown Style Guide', 6),
  ('second-post', 'Second post', 3),
  ('third-post', 'Third post', 4),
  ('using-mdx', 'Using MDX', 9);
