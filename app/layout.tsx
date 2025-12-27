import "./globals.css";
import Link from "next/link";
import GetStartedCTA from "./components/public/GetStarted";
import Navbar from "./components/public/Navbar";
import Footer from "./components/public/Footer";
export const metadata = {
  title: "Remzik",
  description: "Shariah-compliant real-world asset tokenization platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {/* Page content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
