//import { Inter } from "next/font/google";
import "./globals.css";
import { UserProvider } from '@/contexts/UserContext';

//const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Système d'Évaluation des Enseignants",
  description: "Plateforme d'évaluation interactive pour les universités",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body>
        <UserProvider>  {/* Le UserProvider doit englober l'application */}
          {children}
        </UserProvider>
      </body>
    </html>
  );
}