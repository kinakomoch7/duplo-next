import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Header } from "@/components/common/Header";

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
})

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
    <html lang="en" >
      <body className={cn(fontSans.variable)}>
        <Header />
        <div className="max-w-4xl p-3 m-auto">
          {children}
        </div>
      </body>
    </html>
  );
}
