import { getSql } from './db';

export type Article = {
	id: number;
	title: string;
	slug: string;
	excerpt: string;
	content: string;
	thumbnail_url: string;
	created_at: string;
};

function slugify(value: string): string {
	return value
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9\s-]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-');
}

async function uniqueSlug(title: string): Promise<string> {
	const sql = getSql();

	if (!sql) {
		return `artikel-${Date.now()}`;
	}

	const base = slugify(title) || `artikel-${Date.now()}`;
	const rows = await sql<{ slug: string }[]>`
		SELECT slug FROM articles WHERE slug = ${base} OR slug LIKE ${`${base}-%`}
	`;

	if (rows.length === 0) {
		return base;
	}

	const existing = new Set(rows.map((item) => item.slug));
	let count = 1;
	let candidate = `${base}-${count}`;

	while (existing.has(candidate)) {
		count += 1;
		candidate = `${base}-${count}`;
	}

	return candidate;
}

export async function getArticles(): Promise<Article[]> {
	const sql = getSql();

	if (!sql) {
		return [];
	}

	return sql<Article[]>`
		SELECT id, title, slug, excerpt, content, thumbnail_url, created_at
		FROM articles
		ORDER BY created_at DESC
	`;
}

export async function getArticleBySlug(slug: string): Promise<Article | null> {
	const sql = getSql();

	if (!sql) {
		return null;
	}

	const [article] = await sql<Article[]>`
		SELECT id, title, slug, excerpt, content, thumbnail_url, created_at
		FROM articles
		WHERE slug = ${slug}
		LIMIT 1
	`;

	return article ?? null;
}

export async function createArticle(input: {
	title: string;
	excerpt: string;
	content: string;
	thumbnailUrl: string;
}): Promise<Article> {
	const sql = getSql();

	if (!sql) {
		throw new Error('DATABASE_URL is missing. Set it in your environment variables.');
	}

	const slug = await uniqueSlug(input.title);

	const [article] = await sql<Article[]>`
		INSERT INTO articles (title, slug, excerpt, content, thumbnail_url)
		VALUES (${input.title}, ${slug}, ${input.excerpt}, ${input.content}, ${input.thumbnailUrl})
		RETURNING id, title, slug, excerpt, content, thumbnail_url, created_at
	`;

	return article;
}

export async function updateArticle(input: {
	id: number;
	title: string;
	excerpt: string;
	content: string;
	thumbnailUrl: string;
}): Promise<Article | null> {
	const sql = getSql();

	if (!sql) {
		throw new Error('DATABASE_URL is missing. Set it in your environment variables.');
	}

	const [article] = await sql<Article[]>`
		UPDATE articles
		SET title = ${input.title},
			excerpt = ${input.excerpt},
			content = ${input.content},
			thumbnail_url = ${input.thumbnailUrl}
		WHERE id = ${input.id}
		RETURNING id, title, slug, excerpt, content, thumbnail_url, created_at
	`;

	return article ?? null;
}

export async function deleteArticle(id: number): Promise<void> {
	const sql = getSql();

	if (!sql) {
		throw new Error('DATABASE_URL is missing. Set it in your environment variables.');
	}

	await sql`DELETE FROM articles WHERE id = ${id}`;
}
