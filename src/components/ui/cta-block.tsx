import { LinkButton } from "./button";
import { Photo } from "./photo";

type Props = {
  title?: string;
  lead?: string;
  photoId?: string;
  /** AI診断への導線も出す */
  showAi?: boolean;
};

/** お問い合わせ／商談予約への黒いCTAブロック（全ページ共通で使う） */
export function CtaBlock({
  title = "まずは、お気軽にご相談ください",
  lead = "事業の課題を整理するところからご一緒します。無料のAI診断で現状を把握してから、商談を予約いただくこともできます。",
  photoId,
  showAi = true,
}: Props) {
  return (
    <section className="bg-black text-white">
      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="relative min-h-[16rem] lg:min-h-[24rem]">
          {photoId ? (
            <Photo
              id={photoId}
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="absolute inset-0 h-full w-full"
              imgClassName="opacity-80"
            />
          ) : (
            <div className="from-accent/40 absolute inset-0 bg-gradient-to-br to-black" />
          )}
        </div>
        <div className="px-gutter flex flex-col justify-center py-14 lg:px-16 lg:py-20">
          <h2 className="text-2xl md:text-3xl">{title}</h2>
          <p className="mt-5 max-w-lg text-[0.9375rem] leading-[1.9] text-white/85">{lead}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <LinkButton href="/contact">お問い合わせ</LinkButton>
            <LinkButton href="/booking" variant="outline-light">
              商談を予約する
            </LinkButton>
            {showAi && (
              <LinkButton href="/ai" variant="text" className="hover:text-accent text-white">
                無料のAI診断を試す
              </LinkButton>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
