import type { APIRoute } from 'astro';
import { createProject, deleteProject, getProjects } from '../../server/projects';

export const GET: APIRoute = async () => {
	const projects = await getProjects();

	return new Response(JSON.stringify(projects), {
		headers: { 'Content-Type': 'application/json' },
	});
};

export const POST: APIRoute = async ({ request }) => {
	const body = await request.json().catch(() => null);

	if (!body || typeof body.title !== 'string' || body.title.trim().length === 0) {
		return new Response(JSON.stringify({ error: 'title is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const project = await createProject({
		title: body.title.trim(),
		description: typeof body.description === 'string' ? body.description.trim() : undefined,
		imageUrl: typeof body.imageUrl === 'string' ? body.imageUrl.trim() : undefined,
		projectUrl: typeof body.projectUrl === 'string' ? body.projectUrl.trim() : undefined,
	});

	return new Response(JSON.stringify(project), {
		status: 201,
		headers: { 'Content-Type': 'application/json' },
	});
};

export const DELETE: APIRoute = async ({ request }) => {
	const body = await request.json().catch(() => null);
	const id = Number(body?.id);

	if (!Number.isInteger(id) || id <= 0) {
		return new Response(JSON.stringify({ error: 'invalid id' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	await deleteProject(id);

	return new Response(null, { status: 204 });
};
