"use client";

import React, { useState, useEffect } from "react";
import {
  AuthFlowType,
  B2BProducts,
  StytchB2BUIConfig,
  StytchEventType,
} from "@stytch/vanilla-js";
import { StytchB2B } from "@stytch/nextjs/b2b";
import { useRouter } from "next/navigation";
import { axiosInstance } from "../utils";

const Discovery = () => {
  const [config, setConfig] = useState<StytchB2BUIConfig | null>();
  const router = useRouter();

  useEffect(() => {
    setConfig({
      products: [B2BProducts.emailMagicLinks],
      sessionOptions: { sessionDurationMinutes: 60 },
      authFlowType: AuthFlowType.Discovery,
    });
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

  return config ? (
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
                axiosInstance
                  .get(`/member/${data.member.member_id}`)
                  .then((resp) => {
                    if (!resp.data.member) {
                      router.push("/complete-signup");
                    } else {
                      router.push("/dashboard");
                    }
                  })
                  .catch((error) => {
                    console.error(error);
                  });
              }
            }
          },
        }}
      />
    </div>
  ) : null;
};

export default Discovery;
