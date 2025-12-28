import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
