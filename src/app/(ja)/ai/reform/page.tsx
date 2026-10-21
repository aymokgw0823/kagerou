import type { Metadata } from "next";
import { reformTool } from "@/config/ai-tools";
import { company } from "@/config/company";
import { Hero } from "@/components/ui/hero";
import { Breadcrumbs } from "@/components/layout/breadcrumbs";
import { Section } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { ReformWizard } from "@/features/ai/reform/ui/reform-wizard";

export const metadata: Metadata = {
  title: "写真でリフォーム相談（AI・無料）",
  description: reformTool.description,
};

export default function ReformPage() {
  const license = company.licenses.find((l) => l.business === "build");
  return (
    <>
      <Hero
        eyebrow="AI Reform Consultation"
        title="写真でリフォーム相談"
        tagline="無料・約3分・その場で結果"
        lead={reformTool.description}
        photoId="build-before"
        tintVar="--color-biz-build"
      />
      <Breadcrumbs items={[{ label: "写真でリフォーム相談" }]} />
      <Section spacing="sm">
        <div className="container-max grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <ReformWizard />
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="card p-6">
              <p className="text-sm font-bold">流れ</p>
              <ol className="mt-3 space-y-2 text-sm">
                {reformTool.steps.map((s, i) => (
                  <li key={s} className="flex gap-3">
                    <span className="font-display text-biz-build font-bold">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {s}
                  </li>
                ))}
              </ol>
            </div>
            <div className="card text-ink-2 p-6 text-sm">
              <p className="text-ink font-bold">安心してご利用いただくために</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>写真の位置情報は受け付け時に削除します</li>
                <li>金額は当社の単価表から計算します（AIが決めるのではありません）</li>
                <li>安全に関わる兆候があれば、早めの点検をご案内します</li>
              </ul>
            </div>
            {license && (
              <div className="card p-6 text-sm">
                <p className="font-bold">{license.label}</p>
                <p className="font-display">
                  <Placeholder value={license.number} />
                </p>
              </div>
            )}
          </aside>
        </div>
      </Section>
    </>
  );
}
