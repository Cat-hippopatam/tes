import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers/provider";
import Header from "@/components/UI/layout/header";
import Footer from "@/components/UI/layout/footer"; 
import { siteConfig } from "@/config/site.config";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth/auth";
import AppLoader from "@/hoc/app-loader";
import TitleHeader from "@/components/UI/layout/title-header";
import ModalProvider from "@/components/providers/ModalProvider";
import ModalTrigger from "@/components/common/modal-trigger";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const baseUrl = 'https://economikus.ru';

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  keywords: ['финансы', 'инвестиции', 'обучение', 'курсы', 'финансовая грамотность'],
  authors: [{ name: 'Economikus' }],
  creator: 'Economikus',
  publisher: 'Economikus',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: baseUrl,
    siteName: siteConfig.title,
    title: siteConfig.title,
    description: siteConfig.description,
    images: [
      {
        url: `${baseUrl}/images/og-default.png`,
        width: 1200,
        height: 630,
        alt: siteConfig.title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.title,
    description: siteConfig.description,
    images: [`${baseUrl}/images/og-default.png`],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: baseUrl,
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
    other: [
      {
        rel: "icon",
        type: "image/svg+xml",
        url: "/favicon.svg",
      },
    ],
  },
  manifest: "/site.webmanifest",
};

// Schema.org JSON-LD для организации
const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  "name": "Economikus",
  "description": "Образовательная платформа по финансам и инвестициям",
  "url": baseUrl,
  "logo": `${baseUrl}/images/logo.svg`,
  "sameAs": [
    "https://vk.com/economikus",
    "https://t.me/economikus"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": "+7-999-999-99-99",
    "contactType": "customer service",
    "availableLanguage": "Russian"
  },
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "RUB",
    "availability": "https://schema.org/InStock"
  }
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ru" className="light" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Providers>
            <AppLoader>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow">
                  <TitleHeader />
                  {children}
                </main>
                <Footer />
              </div>
              <ModalProvider />
              <ModalTrigger />
            </AppLoader>
          </Providers>
        </SessionProvider>
      </body>
    </html>
  );
}