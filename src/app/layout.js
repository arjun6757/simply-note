import { Geist_Mono } from "next/font/google";
import { Inter } from "next/font/google";
import { Open_Sans } from "next/font/google";
import "./globals.css";
import MountProvider from "@/context/mount-provider";

const inter = Inter({
  variable: "--font-inter-sans",
  subsets: ["latin"],
});

const open = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Simply Note",
  description:
    "A simple note taking application to store your sweet notes and ideas.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
          (function() {
                const localTheme = localStorage.getItem('simply-note-theme') || 'system'
                const html = document.documentElement;
                if(localTheme === 'dark' || (localTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  html.classList.add('dark');
                  html.style.colorScheme='dark';
                }

              })();
          `,
          }}
        />
      </head>
      <body
        className={`${inter.variable} ${open.variable} ${geistMono.variable} antialiased`}
      >
        <MountProvider>{children}</MountProvider>
      </body>
    </html>
  );
}
