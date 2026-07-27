import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Sidebar from '@/components/layout/Sidebar';
import Navbar from '@/components/layout/Navbar';
import BottomNav from '@/components/layout/BottomNav';
import Providers from '@/components/Providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'RailMap Indonesia',
  description: 'Platform informasi jadwal dan pelacakan kereta api Indonesia',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="light">
      <body className={`${inter.className} bg-background text-foreground antialiased overflow-hidden`}>
        <Providers>
          <div className="flex h-screen w-full">
            <Sidebar />
            <div className="flex flex-col flex-1 h-full w-full overflow-hidden relative">
              <Navbar />
              <main className="flex-1 overflow-auto pb-16 md:pb-0 relative">
                {children}
              </main>
              <BottomNav />
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
