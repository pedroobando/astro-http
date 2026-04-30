-- Seed data for local D1 database
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

-- Posts (titles from src/content/blog/)
INSERT INTO posts (title, likes) VALUES
  ('First post', 12),
  ('Markdown Style Guide', 34),
  ('Second post', 8),
  ('Third post', 21),
  ('Using MDX', 45);
