/**
 * 自己ホストフォント（/fonts/fonts.css）を描画後のアイドル時に読み込む。
 * 268 個の @font-face を含む CSS を描画ブロックにしないための仕組み。font-display: optional と組み合わせ、
 * 初回は OS の和文ゴシックで描画、キャッシュ後は Noto Sans JP で描画する。
 */
const script = `(function(){var l=document.createElement("link");l.rel="stylesheet";l.href="/fonts/fonts.css";var f=function(){document.head.appendChild(l)};if("requestIdleCallback" in window){requestIdleCallback(f,{timeout:2000})}else{setTimeout(f,800)}})();`;

export function FontLoader() {
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}
