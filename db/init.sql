CREATE TABLE IF NOT EXISTS users (
  id          SERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  email       TEXT NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Added later for JWT auth. Nullable so old seed rows survive;
-- those rows have no password and cannot log in until updated.
ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash TEXT;

INSERT INTO users (name, email) VALUES
  ('Ada Lovelace',      'ada@example.com'),
  ('Alan Turing',       'alan@example.com'),
  ('Grace Hopper',      'grace@example.com'),
  ('Linus Torvalds',    'linus@example.com'),
  ('Margaret Hamilton', 'margaret@example.com')
ON CONFLICT (email) DO NOTHING;
