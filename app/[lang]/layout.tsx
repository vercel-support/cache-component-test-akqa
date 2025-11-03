import { ReactNode } from 'react'

interface LayoutProps {
  children: ReactNode
  params: Promise<{ lang: string }>
}

export async function generateStaticParams() {
  // Generate static params for common languages
  // This is required for Next.js 16 caching with dynamic routes in production
  return [
    { lang: 'en' },
    { lang: 'es' },
    { lang: 'fr' },
    { lang: 'de' },
    { lang: 'it' },
  ]
}

export default async function LangLayout({ children }: LayoutProps) {
  // This layout provides generateStaticParams for the [lang] route
  // The html/body tags are already in the root layout
  return <>{children}</>
}

