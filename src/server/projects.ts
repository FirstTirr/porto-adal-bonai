import { sql } from './db';

export type Project = {
	id: number;
	title: string;
	description: string | null;
	image_url: string | null;
	project_url: string | null;
	created_at: string;
};

export async function getProjects(): Promise<Project[]> {
	return sql<Project[]>`
		SELECT id, title, description, image_url, project_url, created_at
		FROM projects
		ORDER BY created_at DESC
	`;
}

export async function createProject(input: {
	title: string;
	description?: string;
	imageUrl?: string;
	projectUrl?: string;
}): Promise<Project> {
	const [project] = await sql<Project[]>`
		INSERT INTO projects (title, description, image_url, project_url)
		VALUES (${input.title}, ${input.description ?? null}, ${input.imageUrl ?? null}, ${input.projectUrl ?? null})
		RETURNING id, title, description, image_url, project_url, created_at
	`;

	return project;
}

export async function deleteProject(id: number): Promise<void> {
	await sql`DELETE FROM projects WHERE id = ${id}`;
}
