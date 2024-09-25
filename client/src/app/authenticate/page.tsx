"use client";

import React, { useState, useEffect, Suspense } from "react";
import {
  AuthFlowType,
  B2BProducts,
  StytchB2BUIConfig,
  StytchEventType,
} from "@stytch/vanilla-js";
import { StytchB2B } from "@stytch/nextjs/b2b";
import { axiosInstance } from "../utils";
import Cookies from "js-cookie";

const Authenticate = () => {
  const [tokenType, setTokenType] = useState("");

  const config: StytchB2BUIConfig = {
    products: [B2BProducts.emailMagicLinks],
    sessionOptions: { sessionDurationMinutes: 60 },
    authFlowType: AuthFlowType.Discovery,
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const tokenType = params.get("stytch_token_type");
    setTokenType(tokenType as string);
    if (tokenType === "sso") {
      axiosInstance
        .get(`/authenticate?token=${token}`)
        .then((data) => {
          Cookies.set("stytch_session_jwt", data.data.SessionJWT, {
            secure: true,
            sameSite: "Strict",
          });
          Cookies.set("stytch_session", data.data.SessionToken, {
            secure: true,
            sameSite: "Strict",
          });

          window.location.href = "http://localhost:3000/dashboard";
        })
        .catch((error) => {
          console.log({ error });
        });
    }
  }, []);

  const styles = {
    container: {
      backgroundColor: "#FFFFFF",
      borderColor: "#ADBCC5",
      borderRadius: "8px",
      width: "400px",
    },
    colors: {
      primary: "#19303D",
      secondary: "#5C727D",
      success: "#0C5A56",
      error: "#8B1214",
    },
    buttons: {
      primary: {
        backgroundColor: "#19303D",
        textColor: "#FFFFFF",
        borderColor: "#19303D",
        borderRadius: "4px",
      },
      secondary: {
        backgroundColor: "#FFFFFF",
        textColor: "#19303D",
        borderColor: "#19303D",
        borderRadius: "4px",
      },
    },
    inputs: {
      backgroundColor: "#FFFFFF00",
      borderColor: "#19303D",
      borderRadius: "4px",
      placeholderColor: "#8296A1",
      textColor: "#19303D",
    },
    fontFamily: "Arial",
    hideHeaderText: false,
    logo: {
      logoImageUrl: "",
    },
  };

  return tokenType === "discovery" ? (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="bg-[red] flex flex-col w-full items-center justify-center bg-gray-100">
        <StytchB2B
          styles={styles}
          config={config}
          callbacks={{
            onEvent: async ({
              type,
              data,
            }: {
              type: StytchEventType;
              data: any;
            }) => {
              if (
                type ===
                  StytchEventType.B2BDiscoveryIntermediateSessionExchange ||
                type === StytchEventType.B2BDiscoveryOrganizationsCreate ||
                type === StytchEventType.B2BMagicLinkDiscoveryAuthenticate ||
                type === StytchEventType.B2BSSOAuthenticate
              ) {
                if (data && data.member) {
                  window.location.href = "http://localhost:3000/dashboard";
                }
              }
            },
          }}
        />
      </div>
    </Suspense>
  ) : null;
};

export default Authenticate;