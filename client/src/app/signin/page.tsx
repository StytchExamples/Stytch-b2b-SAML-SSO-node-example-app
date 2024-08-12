"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import { Spinner } from "../components/common/Spinner";
import { useStytchB2BClient, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { axiosInstance } from "../utils";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { StytchB2B } from "@stytch/nextjs/b2b";

import {
  StytchB2BUIConfig,
  B2BProducts,
  AuthFlowType,
} from "@stytch/core/dist/public";

const SignInSchema = z.object({
  email: z.string().email("Invalid email address").min(1, "Email is required"),
});

type FormValues = {
  email: string;
};

enum SignInTypeEnum {
  MagicLink = "MagicLink",
  SAML = "SAML",
}

const SignInPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const { session } = useStytchMemberSession();
  const [signInType, setSignInType] = useState<SignInTypeEnum>(
    SignInTypeEnum.SAML
  );
  const [activeTab, setActiveTab] = useState<"SAML" | "Stytch">("SAML");
  const stytch = useStytchB2BClient();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(SignInSchema),
  });

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

  const checkSession = useCallback(() => {
    if (session) {
      router.push("/dashboard");
    }
  }, [session, router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  const handleSAMLSignIn = async (connection_id: string) => {
    setLoading(true);
    try {
      stytch.sso.start({
        connection_id: `${connection_id}`,
        login_redirect_url: "http://localhost:3000/authenticate",
        signup_redirect_url: "http://localhost:3000/authenticate",
      });
      //eslint-disable-next-line
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error.message ||
          "An error occurred while trying to sign in, please try again",
        {
          position: "top-right",
          autoClose: 3000, // Close after 3 seconds
        }
      );
    }
  };

  const onSubmit: SubmitHandler<FormValues> = async (input) => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.post(`/signin`, {
        email: input.email,
        signInMethod: signInType,
      });
      setLoading(false);

      handleSAMLSignIn(data.connection_id);

      //eslint-disable-next-line
    } catch (error: any) {
      setLoading(false);
      toast.error(error?.response?.data?.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000, // Close after 3 seconds
      });
    }
  };

  const toggleFormType = (type: SignInTypeEnum) => {
    setSignInType(type);
    reset();
    setLoading(false);
  };

  return (
    <div className="flex flex-col w-full items-center justify-center bg-gray-100">
      {activeTab === "SAML" ? (
        <>
          <div className=" w-full sm:w-[398px] bg-white p-5 rounded-t-lg shadow-md border-custom-gray">
            <h1 className="text-[24px] font-semibold mb-6 text-center mt-6">
              Log in with SAML
            </h1>
            <div className="mb-2 border-custom-gray">
              <form onSubmit={handleSubmit(onSubmit)}>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter email"
                  {...register("email")}
                  className={`mt-1 block w-full px-3 py-2 border text-lg border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500   
                  ${
                    errors.email ? "border-red-500" : ""
                  } h-[49px font-[450]  border-custom-blue text-[18px]`}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-600">
                    {errors.email.message}
                  </p>
                )}

                <button
                  type="submit"
                  className={`${
                    isValid && "bg-[#19303d]"
                  } bg-[#13e5c0] mt-5 flex font-bold justify-center items-center w-full  text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#19303d] focus:outline-none focus:ring-2  focus:ring-offset-2 h-[47px]`}
                >
                  {loading ? <Spinner /> : "Sign In"}
                </button>
              </form>
            </div>
          </div>
          <div className="flex justify-center text-[#fff] bg-[#19303d] opacity-50 leading-tight w-full sm:w-[398px] rounded-b-lg">
            Powered by <span className="ml-2 font-bold">Stytch</span>
          </div>
        </>
      ) : (
        config && <StytchB2B config={config} styles={styles} />
      )}

      <div className="w-full sm:w-[398px] flex items-center justify-center my-4">
        <hr className="flex-grow border-t border-gray-300" />
        <span className="mx-4 text-gray-500">OR</span>
        <hr className="flex-grow border-t border-gray-300" />
      </div>

      <button
        className={`h-[47px] py-2 text-[#fff] font-[800] px-4 rounded w-full sm:w-[398px] bg-[#13e5c0]`}
        onClick={() => setActiveTab(activeTab === "SAML" ? "Stytch" : "SAML")}
      >
        {activeTab === "SAML"
          ? "Sign in with magic link"
          : "Sign in with SAML SSO"}
      </button>
    </div>
  );
};

export default SignInPage;
