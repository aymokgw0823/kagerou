/**
 * 3D を描画しない環境向けの静的フォールバック（SVG）。
 * 同じモチーフ——線で描いた建物の骨組み（つくる）と、漂う光の粒と輪（営む）——を控えめに描く。
 * サーバーでも描画できるよう、依存なし・決定的な計算のみ。
 */

const NAVY = "#012169";
const TEAL = "#0d8390";
const BLUE = "#0076a8";

type V3 = readonly [number, number, number];

/** 斜め上から見た投影（軽いダイメトリック） */
function project([x, y, z]: V3, cx: number, cy: number, s: number): [string, string] {
  const a = (28 * Math.PI) / 180;
  const px = x * Math.cos(a) - z * Math.sin(a);
  const pz = x * Math.sin(a) + z * Math.cos(a);
  const X = cx + px * s;
  const Y = cy + pz * s * 0.42 - y * s * 0.9;
  return [X.toFixed(1), Y.toFixed(1)];
}

function cubeEdges(h: number): [V3, V3][] {
  const edges: [V3, V3][] = [];
  const c = [-h, h] as const;
  for (const y of c)
    for (const z of c)
      edges.push([
        [-h, y, z],
        [h, y, z],
      ]);
  for (const x of c)
    for (const z of c)
      edges.push([
        [x, -h, z],
        [x, h, z],
      ]);
  for (const x of c)
    for (const y of c)
      edges.push([
        [x, y, -h],
        [x, y, h],
      ]);
  return edges;
}

function squareEdges(h: number, y: number): [V3, V3][] {
  return [
    [
      [-h, y, -h],
      [h, y, -h],
    ],
    [
      [h, y, -h],
      [h, y, h],
    ],
    [
      [h, y, h],
      [-h, y, h],
    ],
    [
      [-h, y, h],
      [-h, y, -h],
    ],
  ];
}

const CX = 780;
const CY = 300;
const S = 125;

const outer = cubeEdges(1).map(([a, b]) => [project(a, CX, CY, S), project(b, CX, CY, S)] as const);
const slabs = [...squareEdges(1, -0.34), ...squareEdges(1, 0.34)].map(
  ([a, b]) => [project(a, CX, CY, S), project(b, CX, CY, S)] as const,
);
const columns = ([-0.5, 0.5] as const)
  .flatMap((x) =>
    ([-0.5, 0.5] as const).map(
      (z) =>
        [
          [x, -1, z],
          [x, 1, z],
        ] as [V3, V3],
    ),
  )
  .map(([a, b]) => [project(a, CX, CY, S), project(b, CX, CY, S)] as const);

/** 決定的な擬似乱数（SSR とクライアントで同じ値になる） */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

const rand = lcg(20261021);
const dots = Array.from({ length: 30 }, () => {
  const ang = rand() * Math.PI * 2;
  const r = 60 + rand() * 230;
  const x = CX + 40 + Math.cos(ang) * r;
  const y = CY - 10 + Math.sin(ang) * r * 0.55 + (rand() - 0.5) * 60;
  return {
    x: x.toFixed(1),
    y: y.toFixed(1),
    r: (1.6 + rand() * 2.6).toFixed(1),
    color: rand() < 0.55 ? TEAL : BLUE,
    o: (0.35 + rand() * 0.5).toFixed(2),
  };
});

export function HeroFallback({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden
      className={className ?? "absolute inset-0 h-full w-full"}
      viewBox="0 0 1200 600"
      preserveAspectRatio="xMidYMid slice"
      focusable="false"
    >
      <defs>
        <radialGradient id="hf-glow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={TEAL} stopOpacity="0.28" />
          <stop offset="60%" stopColor={TEAL} stopOpacity="0.06" />
          <stop offset="100%" stopColor={TEAL} stopOpacity="0" />
        </radialGradient>
        {/* userSpaceOnUse：垂直線（幅 0 の bbox）でも描画されるようにする */}
        <linearGradient
          id="hf-frame"
          gradientUnits="userSpaceOnUse"
          x1="0"
          y1={CY + 150}
          x2="0"
          y2={CY - 150}
        >
          <stop offset="0%" stopColor={NAVY} stopOpacity="0.55" />
          <stop offset="55%" stopColor="#6d84c4" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.95" />
        </linearGradient>
      </defs>

      {/* 場の光 */}
      <ellipse cx={CX + 40} cy={CY + 20} rx="360" ry="220" fill="url(#hf-glow)" />

      {/* 営む：輪 */}
      <g fill="none" stroke={TEAL} strokeWidth="1" strokeOpacity="0.45">
        <ellipse cx={CX + 40} cy={CY + 30} rx="235" ry="78" />
        <ellipse
          cx={CX + 40}
          cy={CY + 30}
          rx="235"
          ry="78"
          transform={`rotate(-18 ${CX + 40} ${CY + 30})`}
          strokeOpacity="0.22"
        />
      </g>

      {/* つくる：骨組み */}
      <g fill="none" stroke="url(#hf-frame)" strokeWidth="1.1" strokeLinecap="round">
        {outer.map(([a, b], i) => (
          <line key={`o${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
        ))}
        <g strokeWidth="0.8" strokeOpacity="0.7">
          {slabs.map(([a, b], i) => (
            <line key={`s${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
          {columns.map(([a, b], i) => (
            <line key={`c${i}`} x1={a[0]} y1={a[1]} x2={b[0]} y2={b[1]} />
          ))}
        </g>
      </g>

      {/* 営む：光の粒 */}
      <g>
        {dots.map((d, i) => (
          <circle key={i} cx={d.x} cy={d.y} r={d.r} fill={d.color} fillOpacity={d.o} />
        ))}
      </g>
    </svg>
  );
}
