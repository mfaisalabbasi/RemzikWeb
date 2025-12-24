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
      <body className="bg-gray-50 text-gray-800">
        {/* Navbar */}
        {/* <header className="bg-white shadow-md fixed w-full z-50">
          <nav className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <Link href="/" className="text-2xl font-bold text-green-600">
              Remzik
            </Link>
            <div className="flex gap-4 items-center">
              <a
                href="#how-it-works"
                className="hover:text-green-600 font-semibold"
              >
                How It Works
              </a>

              <GetStartedCTA />
            </div>
          </nav>
        </header> */}
        <Navbar />

        {/* Page content */}
        <main className="pt-24">{children}</main>

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
