/**
 * 募集職種リポジトリ（content/jobs/*.mdx）。
 */
import { z } from "zod";
import { loadCollection, type Doc } from "./fs";

export const jobFrontmatter = z.object({
  title: z.string(),
  slug: z.string().regex(/^[a-z0-9-]+$/),
  business: z.enum(["build", "dining"]),
  /** 正社員 / 契約社員 / アルバイト・パート など */
  employmentType: z.string(),
  /** schema.org の employmentType（FULL_TIME など） */
  employmentTypeCode: z
    .enum(["FULL_TIME", "PART_TIME", "CONTRACTOR", "TEMPORARY", "INTERN"])
    .default("FULL_TIME"),
  location: z.string(),
  /** 給与（未確定は【要差し替え】） */
  salary: z.string(),
  hours: z.string(),
  holidays: z.string(),
  requirements: z.array(z.string()).min(1),
  welcome: z.array(z.string()).default([]),
  /** 募集の有効期限（JobPosting の validThrough） */
  validThrough: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  publishedAt: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  isDummy: z.boolean().default(false),
});
export type JobFrontmatter = z.infer<typeof jobFrontmatter>;
export type Job = JobFrontmatter & { body: string; description: string };

function toJob(d: Doc<JobFrontmatter>): Job {
  return { ...d.frontmatter, body: d.body, description: d.plain.slice(0, 160) };
}

export async function getJobs(): Promise<Job[]> {
  return loadCollection("jobs", jobFrontmatter).map(toJob);
}

export async function getJob(slug: string): Promise<Job | undefined> {
  return (await getJobs()).find((j) => j.slug === slug);
}
