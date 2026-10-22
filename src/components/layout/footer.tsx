import Link from "next/link";
import { company } from "@/config/company";
import { footerNav, policyNav, site } from "@/config/site";
import type { Locale } from "@/config/i18n";
import { Placeholder } from "@/components/ui/placeholder";
import { Arrow } from "@/components/ui/button";
import { Logo } from "./logo";
import { CopyrightYear } from "./copyright-year";
import { CookieSettingsButton } from "@/components/consent/cookie-banner";

const quickLinks = [
  { label: "お問い合わせ", labelEn: "Get in touch", href: "/contact" },
  { label: "採用情報を見る", labelEn: "Explore careers", href: "/recruit" },
  { label: "アクセス", labelEn: "View locations", href: "/about#access" },
  { label: "会社について", labelEn: "About us", href: "/about" },
];

export function Footer({ locale = "ja" }: { locale?: Locale }) {
  const en = locale === "en";
  return (
    <footer>
      {/* 黒い「Let's connect」ブロック */}
      <div className="bg-black text-white">
        <div className="container-max grid grid-cols-12 gap-x-8 gap-y-12 py-16 md:py-20">
          <div className="col-span-12 lg:col-span-4">
            <p className="font-display text-3xl font-bold md:text-[2rem]">Let&rsquo;s connect</p>
            <ul className="mt-8 space-y-4">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="group hover:text-accent-light inline-flex items-center gap-2 text-lg font-bold text-white/90"
                  >
                    {en ? l.labelEn : l.label}
                    <Arrow className="h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <nav
            aria-label="フッターナビゲーション"
            className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:col-span-8"
          >
            {footerNav.map((group) => (
              <div key={group.heading}>
                <p className="mb-4 text-base font-bold">{group.heading}</p>
                <ul className="space-y-2.5">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-[0.8125rem] text-white/75 transition-colors hover:text-white hover:underline hover:underline-offset-4"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
          <div className="col-span-12 flex flex-col gap-6 border-t border-white/15 pt-8 md:flex-row md:items-center md:justify-between">
            <Logo inverted href={en ? "/en" : "/"} />
            <p className="max-w-xl text-xs leading-relaxed text-white/60">{site.tagline}</p>
          </div>
        </div>
      </div>

      {/* 下段：ポリシー・会社情報・テーマ・コピーライト */}
      <div className="border-line bg-paper border-t">
        <div className="container-max py-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {policyNav.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-ink-2 hover:text-link text-xs font-bold hover:underline hover:underline-offset-4"
                >
                  {p.label}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/sitemap"
                className="text-ink-2 hover:text-link text-xs font-bold hover:underline hover:underline-offset-4"
              >
                サイトマップ
              </Link>
            </li>
            <li>
              <CookieSettingsButton />
            </li>
          </ul>
          <div className="text-ink-3 mt-6 flex flex-col gap-4 text-xs md:flex-row md:items-center md:justify-between">
            <p>
              <Placeholder value={company.nameJa} />
              <span className="mx-2">｜</span>
              <Placeholder value={company.address.full} />
            </p>
            <p className="font-display">
              © <CopyrightYear /> <Placeholder value={company.nameEn} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
