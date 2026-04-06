CREATE TABLE IF NOT EXISTS projects (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	image_url TEXT,
	project_url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
