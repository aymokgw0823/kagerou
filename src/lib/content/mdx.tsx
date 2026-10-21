import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import Link from "next/link";
import type { ComponentProps } from "react";

function A({ href = "", ...rest }: ComponentProps<"a">) {
  if (href.startsWith("/")) return <Link href={href} {...rest} />;
  const external = /^https?:\/\//.test(href);
  return <a href={href} {...rest} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} />;
}

const components = { a: A };

/** MDX 本文をサーバーで描画する。見出しには id が付与される（目次と連動） */
export function Mdx({ source }: { source: string }) {
  return (
    <MDXRemote
      source={source}
      components={components}
      options={{ mdxOptions: { remarkPlugins: [remarkGfm], rehypePlugins: [rehypeSlug] } }}
    />
  );
}
