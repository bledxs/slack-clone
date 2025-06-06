import "./globals.css";

import { Metadata } from "next";
import { Inter } from "next/font/google";

import { ConvexClientProvider } from "@/components/convex-client-provider";
import { JotaiProvider } from "@/components/jotai-providder";
import { Modals } from "@/components/modals";
import { Toaster } from "@/components/ui/sonner";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Slack Clone",
  description: "This is a project to create a slack clone",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ConvexAuthNextjsServerProvider>
      <html lang="en">
        <body className={inter.className}>
          <ConvexClientProvider>
            <JotaiProvider>
              <Toaster />
              <Modals />
              {children}
            </JotaiProvider>
          </ConvexClientProvider>
        </body>
      </html>
    </ConvexAuthNextjsServerProvider>
  );
}
