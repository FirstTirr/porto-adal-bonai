import 'dotenv/config';
import { neon } from '@neondatabase/serverless';
import fs from 'fs';

async function setup() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    console.error('DATABASE_URL is missing in .env');
    process.exit(1);
  }

  const sql = neon(databaseUrl);
  const schema = fs.readFileSync('db/schema.sql', 'utf8');

  console.log('Running database schema...');
  
  await sql`CREATE TABLE IF NOT EXISTS projects (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	description TEXT,
	image_url TEXT,
	project_url TEXT,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  await sql`CREATE TABLE IF NOT EXISTS articles (
	id SERIAL PRIMARY KEY,
	title TEXT NOT NULL,
	slug TEXT NOT NULL UNIQUE,
	excerpt TEXT NOT NULL,
	content TEXT NOT NULL,
	thumbnail_url TEXT NOT NULL,
	created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );`;

  console.log('Database setup complete!');
}

setup().catch(console.error);
