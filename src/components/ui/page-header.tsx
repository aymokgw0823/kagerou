import type { ReactNode } from "react";
import { Breadcrumbs, type Crumb } from "@/components/layout/breadcrumbs";

type Props = {
  title: ReactNode;
  titleEn?: string;
  lead?: ReactNode;
  crumbs: Crumb[];
};

/** 写真なしの下層ページ見出し（ポリシー・エラー等） */
export function PageHeader({ title, titleEn, lead, crumbs }: Props) {
  return (
    <div className="border-line bg-paper-2 border-b">
      <Breadcrumbs items={crumbs} />
      <div className="container-max pt-6 pb-12 md:pt-8 md:pb-16">
        {titleEn && <p className="label-caps font-display mb-3">{titleEn}</p>}
        <h1 className="text-3xl md:text-[2.5rem]">{title}</h1>
        {lead && <p className="text-ink-2 mt-4 max-w-2xl">{lead}</p>}
      </div>
    </div>
  );
}
