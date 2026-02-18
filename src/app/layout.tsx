import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { TooltipProvider } from '@/components/ui/Tooltip';
import { ToastContainer } from 'react-toastify';
import WebMCPProvider from '@/components/WebMCPProvider';
import 'react-toastify/dist/ReactToastify.css';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MMC Dashboard',
  description: 'Real-time stock market dashboard',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans antialiased`}>
        <WebMCPProvider />
        <TooltipProvider delayDuration={200}>
          {children}
        </TooltipProvider>
        <ToastContainer
          position="bottom-right"
          autoClose={3000}
          theme="dark"
          toastClassName="bg-[#131313] text-white"
        />
      </body>
    </html>
  );
}
