"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/reducers";

export const Profile = () => {
  const { member, organization } = useSelector((state: RootState) => {
    return {
      member: state?.memberReducer?.member,
      organization: state?.organizationReducer?.organization,
    };
  });

  return (
    <div className="flex flex-col w-full">
      <h1 className="text-3xl font-bold mb-6">Profile</h1>
      <div className="flex flex-col w-fill gap-5 bg-white p-6 shadow-md rounded-lg">
        <h2 className="text-xl font-semibold mb-4"> User Details </h2>
        <div className="flex items-center gap-5 w-20 h-20 rounded-full bg-gray-100">
          <img
            alt="Stytch_Logo.png"
            className="w-50 h-50"
            src="Stytch_Logo.png"
          />
          <div>
            <p className="flex gap-8 font-[700] text-[20px] ">
               {member?.firstName} {member?.lastName}
            </p>
            <p className="flex gap-2 mt-4 font-semibold">
              <strong>Role:</strong> Owner/Admin
            </p>
          </div>
        </div>
      </div>

      <div className=" flex mt-5 flex-col w-fill gap-5 bg-white p-6 shadow-md rounded-lg">
        <div className="flex items-center justify-between   w-full">
          <h2 className="flex text-xl font-semibold mb-4">
            Personal Information
          </h2>
          <button
            type="submit"
            className={`hover:bg-[#19303d] hover:text-[#fff] cursor-pointer border-[1px]  border-[#19303d] flex font-bold justify-center items-center   text-[#19303d] py-1 px-4 rounded-md shadow-sm `}
          >
            Edit
          </button>
        </div>

        <div className="rounded-md px-5 flex items-center   h-20  bg-gray-100">
          <div className="flex flex-col w-1/2">
            <p className="flex gap-8">
              <strong>First name</strong>
            </p>

            <p className="flex gap-8">{member?.firstName}</p>
          </div>
          <div>
            <p className="flex gap-8">
              <strong>Last name</strong>
            </p>

            <p className="flex gap-8">{member?.lastName}</p>
          </div>
        </div>
        <div className="rounded-md px-5 flex items-center  h-20  bg-gray-100">
          <div className="flex flex-col w-1/2">
            <p className="flex gap-8">
              <strong>Email address</strong>
            </p>

            <p className="flex gap-8">{member?.email}</p>
          </div>
          <div>
            <p className="flex gap-8">
              <strong>Phone</strong>
            </p>

            <p className="flex gap-8">(323)355-1234</p>
          </div>
        </div>
        <div className="rounded-md px-5 gap-100 flex items-center h-20  bg-gray-100">
          <div className="flex flex-col w-1/2">
            <p className="flex gap-8">
              <strong>Role</strong>
            </p>

            <p className="flex gap-8">
           Owner/Admin
            </p>
          </div>
          <div>
            <p className="flex gap-8">
              <strong>SAML configured</strong>
            </p>

            <p className="flex gap-8">
              {organization && organization?.samlConfigured ? "True" : "False"}
            </p>
          </div>
        </div>
      </div>

      <div className=" flex mt-5 flex-col w-fill gap-5 bg-white p-6 shadow-md rounded-lg">
        <div className="flex items-center justify-between   w-full">
          <h2 className="flex text-xl font-semibold mb-4">Address</h2>
          <button
            type="submit"
            className={`hover:bg-[#19303d] hover:text-[#fff] cursor-pointer border-[1px]  border-[#19303d] flex font-bold justify-center items-center   text-[#19303d] py-1 px-4 rounded-md shadow-sm `}
          >
            Edit
          </button>
        </div>

        <div className="rounded-md px-5 flex items-center   h-20  bg-gray-100">
          <div className="flex flex-col w-1/2">
            <p className="flex gap-8">
              <strong>Country</strong>
            </p>

            <p className="flex gap-8">United States of America</p>
          </div>
          <div>
            <p className="flex gap-8">
              <strong>State/City</strong>
            </p>

            <p className="flex gap-8">California</p>
          </div>
        </div>

        <div className="rounded-md px-5 gap-100 flex items-center h-20  bg-gray-100">
          <div className="flex flex-col w-1/2">
            <p className="flex gap-8">
              <strong>Postal code</strong>
            </p>

            <p className="flex gap-8">90210</p>
          </div>
          <div>
            <p className="flex gap-8">
              <strong>Tax ID/EIN</strong>
            </p>

  < p className = "flex gap-8" >
              95-6417899
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};