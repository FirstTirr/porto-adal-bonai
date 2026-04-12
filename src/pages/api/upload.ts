import type { APIRoute } from 'astro';
import { put } from '@vercel/blob';
import { isAdminAuthenticated } from '../../server/admin-auth';
import sharp from 'sharp';

const MAX_IMAGE_SIZE_BYTES = 10 * 1024 * 1024; // 10MB input max

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

        if (!file.type.startsWith('image/')) {
                return new Response(JSON.stringify({ error: 'hanya file gambar yang diizinkan' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                });
        }

        if (file.size > MAX_IMAGE_SIZE_BYTES) {
                return new Response(JSON.stringify({ error: 'ukuran file original maksimal 10MB' }), {
                        status: 400,
                        headers: { 'Content-Type': 'application/json' },
                });
        }

        let buffer;
        try {
                const arrayBuffer = await file.arrayBuffer();
                const inputBuffer = Buffer.from(arrayBuffer);

                // Convert to WebP, shrink proportionally to max width/height 1920px and quality 80 
                // which almost guarantees < 1MB results.
                buffer = await sharp(inputBuffer)
                        .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })
                        .webp({ quality: 80 })
                        .toBuffer();

                // Fallback check if it's still over 1MB, lower the quality and resize further
                if (buffer.length > 1024 * 1024) {
                        buffer = await sharp(inputBuffer)
                                .resize({ width: 1080, height: 1080, fit: 'inside', withoutEnlargement: true })
                                .webp({ quality: 60 })
                                .toBuffer();
                }
        } catch (error) {
                return new Response(JSON.stringify({ error: 'gagal memproses konversi gambar ke webp' }), {
                        status: 500,
                        headers: { 'Content-Type': 'application/json' },
                });
        }

        const safeName = `${Date.now()}-${crypto.randomUUID()}.webp`;

        try {
                const blob = await put(safeName, buffer, {
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
