import { getSql } from '../../server/db';
export const POST = async ({ request }) => {
    try {
        const sql = getSql();
        const body = await request.json();
        const res = await sql`SELECT ${body.val} as val`;
        return new Response(JSON.stringify({ ok: true, res }));
    } catch (e) {
        return new Response(JSON.stringify({ error: String(e), stack: e.stack }));
    }
}
