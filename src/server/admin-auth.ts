import type { AstroCookies } from 'astro';

export const ADMIN_USERNAME = 'adal';
export const ADMIN_PASSWORD = '@adalbonai123/.@';

const SESSION_COOKIE_NAME = 'adal_admin_session';
const SESSION_COOKIE_VALUE = 'authenticated';

export function isAdminAuthenticated(cookies: AstroCookies): boolean {
	return cookies.get(SESSION_COOKIE_NAME)?.value === SESSION_COOKIE_VALUE;
}

export function setAdminSession(cookies: AstroCookies): void {
	cookies.set(SESSION_COOKIE_NAME, SESSION_COOKIE_VALUE, {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'lax',
		path: '/',
		maxAge: 60 * 60 * 8,
	});
}

export function clearAdminSession(cookies: AstroCookies): void {
	cookies.delete(SESSION_COOKIE_NAME, {
		path: '/',
	});
}
