import type { Metadata } from "next";
import localFont from "next/font/local";
import { VT323 } from "next/font/google";
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

const vt323 = VT323({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-vt323"
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
        className={`${lightPixel7.variable} ${vt323.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
