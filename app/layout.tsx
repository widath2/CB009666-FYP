import type { Metadata } from "next";
import { Inter, Lexend } from "next/font/google";
import "./globals.css";
import ErrorBoundary from "@/components/ErrorBoundary";

const inter = Inter({ subsets: ["latin"] });
const lexend = Lexend({
  subsets: ["latin"],
  variable: "--font-lexend",
});

export const metadata: Metadata = {
  title: "Word-Whisper - Making Textbooks Accessible For Everyone",
  description:
    "AI-powered tool for text extraction, simplification, and audio conversion",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.className} ${lexend.variable}`}>
      <body className="antialiased">
        <ErrorBoundary>
          {children}
        </ErrorBoundary>
      </body>
    </html>
  );
}
