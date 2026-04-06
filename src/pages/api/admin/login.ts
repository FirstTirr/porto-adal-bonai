import type { APIRoute } from 'astro';
import { ADMIN_PASSWORD, ADMIN_USERNAME, setAdminSession } from '../../../server/admin-auth';

export const POST: APIRoute = async ({ request, cookies }) => {
	const body = await request.json().catch(() => null);

	const username = typeof body?.username === 'string' ? body.username : '';
	const password = typeof body?.password === 'string' ? body.password : '';

	if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
		return new Response(JSON.stringify({ error: 'username atau password salah' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	setAdminSession(cookies);

	return new Response(JSON.stringify({ ok: true }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
