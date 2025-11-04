import { getCache } from '@vercel/functions';
import { type ReactElement, Suspense } from 'react';

interface PageProps {
  params: Promise<{ lang: string; slug: string[]; }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}

export default function DebugPage({ params, searchParams }: PageProps): ReactElement {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <DebugPageContent params={params} searchParams={searchParams} />
    </Suspense>
  );
}

async function DebugPageContent({ params, searchParams }: PageProps): Promise<ReactElement> {
  const { lang, slug } = await params;
  const queryParams = await searchParams;

  // Access individual query parameters by name
  const search = queryParams.search as string | undefined;
  const id = queryParams.id as string | undefined;

  // Or get all query params as an object
  console.log('All query params:', queryParams);
  console.log('Search param:', search);

  // Build query string for display/caching if needed
  // Handle arrays properly (e.g., ?tags=tag1&tags=tag2)
  const queryString = Object.entries(queryParams)
    .filter(([_, value]) => value !== undefined)
    .flatMap(([key, value]) => {
      const values = Array.isArray(value) ? value : [value];
      return values.map((v) => [key, v as string]);
    })
    .reduce((params, [key, value]) => {
      params.append(key, value);
      return params;
    }, new URLSearchParams())
    .toString();

  const data = await getCachedDebugPageData(lang, slug, queryString);

  return <div>{data}</div>;
}

// IMPORTANT: In Next.js 16, functions with 'use cache' that receive dynamic route params
// need generateStaticParams at the route level to work properly in Vercel
// The [lang]/[...slug]/layout.tsx now includes generateStaticParams with both lang and slug params
// For catch-all routes with dynamic slugs, returning slug: [] enables runtime generation
// while maintaining cache compatibility for Cache Components
async function getCachedDebugPageData(lang: string, slug: string[], queryString: string): Promise<string> {
  const cache = getCache();

  // Use both global and language-specific cache tags
  const cachedData = await cache.get(`debug:${lang.toLowerCase()}/${slug.join('/')}${queryString ? `?${queryString}` : ''}`);
  if (cachedData) {
    return cachedData as string;
  }

  const data = `Fetched from server at ${new Date().toISOString()} for ${lang}/${slug.join('/')}${queryString ? `?${queryString}` : ''}`;
  await cache.set(`debug:${lang.toLowerCase()}/${slug.join('/')}${queryString ? `?${queryString}` : ''}`, data);
  return data;
}
