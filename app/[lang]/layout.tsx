import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  params: Promise<{ lang: string; }>;
}

export async function generateStaticParams() {
  // Get the same languages from parent route
  const langs = ['en', 'es', 'fr', 'de', 'it'];

  return langs.map((lang) => ({
    lang,
  }));
}

export default async function LangSlugLayout({ children }: LayoutProps) {
  return <>{children}</>;
}
