# Portfolio Astro + Neon + Vercel Blob

Stack yang dipakai:

- Frontend: Astro
- Backend: Astro API Routes (serverless, cocok di Vercel)
- Database: Neon PostgreSQL
- Upload Gambar: Vercel Blob

## Struktur Penting

- `src/pages/index.astro` → halaman portfolio publik
- `src/pages/admin.astro` → halaman admin (tambah/hapus project)
- `src/pages/api/projects.ts` → API CRUD project
- `src/pages/api/upload.ts` → API upload file ke Vercel Blob
- `src/server/db.ts` → koneksi Neon
- `src/server/projects.ts` → query database
- `db/schema.sql` → schema tabel `projects`
- `.env.example` → daftar environment variables

## Step by Step Setup

1. **Install dependency**

	```bash
	npm install
	```

2. **Buat database di Neon**

	- Ambil connection string dari Neon dashboard.
	- Jalankan SQL di `db/schema.sql`.

3. **Buat Vercel Blob token**

	- Di Vercel dashboard, buka project Anda.
	- Masuk ke Storage → Blob → buat Read/Write Token.

4. **Set environment variables lokal**

	- Copy file:

	  ```bash
	  cp .env.example .env
	  ```

	- Isi value berikut di `.env`:
	  - `DATABASE_URL`
	  - `BLOB_READ_WRITE_TOKEN`

5. **Jalankan lokal**

	```bash
	npm run dev
	```

	- Portfolio publik: `http://localhost:4321/`
	- Admin: `http://localhost:4321/admin`

6. **Deploy ke Vercel**

	- Push repo ke GitHub/GitLab.
	- Import project di Vercel.
	- Tambahkan env yang sama di Vercel Project Settings → Environment Variables:
	  - `DATABASE_URL`
	  - `BLOB_READ_WRITE_TOKEN`
	- Deploy.

## Cara Pakai Admin

1. Buka `/admin`.
2. Isi judul, deskripsi, link project.
3. Pilih gambar (opsional).
4. Klik **Simpan Project**.
5. Data tampil di halaman `/`.

## Catatan

- Validasi upload: hanya `jpg/png/webp`, maksimal 5MB.
- API upload menyimpan gambar sebagai public URL di Vercel Blob.
- API dan halaman sudah cocok untuk runtime serverless di Vercel.

# porto-adal-bonai
