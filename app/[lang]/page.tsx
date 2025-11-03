import { cacheTag } from "next/cache";
import { type ReactElement, Suspense } from "react";

interface PageProps {
  params: Promise<{ lang: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default function DebugPage({
  params,
  searchParams,
}: PageProps): ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DebugPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function DebugPageContent({ params }: PageProps): Promise<ReactElement> {
  const { lang } = await params;
  const data = await getCachedDebugPageData(lang);

  return <div>{data}</div>;
}

// IMPORTANT: In Next.js 16, functions with 'use cache' that receive dynamic route params
// need generateStaticParams at the parent route level ([lang]/layout.tsx) to work properly in Vercel
// The [lang] layout now includes generateStaticParams, so caching should work in production
async function getCachedDebugPageData(lang: string): Promise<string> {
  "use cache";

  // Use both global and language-specific cache tags
  cacheTag("debug");

  return Promise.resolve(
    `Fetched from server at ${new Date().toISOString()} for ${lang}`,
  );
}
