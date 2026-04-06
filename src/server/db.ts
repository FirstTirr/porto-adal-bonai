import { neon } from '@neondatabase/serverless';


type SqlQuery = <T = Record<string, any>[]>(
	strings: TemplateStringsArray,
	...values: Array<string | number | boolean | null | undefined>
) => Promise<T>;

export function getSql(): SqlQuery | null {
	const databaseUrl = process.env.DATABASE_URL || import.meta.env.DATABASE_URL;

	if (!databaseUrl) {
		return null;
	}

	return neon(databaseUrl) as unknown as SqlQuery;
}

