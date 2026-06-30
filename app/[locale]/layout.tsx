import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages, getTranslations } from 'next-intl/server'
import { AuthProvider } from '@/lib/auth/auth-context'
import { ScrollRestoration } from '@/app/scroll-restoration'
import DevOverlay from '@/components/dev/dev-overlay'
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
      default: t('homeTitle'),
      template: `%s | ${t('siteName')}`,
    },
    description: t('homeDescription'),
    alternates: {
      canonical: `${baseUrl}/${locale}`,
      languages: {
        'fr': `${baseUrl}/fr`,
        'en': `${baseUrl}/en`,
      },
    },
    icons: {
      icon: [
        { url: '/favicon.ico', sizes: 'any' },
        { url: '/icon.svg', type: 'image/svg+xml' },
      ],
      apple: '/apple-icon.png',
    },
  }
}

export const viewport: Viewport = {
  colorScheme: 'dark',
  themeColor: '#0d2a52',
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
      <body className="bg-background font-sans antialiased overflow-y-scroll">
        <ScrollRestoration />
        <NextIntlClientProvider messages={messages}>
          <AuthProvider>
            {children}
            {process.env.NODE_ENV === 'development' && <DevOverlay />}
          </AuthProvider>
        </NextIntlClientProvider>
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
