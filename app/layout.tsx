import "./globals.css";
import { AlertProvider } from "./integrations/Alert/AlertContext";

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
        <AlertProvider>{children}</AlertProvider>
      </body>
    </html>
  );
}
