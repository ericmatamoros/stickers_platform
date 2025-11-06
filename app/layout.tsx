import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import { ChainCheckModal } from "@/components/ChainCheckModal";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JiraStickers - Sticker & GIF Gallery",
  description: "The ultimate Jirasan Gallery",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <ChainCheckModal />
          {children}
        </Providers>
      </body>
    </html>
  );
}

