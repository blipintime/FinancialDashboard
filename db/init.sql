CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO users (name, email) VALUES
  ('Ada Lovelace',      'ada@example.com'),
  ('Alan Turing',       'alan@example.com'),
  ('Grace Hopper',      'grace@example.com'),
  ('Linus Torvalds',    'linus@example.com'),
  ('Margaret Hamilton', 'margaret@example.com')
ON CONFLICT (email) DO NOTHING;
