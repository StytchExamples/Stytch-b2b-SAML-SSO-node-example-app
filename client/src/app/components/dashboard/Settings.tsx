"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { RootState } from "../../store/reducers";
import { axiosInstance } from "../../utils";
import { Spinner } from "../common/Spinner";
import { IoSettings } from "react-icons/io5";
import { Modal } from "../common/Modal"; // Import the Modal component

interface SAMLFormInputs {
  metaDataUrl: string;
}

export const Settings = () => {
  const [loading, setLoading] = useState(false);
  const [showSAMLForm, setShowSAMLForm] = useState(false);
  const dispatch = useDispatch();

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Successfully copied to clipboard", {
      position: "top-right",
      autoClose: 3000, // Close after 3 seconds
    });
  };

  const organization = useSelector(
    (state: RootState) => state?.organizationReducer?.organization
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SAMLFormInputs>({
    defaultValues: {
      metaDataUrl: organization?.metaDataUrl || "",
    },
  });

  const onSubmit = async (data: SAMLFormInputs) => {
    try {
      setLoading(true);
      await axiosInstance.put(`/saml/connection/${organization.id}`, data);
      setLoading(false);
      setShowSAMLForm(false);
      reset();

      dispatch({
        type: "SET_ORGANIZATION",
        payload: { ...organization, samlConfigured: true },
      });
      toast.success("SAML Configuration updated successfully!", {
        position: "top-right",
        autoClose: 3000, // Close after 3 seconds
      });
    } catch (error: any) {
      setLoading(false);
      toast.error(
        error.message ||
          "SAML Configuration Failed, please try again with the correct credentials",
        {
          position: "top-right",
          autoClose: 3000, // Close after 3 seconds
        }
      );
    }
  };

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      <div className="h-full bg-white p-6 shadow-md rounded-lg">
        {organization?.samlConfigured ? (
          <div className="flex flex-col h-full">
            <h2 className="text-xl font-semibold mb-4">
              Use the credentials below to setup SAML on your IdP
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Copy the ACS url below and paste it into your IdP SAML
                configuration
              </label>
              <div
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                onClick={() =>
                  copyToClipboard(organization && organization.stytchAcsUrl)
                }
                title="Click to copy"
              >
                {organization.stytchAcsUrl}
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">
                Copy the Audience url below and paste it into your IdP SAML
                configuration
              </label>
              <div
                className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
                onClick={() => copyToClipboard(organization.stytchAudienceUrl)}
                title="Click to copy"
              >
                {organization.stytchAudienceUrl}
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-4">
                <label
                  htmlFor="metaDataUrl"
                  className="block text-sm font-medium text-gray-700"
                >
                  Meta data url
                </label>
                <input
                  {...register("metaDataUrl", {
                    required: "Meta data URL is required",
                    pattern: {
                      value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                      message: "Enter a valid URL",
                    },
                  })}
                  type="text"
                  id="metaDataUrl"
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  placeholder="Enter meta data url"
                />
                {errors.metaDataUrl && (
                  <p className="text-red-500 text-sm mt-1">
                    {errors.metaDataUrl.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="flex mb-5 font-bold justify-center w-full text-white py-2 px-4 rounded-md shadow-sm bg-[#19303d]"
              >
                {loading ? <Spinner /> : "Update SAML configuration"}
              </button>
            </form>
          </div>
        ) : (
          <div className="h-full flex-col items-center  flex font-bold justify-center w-full text-white py-2 rounded-md ">
            <IoSettings color="#13e5c0" size={200} />
            <button
              onClick={() => setShowSAMLForm(true)}
              type="submit"
              className="flex mb-5 mt-5 font-bold justify-center w-md text-white py-2 px-4 rounded-md shadow-sm bg-[#19303d] focus:outline-none "
            >
              Configure SAML
            </button>
          </div>
        )}

        <Modal isOpen={showSAMLForm} onClose={() => setShowSAMLForm(false)}>
          <h2 className="text-xl font-semibold mb-4">
            Use the credentials below to setup SAML on your IdP
          </h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Copy the ACS url below and paste it into your IdP SAML
              configuration
            </label>
            <div
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              onClick={() =>
                copyToClipboard(organization && organization.stytchAcsUrl)
              }
              title="Click to copy"
            >
              {organization.stytchAcsUrl}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Copy the Audience url below and paste it into your IdP SAML
              configuration
            </label>
            <div
              className="mt-1 block w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm cursor-pointer"
              onClick={() => copyToClipboard(organization.stytchAudienceUrl)}
              title="Click to copy"
            >
              {organization.stytchAudienceUrl}
            </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="mb-4">
              <label
                htmlFor="metaDataUrl"
                className="block text-sm font-medium text-gray-700"
              >
                Meta data url
              </label>
              <input
                {...register("metaDataUrl", {
                  required: "Meta data URL is required",
                  pattern: {
                    value: /^(https?|chrome):\/\/[^\s$.?#].[^\s]*$/gm,
                    message: "Enter a valid URL",
                  },
                })}
                type="text"
                id="metaDataUrl"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="Enter meta data url"
              />
              {errors.metaDataUrl && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.metaDataUrl.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="flex mb-5 font-bold justify-center w-full text-white py-2 px-4 rounded-md shadow-sm bg-[#19303d] focus:outline-none focus:ring-2  focus:ring-offset-2"
            >
              {loading ? <Spinner /> : "Update SAML configuration"}
            </button>
          </form>
        </Modal>
      </div>
    </div>
  );
};
