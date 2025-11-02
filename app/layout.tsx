"use client";
import "./globals.css";
import { ReduxProvider } from "./utils/store/provider";
import ThemeProvider from "./utils/MUI Theme/theme-provider";
import ReactQueryProvicer from "./utils/react-query-provider/react-query-provider";
import CustomSnackbar from "./components/common/snake-bar/snake-bar";
import Header from "./components/common/header/header";
import Analytics from "./components/common/analytics/analytics";
import { usePathname } from "next/navigation";
import FetchProfile from "./components/common/profile/fetch-profile";
import SideBar from "./components/common/side-bar/side-bar";
import LayoutChildren from "./components/common/layout-children";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathName = usePathname();

  return (
    <html lang="en">
      <body className={`!text-bg font-poppins w-full antialiased`}>
        <div
          style={{
            fontFamily: "cairo",
            background: "linear-gradient(to top left, #12607E 0%, #072632 100%)",
          }}
          className="absolute left-0 top-0 w-full h-full z-[-1]"
        ></div>
        <ReduxProvider>
          <ThemeProvider>
            <ReactQueryProvicer>
              <FetchProfile />
              {pathName !== "/sign-in" ? (
                <>
                  {pathName !== "/" && pathName !== "/profile" ? <Analytics /> : ""}
                  <Header />
                  <SideBar />{" "}
                </>
              ) : (
                ""
              )}
              <LayoutChildren>{children}</LayoutChildren>
              <CustomSnackbar />
            </ReactQueryProvicer>
          </ThemeProvider>
        </ReduxProvider>
      </body>
    </html>
  );
}
