import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL('http://localhost:3000'), // TODO: change URL before deploying
  title: "Blue Altair Social",
  description: 'Welcome to Blue Altair Social! Built this site is for a GraphQL vs REST API demo',
  icons: '/favicon.webp',
  keywords: 'Hacker News, Blue Altair, Yash Diniz, Next.js',
  openGraph: {
    type: 'website',
    title: 'Blue Altair Social',
    siteName: 'BA Social',
    images: {url:'/favicon.webp'},
    description: 'Welcome to Blue Altair Social! Built this site is for a GraphQL vs REST API demo'
  },
  twitter: {
    card: 'summary_large_image',
    site: '@BlueAltair1',
    creator: '@yashdiniz',
    title: 'Blue Altair Social',
    description: 'Welcome to Blue Altair Social! Built this site is for a GraphQL vs REST API demo'
  },
  robots: 'index follow',
  authors: [
    { name: 'Yash Diniz', url: 'https://yashdiniz.me'}
  ],
  creator: 'Yash Diniz',
  generator: 'Next.js',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
