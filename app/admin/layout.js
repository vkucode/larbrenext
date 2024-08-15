import { Inter } from "next/font/google";
import "../globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import GoogleAnalytics from "../components/GoogleAnalytics";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Console d'administration",
  description: "",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <GoogleAnalytics trackingId="G-YLSK8Z9KJ3" />
      <body className={inter.className}>
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
