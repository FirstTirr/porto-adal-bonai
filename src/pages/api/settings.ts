import { saveSettings } from '../../server/settings.ts';
import { isAdminAuthenticated } from '../../server/admin-auth.ts';

export const POST = async ({ request, cookies }) => {
    if (!isAdminAuthenticated(cookies)) {
        return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
    }
    try {
        const data = await request.json();
        await saveSettings(data);
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error('Save settings error:', error);
        return new Response(JSON.stringify({ error: 'Internal Server Error' }), { status: 500 });
    }
}
