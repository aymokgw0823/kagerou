import Link from "next/link";
import { businesses, businessesByPillar, pillars, type Pillar } from "@/config/businesses";
import { Arrow } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const order: Pillar[] = ["create", "convey", "grow"];

/**
 * 5事業の関係図：「つくる・伝える・育てる」の3本柱と、それを支える「実践する（飲食）」。
 * ホバー／タップで各事業ページへ。CSS のみで動作する。
 */
export function BusinessMap({ className }: { className?: string }) {
  const byPillar = businessesByPillar();
  const practice = byPillar.practice;
  return (
    <div className={cn("relative", className)}>
      <ol className="grid grid-cols-1 gap-4 md:grid-cols-3 md:gap-6">
        {order.map((pillar, i) => (
          <li key={pillar} className="flex flex-col">
            <div className="mb-3 flex items-baseline gap-3">
              <span className="font-display text-ink-3 text-sm font-bold">0{i + 1}</span>
              <span className="text-2xl font-bold">{pillars[pillar].ja}</span>
              <span className="font-display text-ink-3 text-sm">{pillars[pillar].en}</span>
            </div>
            <p className="text-ink-2 mb-4 text-sm">{pillars[pillar].description}</p>
            <ul className="flex flex-1 flex-col gap-3">
              {byPillar[pillar].map((b) => (
                <li key={b.id} className="flex-1">
                  <Link
                    href={b.href}
                    className="card group flex h-full items-center justify-between gap-4 p-5 transition-shadow duration-300 hover:shadow-[0_2px_4px_rgba(0,0,0,0.08),0_16px_32px_-16px_rgba(0,0,0,0.3)]"
                    style={{ borderLeftColor: `var(${b.colorVar})` }}
                  >
                    <span>
                      <span className="block text-lg font-bold">{b.nameJa}</span>
                      <span className="text-ink-3 mt-1 block text-xs">{b.tagline}</span>
                    </span>
                    <Arrow className="text-link h-4 w-4 shrink-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </Link>
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
      {/* 土台：実践する */}
      <div className="mt-6 flex flex-col items-center">
        <div aria-hidden className="bg-line h-8 w-px" />
        {practice.map((b) => (
          <Link
            key={b.id}
            href={b.href}
            className="group rounded-brand flex w-full items-center justify-between gap-6 bg-black p-6 text-white md:p-8"
            style={{ borderLeft: `6px solid var(${b.colorVar})` }}
          >
            <div>
              <p className="flex items-baseline gap-3">
                <span className="text-2xl font-bold">{pillars.practice.ja}</span>
                <span className="font-display text-sm text-white/60">{pillars.practice.en}</span>
              </p>
              <p className="mt-2 text-sm text-white/80">
                <span className="font-bold text-white">{b.nameJa}事業</span>　{pillars.practice.description}。
                {b.description}
              </p>
            </div>
            <Arrow className="text-accent h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        ))}
      </div>
      <p className="sr-only">{businesses.map((b) => b.nameJa).join("、")}の5事業</p>
    </div>
  );
}
