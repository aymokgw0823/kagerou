import type { MetadataRoute } from "next";
import { site } from "@/config/site";
import { businesses } from "@/config/businesses";
import { policySlugs } from "@/content/policies";
import { getAllPosts, getAllCategoriesInUse, getAllTags } from "@/lib/content/blog";
import { getAuthors } from "@/lib/content/authors";
import { getWorks } from "@/lib/content/works";
import { getLatestNews, getNewsYears } from "@/lib/content/news";
import { getJobs } from "@/lib/content/jobs";

const url = (path: string) => new URL(path, site.url).toString();

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, categories, tags, authors, works, news, years, jobs] = await Promise.all([
    getAllPosts(),
    getAllCategoriesInUse(),
    getAllTags(),
    getAuthors(),
    getWorks(),
    getLatestNews(),
    getNewsYears(),
    getJobs(),
  ]);
  const now = new Date();
  const fixed: MetadataRoute.Sitemap = [
    { url: url("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: url("/about"), changeFrequency: "monthly", priority: 0.8 },
    { url: url("/about/message"), changeFrequency: "yearly", priority: 0.5 },
    { url: url("/business"), changeFrequency: "monthly", priority: 0.8 },
    ...businesses.map((b) => ({ url: url(b.href), changeFrequency: "monthly" as const, priority: 0.9 })),
    { url: url("/ai/reform"), changeFrequency: "monthly", priority: 0.9 },
    { url: url("/works"), changeFrequency: "weekly", priority: 0.7 },
    { url: url("/blog"), changeFrequency: "daily", priority: 0.7 },
    { url: url("/news"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/recruit"), changeFrequency: "monthly", priority: 0.6 },
    { url: url("/recruit/jobs"), changeFrequency: "weekly", priority: 0.6 },
    { url: url("/recruit/entry"), changeFrequency: "yearly", priority: 0.3 },
    { url: url("/contact"), changeFrequency: "yearly", priority: 0.5 },
    { url: url("/booking"), changeFrequency: "yearly", priority: 0.5 },
    { url: url("/sitemap"), changeFrequency: "monthly", priority: 0.2 },
    { url: url("/en"), changeFrequency: "monthly", priority: 0.4 },
    { url: url("/en/about"), changeFrequency: "monthly", priority: 0.4 },
    ...policySlugs.map((s) => ({
      url: url(`/policy/${s}`),
      changeFrequency: "yearly" as const,
      priority: 0.2,
    })),
  ];
  return [
    ...fixed,
    ...posts.map((p) => ({
      url: url(`/blog/${p.slug}`),
      lastModified: new Date(p.updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...categories.map((c) => ({
      url: url(`/blog/category/${encodeURIComponent(c.category)}`),
      changeFrequency: "weekly" as const,
      priority: 0.4,
    })),
    ...tags.map((t) => ({
      url: url(`/blog/tag/${encodeURIComponent(t.tag)}`),
      changeFrequency: "weekly" as const,
      priority: 0.3,
    })),
    ...authors.map((a) => ({
      url: url(`/blog/author/${a.id}`),
      changeFrequency: "monthly" as const,
      priority: 0.3,
    })),
    ...works.map((w) => ({
      url: url(`/works/${w.slug}`),
      lastModified: new Date(w.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
    ...news.map((n) => ({
      url: url(`/news/${n.slug}`),
      lastModified: new Date(n.publishedAt),
      changeFrequency: "yearly" as const,
      priority: 0.4,
    })),
    ...years.map((y) => ({
      url: url(`/news/archive/${y.year}`),
      changeFrequency: "monthly" as const,
      priority: 0.2,
    })),
    ...jobs.map((j) => ({
      url: url(`/recruit/jobs/${j.slug}`),
      lastModified: new Date(j.publishedAt),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
