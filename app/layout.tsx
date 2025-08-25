import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dropico - Drive with Dropico | Ride Easy, Arrive Happy",
  description: "Dropico - Your trusted car service. Book now or call for quick service. Ride easy, arrive happy.",
  icons: {
    icon: [
      { url: '/dropico-logo.png', type: 'image/png' },
    ],
    shortcut: '/dropico-logo.png',
    apple: '/dropico-logo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
