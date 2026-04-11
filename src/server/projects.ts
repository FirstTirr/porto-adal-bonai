import { getSql } from './db';

export type Project = {
	id: number;
	title: string;
	description: string | null;
	image_url: string | null;
	project_url: string | null;
	created_at: string;
};

export async function getProjects(): Promise<Project[]> {
	const sql = getSql();

	if (!sql) {
		return [];
	}

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
	const sql = getSql();

	if (!sql) {
		throw new Error('DATABASE_URL is missing. Set it in your environment variables.');
	}

	const [project] = await sql<Project[]>`
		INSERT INTO projects (title, description, image_url, project_url)
		VALUES (${input.title}, ${input.description ?? null}, ${input.imageUrl ?? null}, ${input.projectUrl ?? null})
		RETURNING id, title, description, image_url, project_url, created_at
	`;

	return project;
}

export async function deleteProject(id: number): Promise<void> {
	const sql = getSql();

	if (!sql) {
		throw new Error('DATABASE_URL is missing. Set it in your environment variables.');
	}

	await sql`DELETE FROM projects WHERE id = ${id}`;
}

export async function updateProject(id: number, input: {
title: string;
description?: string;
imageUrl?: string;
projectUrl?: string;
}): Promise<Project> {
const sql = getSql();

if (!sql) {
throw new Error('DATABASE_URL is missing.');
}

const [project] = await sql<Project[]>`
UPDATE projects
SET title = ${input.title},
description = ${input.description ?? null},
image_url = ${input.imageUrl ?? null},
project_url = ${input.projectUrl ?? null}
WHERE id = ${id}
RETURNING id, title, description, image_url, project_url, created_at
`;

return project;
}
