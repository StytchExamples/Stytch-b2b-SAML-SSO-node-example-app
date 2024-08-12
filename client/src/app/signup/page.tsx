"use client";

import { useEffect, useState } from "react";
import {
  AuthFlowType,
  B2BProducts,
  StytchB2BUIConfig,
} from "@stytch/vanilla-js";
import { StytchB2B } from "@stytch/nextjs/b2b";

const SignUpPage: React.FC = () => {
  const [config, setConfig] = useState<StytchB2BUIConfig | null>();

  useEffect(() => {
    setConfig({
      products: [B2BProducts.emailMagicLinks],
      sessionOptions: { sessionDurationMinutes: 120 },
      emailMagicLinksOptions: {
        loginRedirectURL: `"http://localhost:3000/authenticate"`,
        signupRedirectURL: `"http://localhost:3000/authenticate"`,
      },
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

  return (
    <div className="flex w-full items-center justify-center  bg-gray-100">
      {config && <StytchB2B config={config} styles={styles} />}
    </div>
  );
};

export default SignUpPage;
