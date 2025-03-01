import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/common/Header";
import { UpdateNotifier } from "@/components/common/UpdateNotifier";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "お金貸し借り清算アプリ",
  description: "友達、イベントでのグループなどお金の貸し借りを忘れないために管理するツールです。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ja">
      <head>
        {/* PWA マニフェスト */}
        <link rel="manifest" href="/manifest.json" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="192x192" href="/pwa_icon_192x192.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/pwa_icon_512x512.png" />

        {/* PWA のテーマカラー */}
        <meta name="theme-color" content="#007bff" />

        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" type="image/x-icon" />
      </head>
      <body className={cn(fontSans.variable)}>
        <UpdateNotifier />
        <Header />
        <div className="max-w-4xl p-3 m-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
