import type { Metadata } from "next";
import { Xanh_Mono } from 'next/font/google'
import "./globals.css";
import Pecita from 'next/font/local'

const pecita = Pecita({
  src: './assets/font/Pecita.otf',
  variable: "--font-pecita",
});

const goudy = Xanh_Mono({
  variable: '--font-serif',
  weight: '400',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: "thoughtilets",
  description: "-thcl",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${pecita.variable} ${goudy.variable}`}>
        {children}
      </body>
    </html>
  );
}
