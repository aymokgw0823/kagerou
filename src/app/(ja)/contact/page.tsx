import type { Metadata } from "next";
import { Suspense } from "react";
import { company } from "@/config/company";
import { getBusinessDetail } from "@/content/business";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";
import { LinkButton } from "@/components/ui/button";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = { title: "お問い合わせ", description: "建設・飲食に関するお問い合わせ。" };

type SP = { business?: string; consultation?: string; from?: string };

async function FormWithParams({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const dining = getBusinessDetail("dining").extra;
  const stores = dining.kind === "dining" ? dining.stores.map((s) => s.name) : [];
  const biz =
    sp.business === "build" || sp.business === "dining" || sp.business === "other" ? sp.business : undefined;
  return (
    <ContactForm stores={stores} initialBusiness={biz} consultationId={sp.consultation} source={sp.from} />
  );
}

export default function ContactPage({ searchParams }: PageProps<"/contact">) {
  return (
    <>
      <PageHeader
        title="お問い合わせ"
        titleEn="Contact"
        lead="工事のご相談、店舗のご予約・貸切、その他のご連絡はこちらから。内容を確認のうえ、3営業日以内を目安にご返信します。"
        crumbs={[{ label: "お問い合わせ" }]}
      />
      <Section spacing="sm">
        <div className="container-max grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <Suspense fallback={<p className="text-ink-3">読み込み中…</p>}>
              <FormWithParams searchParams={searchParams as Promise<SP>} />
            </Suspense>
          </div>
          <aside className="space-y-6 lg:col-span-4">
            <div className="card p-6">
              <p className="text-sm font-bold">お電話でのお問い合わせ</p>
              <p className="font-display mt-2 text-2xl font-bold">
                <Placeholder value={company.contact.tel} />
              </p>
              <p className="text-ink-3 text-xs">{company.contact.hours}</p>
            </div>
            <div className="card p-6">
              <p className="text-sm font-bold">リフォームをご検討の方へ</p>
              <p className="text-ink-2 mt-2 text-sm">
                写真をアップロードするだけで、考えられる施工内容と概算の費用レンジをその場で確認できます。
              </p>
              <div className="mt-4">
                <LinkButton href="/ai/reform" variant="outline">
                  写真でリフォーム相談（無料）
                </LinkButton>
              </div>
            </div>
            <div className="card p-6">
              <p className="text-sm font-bold">日程を決めてご相談したい方へ</p>
              <p className="text-ink-2 mt-2 text-sm">
                現地調査や打ち合わせの候補日時をカレンダーから選べます。
              </p>
              <div className="mt-4">
                <LinkButton href="/booking" variant="outline">
                  ご相談を予約する
                </LinkButton>
              </div>
            </div>
          </aside>
        </div>
      </Section>
    </>
  );
}
