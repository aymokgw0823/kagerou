import { headerCtas, mainNav } from "@/config/site";
import type { Locale } from "@/config/i18n";
import { Logo } from "./logo";
import { HeaderNav } from "./header-nav";

/** 黒いグローバルヘッダー。backdrop-filter は使わない（ドロワーの包含ブロックになるため） */
export function Header({ locale = "ja" }: { locale?: Locale }) {
  return (
    <header className="sticky top-0 z-50 bg-black text-white">
      <div className="container-max h-header flex items-center justify-between gap-8">
        <Logo inverted href={locale === "en" ? "/en" : "/"} />
        <HeaderNav items={mainNav} ctas={headerCtas} locale={locale} />
      </div>
    </header>
  );
}
