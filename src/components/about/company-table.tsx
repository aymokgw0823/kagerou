import { company } from "@/config/company";
import { Placeholder } from "@/components/ui/placeholder";
import { DummyBadge } from "@/components/ui/dummy-badge";
import type { Locale } from "@/config/i18n";

const labels = {
  ja: {
    name: "社名",
    founded: "設立",
    capital: "資本金",
    representative: "代表者",
    officers: "役員",
    address: "所在地",
    banks: "取引銀行",
    licenses: "許認可",
    memberships: "加入団体",
    business: "事業内容",
    invoice: "適格請求書発行事業者登録番号",
  },
  en: {
    name: "Company name",
    founded: "Founded",
    capital: "Capital",
    representative: "Representative",
    officers: "Officers",
    address: "Head office",
    banks: "Banks",
    licenses: "Licenses",
    memberships: "Memberships",
    business: "Business",
    invoice: "Invoice registration number",
  },
};

/** 会社概要テーブル（company.ts から自動生成） */
export function CompanyTable({ locale = "ja" }: { locale?: Locale }) {
  const t = labels[locale];
  const rows: { label: string; value: React.ReactNode }[] = [
    {
      label: t.name,
      value: (
        <>
          <Placeholder value={company.nameJa} />
          <span className="text-ink-3 ml-3">
            <Placeholder value={company.nameEn} />
          </span>
        </>
      ),
    },
    { label: t.founded, value: <Placeholder value={company.founded} /> },
    { label: t.capital, value: company.capital },
    { label: t.representative, value: <Placeholder value={company.representative} /> },
    {
      label: t.officers,
      value: (
        <ul className="space-y-1">
          {company.officers.map((o, i) => (
            <li key={i}>
              {o.title}　<Placeholder value={o.name} /> <DummyBadge show={o.isDummy} />
            </li>
          ))}
        </ul>
      ),
    },
    { label: t.address, value: <Placeholder value={company.address.full} /> },
    {
      label: t.banks,
      value: company.banks.map((b, i) => <Placeholder key={i} value={b} className="mr-3" />),
    },
    {
      label: t.licenses,
      value: (
        <ul className="space-y-1">
          {company.licenses.map((l, i) => (
            <li key={i}>
              {l.label}　<Placeholder value={l.number} />
            </li>
          ))}
        </ul>
      ),
    },
    ...(company.memberships.length ? [{ label: t.memberships, value: company.memberships.join("、") }] : []),
    {
      label: t.business,
      value: (
        <ol className="list-decimal space-y-1 pl-5">
          {company.businessSummary.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ol>
      ),
    },
    { label: t.invoice, value: <Placeholder value={company.invoiceRegistrationNumber} /> },
  ];
  return (
    <table className="w-full border-collapse text-[0.9375rem]">
      <tbody>
        {rows.map((r) => (
          <tr key={r.label} className="border-line border-b">
            <th scope="row" className="bg-paper-2 w-36 px-4 py-4 text-left align-top font-bold md:w-56">
              {r.label}
            </th>
            <td className="px-4 py-4 align-top">{r.value}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
