import type { Metadata } from "next";
import { Noto_Sans_KR } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import { DesktopSidebar, MobileHeader } from "@/components/layout/sidebar";
import "./globals.css";

const notoSansKR = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "업무일지",
  description: "노션 기반 업무일지 관리 시스템",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "업무일지",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className={`${notoSansKR.className}`}>
        <ThemeProvider>
          <div className="flex min-h-screen">
            <DesktopSidebar />
            <div className="flex flex-1 flex-col">
              <MobileHeader />
              <main className="flex-1 px-4 py-8 md:px-10">
                <div className="mx-auto max-w-5xl animate-fade-in-up">
                  {children}
                </div>
              </main>
            </div>
          </div>
          <Toaster position="top-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
