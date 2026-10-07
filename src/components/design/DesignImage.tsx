import type { DesignImage as Image } from "../../data/designWork";

/** A real Figma export (16:10) in two sizes. */
export function DesignImage({ image, sizes, className }: { image: Image; sizes: string; className?: string }) {
  return (
    <img
      src={`${image.src}-800.webp`}
      srcSet={`${image.src}-800.webp 800w, ${image.src}-1600.webp 1600w`}
      sizes={sizes}
      width={800}
      height={500}
      alt={image.alt}
      loading="lazy"
      decoding="async"
      className={className}
      style={{ width: "100%", height: "auto", aspectRatio: "16 / 10", objectFit: "cover", objectPosition: "top" }}
    />
  );
}
