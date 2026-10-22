import {
  BRAND_RED,
  MARK_H,
  MARK_W,
  STROKE,
  flameInner,
  flameOuter,
  horizon,
  rays,
  sunPath,
} from "@/lib/brand/mark";

type Props = {
  className?: string;
  /** 光線・陽の色 */
  color?: string;
  /** 炎の色（背景色に合わせる） */
  flame?: string;
  /** インラインスタイル（OGP 画像など class が使えない場所用） */
  style?: React.CSSProperties;
};

/** シンボルマーク（旭日と炎）。next/og の satori でも描画できる要素だけで構成する */
export function LogoMark({ className, color = BRAND_RED, flame = "#ffffff", style }: Props) {
  return (
    <svg
      viewBox={`0 0 ${MARK_W} ${MARK_H}`}
      className={className}
      style={style}
      aria-hidden
      focusable="false"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g stroke={color} strokeWidth={STROKE} strokeLinecap="round" fill="none">
        {rays.map((s, i) => (
          <line key={`r${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
        {horizon.map((s, i) => (
          <line key={`h${i}`} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} />
        ))}
      </g>
      <path d={sunPath} fill={color} />
      <path d={flameOuter} fill={flame} />
      <path d={flameInner} fill={color} />
    </svg>
  );
}
