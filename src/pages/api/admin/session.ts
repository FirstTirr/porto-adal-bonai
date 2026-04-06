import type { APIRoute } from 'astro';
import { isAdminAuthenticated } from '../../../server/admin-auth';

export const GET: APIRoute = async ({ cookies }) => {
	return new Response(JSON.stringify({ authenticated: isAdminAuthenticated(cookies) }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
