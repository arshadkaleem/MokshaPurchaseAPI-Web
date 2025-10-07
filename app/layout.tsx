import { QueryProvider } from '@/lib/providers/query-provider';
import { AuthProvider } from '@/lib/contexts/auth-context';
import { Toaster } from '@/components/ui/toaster';
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
        <QueryProvider>
          {children}
        </QueryProvider>
        </AuthProvider>
        {/* Add Toaster here */}
        <Toaster />
      </body>
    </html>
  );
}