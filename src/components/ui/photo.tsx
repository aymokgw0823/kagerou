import Image from "next/image";
import { resolvePhoto } from "@/config/photo-manifest";
import { showDummyBadges } from "@/lib/dummy";
import { cn } from "@/lib/utils";

type Props = {
  /** photo-manifest の id */
  id: string;
  /** alt を上書きしたい場合 */
  alt?: string;
  sizes?: string;
  priority?: boolean;
  /** 親要素いっぱいに敷く（親に position と高さが必要） */
  fill?: boolean;
  className?: string;
  imgClassName?: string;
};

/**
 * マニフェスト経由で写真を表示する唯一の入口。
 * 実写真が未設定ならダミー画像を表示し、開発環境では PLACEHOLDER バッジを重ねる。
 */
export function Photo({ id, alt, sizes, priority, fill, className, imgClassName }: Props) {
  const photo = resolvePhoto(id);
  const badge =
    photo.isPlaceholder && showDummyBadges ? (
      <span
        aria-hidden
        className="rounded-brand border-notice bg-paper/90 text-notice pointer-events-none absolute top-2 left-2 z-10 border px-1.5 py-px font-mono text-[10px] tracking-wider uppercase"
      >
        Placeholder
      </span>
    ) : null;

  if (fill) {
    // 呼び出し側が absolute で敷く場合は relative を付けない（position クラスの競合で高さ 0 になるのを防ぐ）
    const positioned = className?.split(/\s+/).some((c) => c === "absolute" || c === "fixed");
    return (
      <span className={cn("block overflow-hidden", !positioned && "relative", className)}>
        <Image
          src={photo.src}
          alt={alt ?? photo.alt}
          fill
          sizes={sizes ?? "100vw"}
          priority={priority}
          className={cn("object-cover", imgClassName)}
        />
        {badge}
      </span>
    );
  }

  return (
    <span className={cn("relative block overflow-hidden", className)}>
      <Image
        src={photo.src}
        alt={alt ?? photo.alt}
        width={photo.width}
        height={photo.height}
        sizes={sizes ?? "(min-width: 1024px) 50vw, 100vw"}
        priority={priority}
        className={cn("h-auto w-full", imgClassName)}
      />
      {badge}
    </span>
  );
}
