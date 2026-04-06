import type { APIRoute } from 'astro';
import { clearAdminSession } from '../../../server/admin-auth';

export const POST: APIRoute = async ({ cookies }) => {
	clearAdminSession(cookies);

	return new Response(JSON.stringify({ ok: true }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
