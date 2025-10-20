import type { Metadata } from "next";
import "./globals.css";
import { ReduxProvider } from "./utils/store/provider";
import { poppins } from "./utils/fonts/poppins";
import ThemeProvider from "./utils/MUI Theme/theme-provider";
import ReactQueryProvicer from "./utils/react-query-provider/react-query-provider";
import CustomSnackbar from "./components/common/snake-bar/snake-bar";
import { playwriteUsModern } from "./utils/fonts/play-right-usa-modern";
import Header from "./components/common/header/header";
import Analytics from "./components/common/analytics/analytics";

export const metadata: Metadata = {
  title: "CRM",
  description: "POWER SOFT CRM",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playwriteUsModern.variable} !text-bg font-poppins min-h-dvh w-full antialiased`}
      >
        <ThemeProvider>
          <ReactQueryProvicer>
            <ReduxProvider>
              <section className="container px-4 relative z-10 translate-y-[70px] mx-auto">
                <Analytics />
              </section>
              <Header />

              <div className="mt-[100px] px-4">{children}</div>
              <CustomSnackbar />
            </ReduxProvider>
          </ReactQueryProvicer>
        </ThemeProvider>
      </body>
    </html>
  );
}
