import { readFileSync } from "node:fs";
import { join } from "node:path";

const cache = new Map<string, string>();

/** prompts/<name>.md を読み込む（コードを変えずにプロンプトを調整できる） */
export function loadPrompt(name: string): string {
  const key = name;
  if (process.env.NODE_ENV === "production" && cache.has(key)) return cache.get(key)!;
  const text = readFileSync(join(process.cwd(), "prompts", `${name}.md`), "utf8");
  cache.set(key, text);
  return text;
}
