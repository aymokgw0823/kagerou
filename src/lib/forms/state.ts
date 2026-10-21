/** クライアント・サーバー両方から参照できる、フォーム共通の型と定数（next/headers に依存しない） */
export const HONEYPOT_FIELD = "website"; // 人間には見えない入力欄。値が入っていればボット

export type ActionState<T = undefined> =
  | { status: "idle" }
  | { status: "success"; message: string; data?: T }
  | { status: "error"; message: string; errors?: Record<string, string[]> };

export const idleState: ActionState = { status: "idle" };
