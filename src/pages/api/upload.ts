import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { isAdminAuthenticated } from '../../server/admin-auth';

const ALLOWED_IMAGE_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024;

function getBlobToken(): string | null {
	const importMetaEnv = (import.meta as unknown as {
		env?: Record<string, string | undefined>;
	}).env;

	return (
		process.env.BLOB_READ_WRITE_TOKEN ||
		importMetaEnv?.BLOB_READ_WRITE_TOKEN ||
		process.env.NEXT_PUBLIC_BLOB_READ_WRITE_TOKEN ||
		process.env.VERCEL_BLOB_READ_WRITE_TOKEN ||
		null
	);
}

export const POST: APIRoute = async ({ request, cookies }) => {
	if (!isAdminAuthenticated(cookies)) {
		return new Response(JSON.stringify({ error: 'unauthorized' }), {
			status: 401,
			headers: { 'Content-Type': 'application/json' },
		});
	}

	const blobToken = getBlobToken();

	if (!blobToken) {
		return new Response(JSON.stringify({ error: 'BLOB_READ_WRITE_TOKEN is missing. Set it in your environment variables.' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}

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

	try {
		const blob = await put(safeName, file, {
			access: 'public',
			addRandomSuffix: false,
			token: blobToken,
		});

		return new Response(JSON.stringify({ url: blob.url }), {
			headers: { 'Content-Type': 'application/json' },
		});
	} catch (error) {
		const message = error instanceof Error ? error.message : 'Failed to upload to Vercel Blob';
		return new Response(JSON.stringify({ error: message }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' },
		});
	}
};
