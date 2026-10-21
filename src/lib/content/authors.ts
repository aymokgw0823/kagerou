import { loadCollection } from "./fs";
import { authorFrontmatter } from "./schema";
import type { Author } from "./types";

export async function getAuthors(): Promise<Author[]> {
  return loadCollection("authors", authorFrontmatter).map((d) => ({ ...d.frontmatter, bio: d.body.trim() }));
}

export async function getAuthor(id: string): Promise<Author | undefined> {
  return (await getAuthors()).find((a) => a.id === id);
}
