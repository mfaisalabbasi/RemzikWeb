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
      <body suppressHydrationWarning={true}>
        {/* AlertProvider must wrap children so that 
          useAlert() can be called from any nested component or hook.
        */}
        <AlertProvider>
          <main>{children}</main>
        </AlertProvider>
      </body>
    </html>
  );
}
