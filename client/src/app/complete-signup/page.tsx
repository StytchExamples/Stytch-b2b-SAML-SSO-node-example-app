"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import {
  useStytchMemberSession,
  useStytchMember,
  useStytchOrganization,
} from "@stytch/nextjs/b2b";
import { useEffect, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { z } from "zod";
import { Spinner } from "../components/common/Spinner";
import { axiosInstance, excludedProviders } from "../utils";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

const schema = z.object({
  companyName: z.string().min(3, "Company name is required"),
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "last name is required"),
  email: z
    .string()
    .email("Email is required")
    .refine((email) => {
      const domain = email.split("@")[1];
      return !excludedProviders.includes(domain);
    }, "Provide a valid work email"),
});

interface formInterface {
  companyName: string;
  name: string;
  firstName: string;
  lastName: string;
  email: string;
}

const SignUpPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { session } = useStytchMemberSession();
  const { member } = useStytchMember();
  const { organization } = useStytchOrganization();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields, isValid },
    reset,
  } = useForm<formInterface>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues: {
      companyName: organization?.organization_name,
      email: member?.email_address,
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit: SubmitHandler<formInterface> = async (data) => {
    try {
      setLoading(true);

      await axiosInstance.post(
        "/signup",
        {
          ...data,
          stytchOrganizationId: organization?.organization_id,
          stytchMemberId: member?.member_id,
        },
        {
          headers: {
            authorization: `Bearer ${Cookies.get("stytch_session_jwt")}`,
            sessionToken: Cookies.get("stytch_session"),
          },
        }
      );
      setLoading(false);
      router.push("/dashboard");
      //eslint-disable-next-line
    } catch (error: any) {
      setLoading(false);
      toast.error(error.response.data.message || "Something went wrong", {
        position: "top-right",
        autoClose: 3000,
      });
    }
  };

  useEffect(() => {
    reset({
      companyName: organization?.organization_name || "",
      email: member?.email_address,
      firstName: "",
      lastName: "",
    });
  }, [member]);

  return (
    <div className="flex w-full items-center justify-center  bg-gray-100">
      <div className="max-w-md w-[350px] bg-white p-5 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">
          Complete Sign up
        </h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex gap-5">
            <div className="mb-4">
              <label
                htmlFor="First name"
                className="block text-sm font-medium text-gray-700"
              >
                First name
              </label>
              <input
                id="name"
                type="text"
                placeholder="First name"
                {...register("firstName")}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-[#19303d] sm:text-sm  
                ${errors.name ? "border-red-500" : ""}`}
              />
              {touchedFields.firstName && errors.firstName && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                htmlFor="Last name"
                className="block text-sm font-medium text-gray-700"
              >
                Last name
              </label>
              <input
                id="name"
                type="text"
                placeholder="last name"
                {...register("lastName")}
                className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-[#19303d] sm:text-sm  
                ${errors.name ? "border-red-500" : ""}`}
              />
              {touchedFields.lastName && errors.lastName && (
                <p className="mt-1 text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>
          </div>

          <div className="mb-4">
            <label
              htmlFor="Email"
              className="block text-sm font-medium text-gray-700"
            >
              Work email
            </label>
            <input
              id="email"
              type="text"
              disabled={true}
              placeholder="Work email"
              {...register("email")}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-[#19303d] sm:text-sm  
                ${errors.email ? "border-red-500" : ""}`}
            />
            {touchedFields.email && errors.email && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="mb-4">
            <label
              htmlFor="company_name"
              className="block text-sm font-medium text-gray-700"
            >
              Company name
            </label>
            <input
              id="company_name"
              type="text"
              disabled={true}
              placeholder="Company name"
              {...register("companyName")}
              className={`mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  focus:border-[#19303d] sm:text-sm  
                ${errors.companyName ? "border-red-500" : ""}`}
            />
            {touchedFields.companyName && errors.companyName && (
              <p className="mt-1 text-red-500 text-sm">
                {errors.companyName.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className={`flex justify-center w-full ${
              isValid ? "bg-[#19303d]" : "bg-[#13e5c0]"
            } text-white py-2 px-4 rounded-md shadow-sm hover:bg-[#19303d] focus:outline-none focus:ring-2  focus:ring-offset-2`}
          >
            {loading ? <Spinner /> : "Create Account"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUpPage;
