import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import './globals.css';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { AuthProvider } from '@/contexts/AuthContext';
import FacebookPixel from '@/components/analytics/FacebookPixel';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const poppins = Poppins({
  weight: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
  variable: '--font-poppins',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Debt Freedom Reset™ - The 90-Day System to Break Free From Financial Suffocation',
  description: 'You weren\'t born to live in debt. Transform your financial life in 90 days with the R.E.S.E.T. method.',
  keywords: 'debt freedom, financial freedom, debt management, budget app, South Africa, debt relief',
  openGraph: {
    title: 'Debt Freedom Reset™',
    description: 'Break free from financial suffocation in 90 days',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${poppins.variable}`}>
      <body className="antialiased" suppressHydrationWarning>
        <LanguageProvider>
          <AuthProvider>
            <FacebookPixel />
            {children}
          </AuthProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}

