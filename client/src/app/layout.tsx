"use client";
import React from "react";
import "./App.css";
import { createStytchB2BUIClient } from "@stytch/nextjs/b2b/ui";
import { StytchB2BProvider } from "@stytch/nextjs/b2b";
import AppLayout from "./components/layout/AppLayOut";

const publicToken = process.env.NEXT_PUBLIC_STYTCH_PUBLIC_TOKEN as string;

const stytch = createStytchB2BUIClient(publicToken);

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" href="%PUBLIC_URL%/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>SAML Example</title>
        <meta name="description" content="SAML Example App" />
      </head>
      <body>
        <StytchB2BProvider stytch={stytch}>
          <AppLayout>{children}</AppLayout>
        </StytchB2BProvider>
      </body>
    </html>
  );
}