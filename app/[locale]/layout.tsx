import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { AuthProvider } from '@/lib/auth/auth-context'
import { ScrollRestoration } from '@/app/scroll-restoration'
import DevOverlay from '@/components/dev/dev-overlay'
import { PageTransition } from '@/components/page-transition'
import '../globals.css'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
})

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'seo' })
  const baseUrl = 'https://swimai.app'

  return {
    metadataBase: new URL(baseUrl),
    title: {
      default: t("homeTitle"),
      template: `%s | ${t("siteName")}`,
    },
    description: t("homeDescription"),
    manifest: "/manifest.webmanifest",
    applicationName: "SwimAI",
    appleWebApp: {
      capable: true,
      statusBarStyle: "black-translucent",
      title: "SwimAI",
    },
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        "fr": `${baseUrl}/fr`,
        "en": `${baseUrl}/en`,
      },
    },
    icons: {
      icon: [
        { url: "/icon.svg", type: "image/svg+xml" },
      ],
      apple: [
        { url: "/icon.svg", sizes: "any" },
      ],
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d2a52',
  width: 'device-width',
  initialScale: 1,
  minimumScale: 1,
  viewportFit: 'cover',
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode
  params: Promise<{ locale: string }>
}>) {
  const { locale } = await params
  const messages = await getMessages()

  return (
    <html lang={locale} className={`dark ${inter.variable}`}>
      <body className="bg-background font-sans antialiased overflow-y-scroll [padding-top:env(safe-area-inset-top,0px)]">
        <div
          className="fixed inset-x-0 top-0 z-[100] backdrop-blur-md"
          style={{
            height: "env(safe-area-inset-top, 0px)",
            background: "linear-gradient(to bottom, rgba(5,11,26,0.6) 0%, rgba(5,11,26,0) 100%)"
          }}
          aria-hidden="true"
        />
        <ScrollRestoration />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            <PageTransition>{children}</PageTransition>
            {process.env.NODE_ENV === 'development' && <DevOverlay />}
          </AuthProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
