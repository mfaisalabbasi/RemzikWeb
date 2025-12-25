import "./globals.css";
import Link from "next/link";
import GetStartedCTA from "./components/GetStarted";
import Navbar from "./components/Navbar";
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
        <footer className="bg-white mt-12 shadow-inner">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-gray-600">
            © {new Date().getFullYear()} Remzik. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
