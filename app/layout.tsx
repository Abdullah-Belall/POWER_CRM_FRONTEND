"use client";
import "./globals.css";
import { ReduxProvider } from "./utils/store/provider";
import { poppins } from "./utils/fonts/poppins";
import ThemeProvider from "./utils/MUI Theme/theme-provider";
import ReactQueryProvicer from "./utils/react-query-provider/react-query-provider";
import CustomSnackbar from "./components/common/snake-bar/snake-bar";
import { playwriteUsModern } from "./utils/fonts/play-right-usa-modern";
import Header from "./components/common/header/header";
import Analytics from "./components/common/analytics/analytics";
import { usePathname } from "next/navigation";
import FetchProfile from "./components/common/profile/fetch-profile";
import SideBar from "./components/common/side-bar/side-bar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();

  return (
    <html lang="en">
      <body
        className={`${poppins.variable} ${playwriteUsModern.variable} !text-bg font-poppins w-full antialiased`}
      >
        <ThemeProvider>
          <ReactQueryProvicer>
            <ReduxProvider>
              <FetchProfile />
              <div className={pathName !== "/sign-in" ? "mt-[220px] px-4 max-h-[50dvh]" : ""}>
                {children}
              </div>
              {pathName !== "/sign-in" ? (
                <>
                  <Analytics />
                  <Header />
                  <SideBar />{" "}
                </>
              ) : (
                ""
              )}
              <CustomSnackbar />
            </ReduxProvider>
          </ReactQueryProvicer>
        </ThemeProvider>
      </body>
    </html>
  );
}
