"use client";

import "./globals.css";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SnackbarProvider } from "notistack";
import { Provider } from "react-redux";
import { store } from "~/ultis/slices/store";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: process.env.PAGE_TITLE,
  description: process.env.PAGE_TITLE,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Provider store={store}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            {children}
          </SnackbarProvider>
        </Provider>
      </body>
    </html>
  );
}
