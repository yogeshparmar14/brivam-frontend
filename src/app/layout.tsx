import type { Metadata } from 'next';
import { Inter, Syne } from 'next/font/google';
import './globals.css';
import Providers from '@/components/Providers';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const syne = Syne({ subsets: ['latin'], variable: '--font-syne' });

export const metadata: Metadata = {
  title: { default: 'BRIVAM | Premium Protein & Supplements', template: '%s | BRIVAM' },
  description: 'Premium quality protein supplements and nutrition products. Fuel your fitness journey with BRIVAM.',
  keywords: ['protein', 'whey protein', 'supplements', 'nutrition', 'fitness', 'gym', 'India'],
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'BRIVAM',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${syne.variable}`}>
      <body className="min-h-screen flex flex-col bg-white antialiased">
        <Providers>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
