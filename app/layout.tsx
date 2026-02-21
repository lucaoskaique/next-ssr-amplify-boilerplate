import type { Metadata } from 'next';
import { Outfit } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/contexts/theme-context';
import { FontProvider } from '@/contexts/font-context';

const bodyFont = Outfit({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Next SSR Amplify',
  description: 'Next.js SSR Application with AWS Amplify',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log(
    '[Client/Server] RootLayout - API_SERVER_URL:',
    process.env.API_SERVER_URL,
  );
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${bodyFont.className} bg-background text-foreground`}>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('app-theme') || 'light';
                const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                const effectiveTheme = theme === 'system' ? systemTheme : theme;
                document.documentElement.classList.add(effectiveTheme);
              } catch (e) {}
            `,
          }}
        />
        <ThemeProvider>
          <FontProvider>
            {children}
            <Toaster />
          </FontProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
