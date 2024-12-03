import { Suspense } from 'react';
import RouterApp from '@/routes';
import { Providers } from '@/lib/providers';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Providers>
          <Suspense fallback={<div>Loading...</div>}>
            <RouterApp />
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}