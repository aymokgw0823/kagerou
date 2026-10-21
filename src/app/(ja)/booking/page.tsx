import type { Metadata } from "next";
import { Suspense } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { BookingForm } from "@/components/forms/booking-form";

export const metadata: Metadata = {
  title: "ご相談予約",
  description: "現地調査・打ち合わせの候補日時をカレンダーから選んでお申し込みいただけます。",
};

type SP = { business?: string; consultation?: string };

async function FormWithParams({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const biz =
    sp.business === "build" || sp.business === "dining" || sp.business === "other" ? sp.business : undefined;
  const embed = process.env.NEXT_PUBLIC_BOOKING_EMBED_URL;
  if (embed) {
    // 外部の日程調整サービス（TimeRex / Calendly 等）に差し替える場合
    const url = sp.consultation
      ? `${embed}${embed.includes("?") ? "&" : "?"}consultation=${encodeURIComponent(sp.consultation)}`
      : embed;
    return (
      <iframe
        title="ご相談予約"
        src={url}
        className="rounded-brand border-line h-[48rem] w-full border"
        loading="lazy"
      />
    );
  }
  return <BookingForm initialBusiness={biz} consultationId={sp.consultation} />;
}

export default function BookingPage({ searchParams }: PageProps<"/booking">) {
  return (
    <>
      <PageHeader
        title="ご相談予約"
        titleEn="Booking"
        lead="現地調査や打ち合わせの候補日時を選んでお申し込みください。担当者が確認のうえ、確定のご連絡をいたします。"
        crumbs={[{ label: "ご相談予約" }]}
      />
      <Section spacing="sm">
        <div className="container-narrow">
          <Suspense fallback={<p className="text-ink-3">読み込み中…</p>}>
            <FormWithParams searchParams={searchParams as Promise<SP>} />
          </Suspense>
        </div>
      </Section>
    </>
  );
}
