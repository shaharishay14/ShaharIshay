import type { Metadata, Viewport } from "next";
import "./globals.css";

const description =
  "Shahar Ishay — full stack and mobile developer building production systems end to end.";

export const metadata: Metadata = {
  title: "Shahar Ishay",
  description,
  openGraph: {
    title: "Shahar Ishay",
    description,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#F3F2EF",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500&family=Schibsted+Grotesk:wght@500;600;700&display=swap"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
