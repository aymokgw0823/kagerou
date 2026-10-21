import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { company } from "@/config/company";
import { getPolicy, policySlugs } from "@/content/policies";
import type { PolicyBlock } from "@/content/policies/types";
import { PageHeader } from "@/components/ui/page-header";
import { Section } from "@/components/ui/section";
import { Placeholder } from "@/components/ui/placeholder";

export function generateStaticParams() {
  return policySlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps<"/policy/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const doc = getPolicy(slug);
  if (!doc) return {};
  return { title: doc.title, description: doc.description };
}

function Block({ block }: { block: PolicyBlock }) {
  switch (block.type) {
    case "p":
      return (
        <p>
          <Placeholder value={block.text} />
        </p>
      );
    case "ul":
      return (
        <ul>
          {block.items.map((t, i) => (
            <li key={i}>
              <Placeholder value={t} />
            </li>
          ))}
        </ul>
      );
    case "ol":
      return (
        <ol>
          {block.items.map((t, i) => (
            <li key={i}>
              <Placeholder value={t} />
            </li>
          ))}
        </ol>
      );
    case "table":
      return (
        <table>
          <tbody>
            {block.rows.map(([k, v], i) => (
              <tr key={i}>
                <th scope="row">{k}</th>
                <td>
                  <Placeholder value={v} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      );
  }
}

export default async function PolicyPage({ params }: PageProps<"/policy/[slug]">) {
  const { slug } = await params;
  const doc = getPolicy(slug);
  if (!doc) notFound();
  return (
    <>
      <PageHeader
        title={doc.title}
        titleEn={doc.titleEn}
        lead={doc.description}
        crumbs={[{ label: doc.title }]}
      />
      <Section>
        <article className="container-text prose-corp">
          {doc.intro && <p>{doc.intro}</p>}
          {doc.sections.map((s) => (
            <section key={s.heading}>
              <h2>{s.heading}</h2>
              {s.blocks.map((b, i) => (
                <Block key={i} block={b} />
              ))}
            </section>
          ))}
          {doc.closing && <p>{doc.closing}</p>}
          <p className="text-ink-2 mt-12 text-sm">
            <Placeholder value={doc.established} />
            <br />
            <Placeholder value={company.nameJa} />
            <br />
            代表取締役　
            <Placeholder value={company.representative} />
          </p>
        </article>
      </Section>
    </>
  );
}
