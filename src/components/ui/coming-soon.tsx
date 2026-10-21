import { PageHeader } from "./page-header";
import { Section } from "./section";
import { LinkButton } from "./button";

type Props = { title: string; titleEn?: string; phase: string; description?: string };

/** 後続 Phase で実装するページの暫定表示 */
export function ComingSoon({ title, titleEn, phase, description }: Props) {
  return (
    <>
      <PageHeader title={title} titleEn={titleEn} crumbs={[{ label: title }]} />
      <Section>
        <div className="container-narrow text-center">
          <p className="rounded-pill border-notice bg-notice-soft text-notice inline-flex border px-4 py-1.5 text-sm font-bold">
            準備中（{phase} で実装予定）
          </p>
          {description && <p className="text-ink-2 mt-6">{description}</p>}
          <div className="mt-10 flex flex-wrap justify-center gap-3">
            <LinkButton href="/">トップへ戻る</LinkButton>
            <LinkButton href="/business" variant="outline">
              事業を見る
            </LinkButton>
          </div>
        </div>
      </Section>
    </>
  );
}
