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
import ModalProvider from "@/components/providers/ModalProvider"; // Импортируем ModalProvider
import ModalTrigger from "@/components/common/modal-trigger"; // Обработчик кликов для модалок

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: siteConfig.title,
    template: `%s | ${siteConfig.title}`,
  },
  description: siteConfig.description,
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="ru" className="light" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <Providers>
            <AppLoader>
              {/* Используем min-h-screen прямо здесь, чтобы прижать футер */}
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow pt-20">
                  <TitleHeader />
                  {children}
                </main>
                <Footer />
              </div>
            </AppLoader>
          </Providers>
        </SessionProvider>
        
        {/* ModalProvider должен быть здесь, после основного контента, 
            чтобы модалки рендерились поверх всего */}
        <ModalProvider />
        <ModalTrigger />
      </body>
    </html>
  );
}