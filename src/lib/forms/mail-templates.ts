import { company } from "@/config/company";
import type { ContactInput, BookingInput, EntryInput } from "./schemas";

const sig = () =>
  [
    "",
    "────────────",
    company.nameJa,
    `TEL ${company.contact.tel}（${company.contact.hours}）`,
    `${company.contact.email}`,
  ].join("\n");
const bizLabel: Record<string, string> = {
  build: "建設事業について",
  dining: "飲食事業について",
  other: "その他",
};

export function contactMails(input: ContactInput, id: string) {
  const lines = [
    `種類：${bizLabel[input.business]}`,
    `お名前：${input.name}${input.kana ? `（${input.kana}）` : ""}`,
    input.company ? `会社名・店舗名：${input.company}` : null,
    `メール：${input.email}`,
    input.tel ? `電話：${input.tel}` : null,
    input.workType ? `工事の種類：${input.workType}` : null,
    input.propertyType ? `物件の種類：${input.propertyType}` : null,
    input.area ? `所在地：${input.area}` : null,
    input.timing ? `希望時期：${input.timing}` : null,
    input.purpose ? `ご用件：${input.purpose}` : null,
    input.store ? `店舗：${input.store}` : null,
    input.partySize ? `人数：${input.partySize}` : null,
    input.preferredDate ? `希望日時：${input.preferredDate}` : null,
    input.subject ? `件名：${input.subject}` : null,
    input.consultationId ? `AIリフォーム相談ID：${input.consultationId}` : null,
    "",
    "お問い合わせ内容：",
    input.message,
  ].filter((l): l is string => l !== null);
  return {
    admin: {
      subject: `【お問い合わせ】${bizLabel[input.business]}｜${input.name}様（${id}）`,
      text: lines.join("\n"),
    },
    reply: {
      subject: `【${company.nameJa}】お問い合わせを受け付けました`,
      text: [
        `${input.name} 様`,
        "",
        "お問い合わせいただきありがとうございます。以下の内容で受け付けました。",
        "担当者より3営業日以内を目安にご連絡いたします。",
        "",
        ...lines,
        "",
        `受付番号：${id}`,
        sig(),
      ].join("\n"),
    },
  };
}

export function bookingMails(input: BookingInput, id: string, slotText: string, altText?: string) {
  const lines = [
    `種類：${bizLabel[input.business]}`,
    input.topic ? `ご相談内容：${input.topic}` : null,
    `第1希望：${slotText}`,
    altText ? `第2希望：${altText}` : null,
    `お名前：${input.name}`,
    `メール：${input.email}`,
    input.tel ? `電話：${input.tel}` : null,
    input.note ? `備考：${input.note}` : null,
    input.consultationId ? `AIリフォーム相談ID：${input.consultationId}` : null,
  ].filter((l): l is string => l !== null);
  return {
    admin: { subject: `【ご相談予約】${input.name}様 ${slotText}（${id}）`, text: lines.join("\n") },
    reply: {
      subject: `【${company.nameJa}】ご相談予約を受け付けました（確定ではありません）`,
      text: [
        `${input.name} 様`,
        "",
        "ご相談のご予約を受け付けました。担当者が日程を確認し、確定のご連絡を差し上げます。",
        "この時点では日時は確定しておりませんのでご了承ください。",
        "",
        ...lines,
        "",
        `受付番号：${id}`,
        sig(),
      ].join("\n"),
    },
  };
}

export function entryMails(input: EntryInput, jobTitle: string, id: string, resumeName?: string) {
  const lines = [
    `応募職種：${jobTitle}`,
    `お名前：${input.name}（${input.kana}）`,
    `メール：${input.email}`,
    `電話：${input.tel}`,
    input.address ? `住所：${input.address}` : null,
    resumeName ? `履歴書：${resumeName}` : "履歴書：なし",
    input.message ? `\n志望動機・メッセージ：\n${input.message}` : null,
  ].filter((l): l is string => l !== null);
  return {
    admin: { subject: `【採用エントリー】${jobTitle}｜${input.name}様（${id}）`, text: lines.join("\n") },
    reply: {
      subject: `【${company.nameJa}】エントリーを受け付けました`,
      text: [
        `${input.name} 様`,
        "",
        "エントリーいただきありがとうございます。以下の内容で受け付けました。",
        "書類を確認のうえ、3営業日以内を目安に採用担当からご連絡いたします。",
        "",
        ...lines,
        "",
        `受付番号：${id}`,
        sig(),
      ].join("\n"),
    },
  };
}
