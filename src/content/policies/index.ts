// 管理者向け：本文は雛形です。公開前に専門家（弁護士・社労士等）の確認を受けてください。
import type { PolicyDoc } from "./types";
import { privacy } from "./privacy";
import { antisocial } from "./antisocial";
import { security } from "./security";
import { ai } from "./ai";
import { cookie } from "./cookie";

export type { PolicyBlock, PolicyDoc, PolicySection } from "./types";

/** 表示順（フッターや一覧もこの順） */
export const policies: PolicyDoc[] = [privacy, antisocial, security, ai, cookie];

export type PolicySlug = PolicyDoc["slug"];

export const policySlugs: PolicySlug[] = policies.map((p) => p.slug);

/** slug からポリシー文書を取得。存在しなければ undefined */
export function getPolicy(slug: string): PolicyDoc | undefined {
  return policies.find((p) => p.slug === slug);
}
