/**
 * メール送信のインターフェース。
 * - 開発中（RESEND_API_KEY 未設定）：コンソールに内容を出力する
 * - RESEND_API_KEY が設定されていれば Resend API で送信する（fetch 直叩き。SDK 不要）
 * 送信先・差出人は環境変数（.env.example 参照）。
 */
export type Mail = {
  to: string | string[];
  subject: string;
  text: string;
  replyTo?: string;
};

export type MailResult =
  { ok: true; id?: string; transport: "console" | "resend" } | { ok: false; error: string };

const from = () => process.env.MAIL_FROM ?? "noreply@example.com";

async function sendViaResend(mail: Mail): Promise<MailResult> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: from(),
      to: Array.isArray(mail.to) ? mail.to : [mail.to],
      subject: mail.subject,
      text: mail.text,
      reply_to: mail.replyTo,
    }),
  });
  if (!res.ok) return { ok: false, error: `Resend: ${res.status} ${await res.text()}` };
  const json = (await res.json()) as { id?: string };
  return { ok: true, id: json.id, transport: "resend" };
}

export async function sendMail(mail: Mail): Promise<MailResult> {
  if (process.env.RESEND_API_KEY) {
    try {
      return await sendViaResend(mail);
    } catch (e) {
      return { ok: false, error: String(e) };
    }
  }
  console.log(
    [
      "",
      "━━━ [mail:console] 送信（開発モード：実際には送信されません）",
      `From: ${from()}`,
      `To: ${Array.isArray(mail.to) ? mail.to.join(", ") : mail.to}`,
      mail.replyTo ? `Reply-To: ${mail.replyTo}` : null,
      `Subject: ${mail.subject}`,
      "",
      mail.text,
      "━━━",
      "",
    ]
      .filter((l) => l !== null)
      .join("\n"),
  );
  return { ok: true, transport: "console" };
}

/** 管理者宛の通知先（未設定なら MAIL_FROM へ） */
export function adminRecipient(kind: "contact" | "recruit" | "booking"): string {
  if (kind === "recruit") return process.env.MAIL_TO_RECRUIT || process.env.MAIL_TO_CONTACT || from();
  return process.env.MAIL_TO_CONTACT || from();
}
