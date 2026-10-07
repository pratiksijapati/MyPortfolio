import type { ProjectImage as Image } from "../../data/projects";
import { srcSet } from "../../lib/projects";

interface Props {
  image: Image;
  sizes: string;
  className?: string;
  eager?: boolean;
}

/** Responsive WebP image with known dimensions (no layout shift). */
export function ProjectImage({ image, sizes, className, eager = false }: Props) {
  const w = image.widths[0];
  return (
    <img
      src={`${image.src}-${w}.webp`}
      srcSet={srcSet(image.src, image.widths)}
      sizes={sizes}
      width={w}
      height={Math.round(w / image.ratio)}
      alt={image.alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
    />
  );
}
