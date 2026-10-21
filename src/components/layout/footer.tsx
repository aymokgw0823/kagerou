import Link from "next/link";
import { company } from "@/config/company";
import { footerNav, policyNav, site } from "@/config/site";
import { Placeholder } from "@/components/ui/placeholder";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { Logo } from "./logo";
import { CopyrightYear } from "./copyright-year";

export function Footer() {
  return (
    <footer className="border-line bg-paper border-t">
      <div className="container-max">
        {/* 上段：ブランドとサイトマップ */}
        <div className="grid grid-cols-12 gap-x-8 gap-y-12 py-20 md:py-28">
          <div className="col-span-12 lg:col-span-4">
            <Logo />
            <p className="text-ink-2 mt-8 max-w-xs text-sm leading-[1.9]">{site.tagline}</p>
            <dl className="text-ink-2 mt-10 space-y-3 text-sm">
              <div>
                <dt className="sr-only">社名</dt>
                <dd>
                  <Placeholder value={company.nameJa} />
                </dd>
              </div>
              <div>
                <dt className="sr-only">所在地</dt>
                <dd>
                  <Placeholder value={company.address.full} />
                </dd>
              </div>
              <div>
                <dt className="sr-only">電話番号</dt>
                <dd>
                  TEL <Placeholder value={company.contact.tel} />
                  <span className="text-ink-3 ml-2">（{company.contact.hours}）</span>
                </dd>
              </div>
            </dl>
          </div>
          <nav
            aria-label="フッターナビゲーション"
            className="col-span-12 grid grid-cols-2 gap-x-8 gap-y-10 md:grid-cols-4 lg:col-span-8"
          >
            {footerNav.map((group) => (
              <div key={group.heading}>
                <p className="label-caps mb-5">{group.heading}</p>
                <ul className="space-y-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className="text-ink-2 ease-brand hover:text-ink text-sm transition-colors duration-300"
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </div>

        {/* 下段：ポリシー・テーマ・コピーライト */}
        <div className="border-line flex flex-col gap-6 border-t py-8 md:flex-row md:items-center md:justify-between">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {policyNav.map((p) => (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="text-ink-3 ease-brand hover:text-ink text-xs transition-colors duration-300"
                >
                  {p.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="flex items-center gap-6">
            <ThemeToggle />
            <p className="font-display text-ink-3 text-sm">
              © <CopyrightYear /> <Placeholder value={company.nameEn} />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
