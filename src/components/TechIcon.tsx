import {
  siCss,
  siDjango,
  siFastapi,
  siFigma,
  siGit,
  siGithub,
  siHtml5,
  siJavascript,
  siJsonwebtokens,
  siMysql,
  siNeon,
  siNumpy,
  siPandas,
  siPhp,
  siPostgresql,
  siPython,
  siReact,
  siReactquery,
  siRender,
  siScikitlearn,
  siStreamlit,
  siTailwindcss,
  siTypescript,
  siVercel,
  siVite,
  type SimpleIcon,
} from "simple-icons";

// Named imports keep the bundle to only the icons actually used.
const icons: Record<string, SimpleIcon> = Object.fromEntries(
  [
    siCss, siDjango, siFastapi, siFigma, siGit, siGithub, siHtml5, siJavascript, siJsonwebtokens,
    siMysql, siNeon, siNumpy, siPandas, siPhp, siPostgresql, siPython, siReact, siReactquery,
    siRender, siScikitlearn, siStreamlit, siTailwindcss, siTypescript, siVercel, siVite,
  ].map((i) => [i.slug, i]),
);

export function TechIcon({ slug, size = 18 }: { slug: string; size?: number }) {
  const icon = icons[slug];
  if (!icon) return null;
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}
