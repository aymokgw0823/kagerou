import Link from "next/link";
import { businesses, pillars } from "@/config/businesses";
import { site } from "@/config/site";
import { Hero } from "@/components/ui/hero";
import { Section, SectionBar, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { Photo } from "@/components/ui/photo";

export default function HomePageEn() {
  return (
    <>
      <Hero
        size="tall"
        photoId="office-working"
        title={
          <span className="font-display block text-[2.5rem] leading-[1.15] font-semibold md:text-[3.75rem]">
            {site.taglineLinesEn.map((l) => (
              <span key={l} className="block">
                {l}
              </span>
            ))}
          </span>
        }
        tagline={site.taglineSubEn}
        lead={site.missionEn}
        actions={
          <>
            <LinkButton href="/en/about" size="lg">
              About us
            </LinkButton>
            <LinkButton href="/contact" variant="outline-light" size="lg">
              Contact (Japanese)
            </LinkButton>
          </>
        }
      />
      <SectionBar label="What we do" color="black" />
      <Section>
        <div className="container-max">
          <SectionHeading
            title="Five businesses, one company"
            lead="Each business works as an independent service brand, and all five work together as one group. We also run our own restaurants, where we test every strategy we propose."
          />
          <ul className="grid grid-cols-1 gap-x-8 gap-y-12 md:grid-cols-2">
            {businesses.map((b) => (
              <li key={b.id}>
                <Link href={b.href} className="group block" hrefLang="ja">
                  <Photo
                    id={b.keyVisualId}
                    fill
                    className="rounded-brand aspect-[3/2]"
                    sizes="(min-width: 768px) 50vw, 100vw"
                    imgClassName="transition-transform duration-700 ease-brand group-hover:scale-[1.03]"
                  />
                  <p
                    className="font-display mt-5 text-xs font-bold tracking-wider uppercase"
                    style={{ color: `var(${b.colorVar})` }}
                  >
                    {pillars[b.pillar].en}
                  </p>
                  <h3 className="font-display group-hover:text-link mt-1.5 text-xl font-bold">{b.nameEn}</h3>
                  <p className="text-ink-2 mt-2 text-[0.9375rem] leading-[1.7]">{b.descriptionEn}</p>
                  <span className="text-ink-3 mt-2 block text-xs">Details available in Japanese</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>
      <section className="bg-black text-white">
        <div className="container-max py-14">
          <h2 className="font-display text-2xl font-bold md:text-3xl">Get in touch</h2>
          <p className="mt-4 max-w-xl text-white/85">
            Our contact form is currently available in Japanese. English inquiries are welcome through the
            same form.
          </p>
          <div className="mt-8">
            <LinkButton href="/contact">Contact us</LinkButton>
          </div>
        </div>
      </section>
    </>
  );
}
