import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const lightPixel7 = localFont({
  src: [
    {
      path: "../../public/fonts/light-pixel-7/light_pixel-7.ttf",
      weight: "400"
    },
    {
      path: "../../public/fonts/light-pixel-7/light_pixel-7.ttf",
      weight: "700"
    }
  ],
  variable: "--font-pixels"
});

export const metadata: Metadata = {
  title: "foc.fun",
  description: "Starknet App Engine"
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${lightPixel7.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
