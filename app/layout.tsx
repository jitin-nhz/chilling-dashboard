import type { Metadata } from "next";
import "./globals.css";
import GlobalHeader from "@/components/GlobalHeader";
import Sidebar from "@/components/Sidebar";

export const metadata: Metadata = {
  title: "ChillingApp — AI Analytics Dashboard",
  description: "Viewership-Powered Ads Placement & Recommendation Engine — TheNineHertz",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased" style={{ background: "#F4F6F8" }}>
        <GlobalHeader />
        <Sidebar />
        <main
          id="main-content"
          style={{
            marginTop: 64,
            marginLeft: 220,
            minHeight: "calc(100vh - 64px)",
            padding: "24px",
            transition: "margin-left 0.3s",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}
