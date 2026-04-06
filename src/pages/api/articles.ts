import type { APIRoute } from 'astro';
import {
	createArticle,
	deleteArticle,
	getArticles,
	updateArticle,
} from '../../server/articles';
import { isAdminAuthenticated } from '../../server/admin-auth';

export const GET: APIRoute = async () => {
	const articles = await getArticles();

	return new Response(JSON.stringify(articles), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export const POST: APIRoute = async ({ request, cookies }) => {
	if (!isAdminAuthenticated(cookies)) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const body = await request.json().catch(() => null);

	const title = typeof body?.title === 'string' ? body.title.trim() : '';
	const excerpt = typeof body?.excerpt === 'string' ? body.excerpt.trim() : '';
	const content = typeof body?.content === 'string' ? body.content.trim() : '';
	const thumbnailUrl = typeof body?.thumbnailUrl === 'string' ? body.thumbnailUrl.trim() : '';

	if (!title || !excerpt || !content || !thumbnailUrl) {
		return new Response(JSON.stringify({ error: 'title, excerpt, content, thumbnail wajib diisi' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const article = await createArticle({ title, excerpt, content, thumbnailUrl });

	return new Response(JSON.stringify(article), {
		status: 201,
		headers: { 'Content-Type': 'application/json' },
	});
};

export const PUT: APIRoute = async ({ request, cookies }) => {
	if (!isAdminAuthenticated(cookies)) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const body = await request.json().catch(() => null);
	const id = Number(body?.id);
	const title = typeof body?.title === 'string' ? body.title.trim() : '';
	const excerpt = typeof body?.excerpt === 'string' ? body.excerpt.trim() : '';
	const content = typeof body?.content === 'string' ? body.content.trim() : '';
	const thumbnailUrl = typeof body?.thumbnailUrl === 'string' ? body.thumbnailUrl.trim() : '';

	if (!Number.isInteger(id) || id <= 0 || !title || !excerpt || !content || !thumbnailUrl) {
		return new Response(JSON.stringify({ error: 'data tidak valid' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const article = await updateArticle({ id, title, excerpt, content, thumbnailUrl });

	if (!article) {
		return new Response(JSON.stringify({ error: 'article tidak ditemukan' }), {
			status: 404,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	return new Response(JSON.stringify(article), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export const DELETE: APIRoute = async ({ request, cookies }) => {
	if (!isAdminAuthenticated(cookies)) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const body = await request.json().catch(() => null);
	const id = Number(body?.id);

	if (!Number.isInteger(id) || id <= 0) {
		return new Response(JSON.stringify({ error: 'invalid id' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	await deleteArticle(id);

	return new Response(null, { status: 204 });
};
