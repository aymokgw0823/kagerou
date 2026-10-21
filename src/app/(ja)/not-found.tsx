import { LinkButton } from "@/components/ui/button";
import { Section } from "@/components/ui/section";

export default function NotFound() {
  return (
    <Section className="min-h-[60vh]">
      <div className="container-narrow text-center">
        <p className="font-display text-accent text-7xl font-bold">404</p>
        <h1 className="mt-4 text-2xl md:text-3xl">お探しのページが見つかりません</h1>
        <p className="text-ink-2 mt-4">URLが変更されたか、ページが削除された可能性があります。</p>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <LinkButton href="/">トップへ戻る</LinkButton>
          <LinkButton href="/sitemap" variant="outline">
            サイトマップ
          </LinkButton>
          <LinkButton href="/contact" variant="text">
            お問い合わせ
          </LinkButton>
        </div>
      </div>
    </Section>
  );
}
