import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shahar Ishay - Full Stack Developer",
  description: "SaaS Developer. Founder of SuperSave.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
