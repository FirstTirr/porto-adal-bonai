import { getSql } from './db';

export async function getSettings() {
    const sql = getSql();
    if (!sql) return {};
    
    const rows = await sql`SELECT key, value FROM settings`;
    const settings: Record<string, string> = {};
    for (const row of rows) {
        settings[row.key] = row.value;
    }
    return settings;
}

export async function saveSettings(settings: Record<string, string>) {
    const sql = getSql();
    if (!sql) return;
    
    for (const [key, value] of Object.entries(settings)) {
        await sql`
            INSERT INTO settings (key, value) VALUES (${key}, ${value})
            ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
        `;
    }
}
