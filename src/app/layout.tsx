import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });

export const metadata: Metadata = {
  title: { default: 'OJAM | Premium Protein & Supplements', template: '%s | OJAM' },
  description: 'Premium quality protein supplements and nutrition products. Fuel your fitness journey with OJAM.',
  keywords: ['protein', 'whey protein', 'supplements', 'nutrition', 'fitness', 'gym', 'India'],
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),

  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'OJAM',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@ojam_in',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-IN" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
