import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
	const formData = await request.formData();
	const file = formData.get('file');

	if (!(file instanceof File)) {
		return new Response(JSON.stringify({ error: 'file is required' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
		return new Response(JSON.stringify({ error: 'only jpg, png, or webp allowed' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	if (file.size > MAX_IMAGE_SIZE_BYTES) {
		return new Response(JSON.stringify({ error: 'max file size is 5MB' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const fileExt = file.name.split('.').pop() || 'jpg';
	const safeName = `${Date.now()}-${crypto.randomUUID()}.${fileExt}`;

	const blob = await put(safeName, file, {
		access: 'public',
		addRandomSuffix: false,
	});

	return new Response(JSON.stringify({ url: blob.url }), {
		headers: { 'Content-Type': 'application/json' },
	});
};
