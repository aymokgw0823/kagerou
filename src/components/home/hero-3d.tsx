"use client";

/**
 * トップのヒーロー 3D 演出（React Three Fiber）。
 * 「つくる」＝線で描いた建物の骨組み（紺〜白）と「営む」＝柔らかく漂う光の粒と輪（ティール〜緑）が、
 * ゆっくり回転・呼吸しながら中央で重なり、ひとつの「場」に収束する。
 * - ポストプロセスなし、頂点数は数百程度
 * - 画面外・タブ非表示では描画を止める（frameloop を切り替える）
 * - prefers-reduced-motion のときは静止画（1 フレームだけ描画）
 * このファイルは hero-scene.tsx から next/dynamic（ssr: false）で遅延読み込みされる。
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Canvas, useFrame, useThree, type RootState } from "@react-three/fiber";
import { useReducedMotion } from "motion/react";
import {
  AdditiveBlending,
  BufferGeometry,
  CanvasTexture,
  Color,
  Float32BufferAttribute,
  Group,
  LineBasicMaterial,
  PointsMaterial,
  SpriteMaterial,
} from "three";

const NAVY = new Color("#012169");
const WHITE = new Color("#ffffff");
const TEAL = new Color("#0d8390");
const GREEN = new Color("#86bc25");

/** 1 周にかける秒数 */
const SPIN_FRAME = 52;
const SPIN_CLOUD = 64;
/** 2 つのかたちが中央に収束するまでの秒数 */
const CONVERGE = 14;
/** 光の粒の数 */
const POINT_COUNT = 320;

type V3 = readonly [number, number, number];

const smooth = (x: number) => {
  const t = Math.min(Math.max(x, 0), 1);
  return t * t * (3 - 2 * t);
};
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** 決定的な擬似乱数（再マウントしても同じ配置になる） */
function lcg(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

/** つくる：骨組み（立方体の稜線＋床スラブ＋柱）。高さに応じて紺→白 */
function buildFrame(): BufferGeometry {
  const pos: number[] = [];
  const col: number[] = [];
  const H = 1.1;
  const c = new Color();
  const seg = (a: V3, b: V3) => {
    for (const p of [a, b]) {
      pos.push(p[0], p[1], p[2]);
      const t = 0.25 + 0.75 * ((p[1] + H) / (2 * H));
      c.copy(NAVY).lerp(WHITE, t);
      col.push(c.r, c.g, c.b);
    }
  };
  const ends = [-H, H] as const;
  // 稜線 12 本
  for (const y of ends) for (const z of ends) seg([-H, y, z], [H, y, z]);
  for (const x of ends) for (const z of ends) seg([x, -H, z], [x, H, z]);
  for (const x of ends) for (const y of ends) seg([x, y, -H], [x, y, H]);
  // 床スラブ 2 枚
  for (const y of [-0.37, 0.37]) {
    seg([-H, y, -H], [H, y, -H]);
    seg([H, y, -H], [H, y, H]);
    seg([H, y, H], [-H, y, H]);
    seg([-H, y, H], [-H, y, -H]);
  }
  // 柱 4 本
  for (const x of [-0.5, 0.5]) for (const z of [-0.5, 0.5]) seg([x, -H, z], [x, H, z]);

  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setAttribute("color", new Float32BufferAttribute(col, 3));
  return g;
}

type Cloud = {
  geometry: BufferGeometry;
  base: Float32Array;
  phase: Float32Array;
  speed: Float32Array;
};

/** 営む：扁平な楕円体の中に漂う光の粒。ティール→緑 */
function buildCloud(): Cloud {
  const rand = lcg(20261021);
  const base = new Float32Array(POINT_COUNT * 3);
  const col = new Float32Array(POINT_COUNT * 3);
  const phase = new Float32Array(POINT_COUNT);
  const speed = new Float32Array(POINT_COUNT);
  const c = new Color();
  for (let i = 0; i < POINT_COUNT; i++) {
    const r = 0.45 + 1.35 * Math.sqrt(rand());
    const th = rand() * Math.PI * 2;
    const y = (rand() - 0.5) * 1.6 * (1 - r / 2.4);
    base[i * 3] = Math.cos(th) * r;
    base[i * 3 + 1] = y;
    base[i * 3 + 2] = Math.sin(th) * r;
    c.copy(TEAL).lerp(GREEN, Math.pow(rand(), 1.6));
    col[i * 3] = c.r;
    col[i * 3 + 1] = c.g;
    col[i * 3 + 2] = c.b;
    phase[i] = rand() * Math.PI * 2;
    speed[i] = 0.25 + rand() * 0.35;
  }
  const geometry = new BufferGeometry();
  geometry.setAttribute("position", new Float32BufferAttribute(base.slice(), 3));
  geometry.setAttribute("color", new Float32BufferAttribute(col, 3));
  return { geometry, base, phase, speed };
}

/** 輪（場）。半径 r の円を線で */
function buildRing(r: number, n = 96): BufferGeometry {
  const pos: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2;
    pos.push(Math.cos(a) * r, 0, Math.sin(a) * r);
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  return g;
}

/** 柔らかい丸のテクスチャ（粒・グロー用） */
function makeSoftDot(): CanvasTexture {
  const size = 64;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.3, "rgba(255,255,255,0.55)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
  }
  const tex = new CanvasTexture(canvas);
  tex.needsUpdate = true;
  return tex;
}

function Scene({ animate }: { animate: boolean }) {
  const viewport = useThree((s) => s.viewport);
  const frame = useMemo(() => buildFrame(), []);
  const cloud = useMemo(() => buildCloud(), []);
  const ringA = useMemo(() => buildRing(1.55), []);
  const ringB = useMemo(() => buildRing(1.9, 128), []);
  const dot = useMemo(() => makeSoftDot(), []);

  useEffect(
    () => () => {
      frame.dispose();
      cloud.geometry.dispose();
      ringA.dispose();
      ringB.dispose();
      dot.dispose();
    },
    [frame, cloud, ringA, ringB, dot],
  );

  const frameRef = useRef<Group>(null);
  const cloudRef = useRef<Group>(null);
  const frameMat = useRef<LineBasicMaterial>(null);
  const pointsMat = useRef<PointsMaterial>(null);
  const ringMatA = useRef<LineBasicMaterial>(null);
  const ringMatB = useRef<LineBasicMaterial>(null);
  const glowMat = useRef<SpriteMaterial>(null);

  // 見出しは左。横長なら右寄りに、縦長なら小さく下寄りに置く
  const portrait = viewport.aspect < 1;
  const rootPos: V3 = portrait ? [0.3, -viewport.height * 0.24, 0] : [viewport.width * 0.21, -0.1, 0];
  const rootScale = portrait ? 0.62 : 1;
  // 縦長では見出しと重なるので全体を少し薄くする
  const dim = portrait ? 0.7 : 1;

  useFrame(({ clock }) => {
    const t = animate ? clock.elapsedTime : CONVERGE;
    const conv = smooth(t / CONVERGE);
    const fade = smooth(t / 2.5) * dim;
    const breathe = Math.sin((t * Math.PI * 2) / 9);

    const f = frameRef.current;
    if (f) {
      f.position.set(lerp(-1.3, -0.12, conv), lerp(0.55, 0.08, conv), 0);
      f.rotation.set(0.42, 0.6 + (t * Math.PI * 2) / SPIN_FRAME, 0);
      f.scale.setScalar(1 + 0.02 * breathe);
    }
    const cl = cloudRef.current;
    if (cl) {
      cl.position.set(lerp(1.3, 0.12, conv), lerp(-0.45, -0.08, conv), 0);
      cl.rotation.set(0.35, -(t * Math.PI * 2) / SPIN_CLOUD, 0);
      cl.scale.setScalar(1 + 0.035 * Math.sin((t * Math.PI * 2) / 11 + 1));
    }

    // 粒のゆらぎ
    const attr = cloud.geometry.getAttribute("position");
    const arr = attr.array as Float32Array;
    const { base, phase, speed } = cloud;
    for (let i = 0; i < POINT_COUNT; i++) {
      const p = phase[i];
      const s = speed[i];
      arr[i * 3] = base[i * 3] + 0.07 * Math.sin(t * s + p);
      arr[i * 3 + 1] = base[i * 3 + 1] + 0.05 * Math.sin(t * s * 0.8 + p * 1.7);
      arr[i * 3 + 2] = base[i * 3 + 2] + 0.07 * Math.cos(t * s * 0.9 + p * 2.3);
    }
    attr.needsUpdate = true;

    if (frameMat.current) frameMat.current.opacity = 0.72 * fade;
    if (pointsMat.current) {
      pointsMat.current.opacity = 0.9 * fade;
      pointsMat.current.size = 0.11 + 0.012 * breathe;
    }
    if (ringMatA.current) ringMatA.current.opacity = 0.34 * fade;
    if (ringMatB.current) ringMatB.current.opacity = 0.16 * fade;
    if (glowMat.current) glowMat.current.opacity = (0.16 + 0.02 * breathe) * fade;
  });

  return (
    <group position={rootPos} scale={rootScale}>
      <sprite scale={[6.5, 6.5, 1]} position={[0, 0, -0.5]}>
        <spriteMaterial
          ref={glowMat}
          map={dot}
          color={TEAL}
          transparent
          opacity={0}
          depthWrite={false}
          blending={AdditiveBlending}
        />
      </sprite>

      <group ref={frameRef}>
        <lineSegments geometry={frame}>
          <lineBasicMaterial ref={frameMat} vertexColors transparent opacity={0} depthWrite={false} />
        </lineSegments>
      </group>

      <group ref={cloudRef}>
        <points geometry={cloud.geometry}>
          <pointsMaterial
            ref={pointsMat}
            map={dot}
            vertexColors
            transparent
            opacity={0}
            size={0.11}
            sizeAttenuation
            depthWrite={false}
            blending={AdditiveBlending}
          />
        </points>
        <lineLoop geometry={ringA}>
          <lineBasicMaterial ref={ringMatA} color={TEAL} transparent opacity={0} depthWrite={false} />
        </lineLoop>
        <lineLoop geometry={ringB} rotation={[0.5, 0, 0.3]}>
          <lineBasicMaterial ref={ringMatB} color={GREEN} transparent opacity={0} depthWrite={false} />
        </lineLoop>
      </group>
    </group>
  );
}

type Props = {
  /** 最初のフレームが描画されたら呼ぶ（フォールバックからのクロスフェード用） */
  onReady?: () => void;
};

export default function Hero3D({ onReady }: Props) {
  const wrap = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [inView, setInView] = useState(true);
  const [tabVisible, setTabVisible] = useState(true);

  useEffect(() => {
    const el = wrap.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry?.isIntersecting ?? true), {
      threshold: 0,
    });
    io.observe(el);
    const onVis = () => setTabVisible(document.visibilityState === "visible");
    document.addEventListener("visibilitychange", onVis);
    return () => {
      io.disconnect();
      document.removeEventListener("visibilitychange", onVis);
    };
  }, []);

  const frameloop = reduced ? "demand" : inView && tabVisible ? "always" : "never";

  const handleCreated = (state: RootState) => {
    state.gl.setClearColor(0x000000, 0);
    // 1 フレーム描画された後に通知（フォールバックをフェードアウトさせる）
    requestAnimationFrame(() => requestAnimationFrame(() => onReady?.()));
  };

  return (
    <div ref={wrap} className="h-full w-full">
      <Canvas
        dpr={[1, 1.5]}
        frameloop={frameloop}
        gl={{ antialias: true, powerPreference: "low-power", alpha: true }}
        camera={{ position: [0, 0, 8], fov: 38, near: 0.1, far: 40 }}
        onCreated={handleCreated}
        resize={{ debounce: 120 }}
      >
        <Scene animate={!reduced} />
      </Canvas>
    </div>
  );
}
