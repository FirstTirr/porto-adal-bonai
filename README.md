# Portfolio Adal Bonai

Website portfolio bertema petualangan & kesehatan, dengan blog/artikel dynamic routing.

## Stack

- Frontend: Astro
- Backend: Astro API Routes (serverless)
- Database: Neon PostgreSQL
- Upload gambar: Vercel Blob

## Fitur

- Halaman beranda bertema petualangan & kesehatan
- Section **About Adal Bonai**
- Daftar blog/artikel di beranda
- Dynamic route artikel di `/blog/[slug]`
- Admin login
- CRUD artikel (thumbnail wajib)

## Kredensial Admin (sesuai request)

- Username: `adal`
- Password: `@adalbonai123/.@`

## Letak File Penting

- `src/pages/index.astro` → UI portfolio + list artikel
- `src/pages/blog/[slug].astro` → halaman detail artikel (dynamic routing)
- `src/pages/admin.astro` → UI login admin + CRUD artikel
- `src/pages/api/admin/login.ts` → login admin
- `src/pages/api/admin/logout.ts` → logout admin
- `src/pages/api/articles.ts` → API CRUD artikel
- `src/pages/api/upload.ts` → upload thumbnail ke Blob
- `src/server/articles.ts` → query artikel
- `src/server/admin-auth.ts` → session auth admin
- `db/schema.sql` → tabel `projects` dan `articles`

## Setup Step by Step

1. Install dependency

   ```bash
   npm install
   ```

2. Siapkan environment lokal

   ```bash
   cp .env.example .env
   ```

   Isi `.env`:
   - `DATABASE_URL`
   - `BLOB_READ_WRITE_TOKEN`

3. Jalankan schema SQL di Neon

   - Buka Neon SQL Editor
   - Jalankan isi file `db/schema.sql`

4. Jalankan lokal

   ```bash
   npm run dev
   ```

5. Deploy ke Vercel

   - Import project repo ini ke Vercel
   - Tambahkan env yang sama di Vercel Project Settings:
     - `DATABASE_URL`
     - `BLOB_READ_WRITE_TOKEN`

## Catatan Deploy

- Upload API menerima `jpg/png/webp` maksimal 5MB.
- Endpoint upload & CRUD artikel butuh session admin login.
