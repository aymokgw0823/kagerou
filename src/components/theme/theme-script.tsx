/**
 * 描画前にテーマ属性を適用し、ダークモードのちらつきを防ぐ。
 * localStorage に "light" / "dark" があればそれを、なければ OS 設定（tokens.css の prefers-color-scheme）に従う。
 */
const script = `(function(){try{var t=localStorage.getItem("theme");if(t==="dark"||t==="light"){document.documentElement.setAttribute("data-theme",t)}}catch(e){}})();`;

export function ThemeScript() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
