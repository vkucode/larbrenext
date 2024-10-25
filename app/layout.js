import { Inter } from "next/font/google";
import "./globals.css";
import GoogleAnalytics from "./components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "L'Arbre a Pains",
  description: "L'Arbre a Pains",
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <GoogleAnalytics trackingId="G-YLSK8Z9KJ3" />
      <body className={inter.className}>{children}</body>
    </html>
  );
}
