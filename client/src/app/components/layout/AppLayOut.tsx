import React, { useState } from "react";
import Link from "next/link";
import { FaBars } from "react-icons/fa";
import { useStytchMemberSession, useStytchB2BClient } from "@stytch/nextjs/b2b";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("Profile");
  const { session } = useStytchMemberSession();

  const stytchB2BClient = useStytchB2BClient();
  const handleLogout = async () => {
    try {
      await stytchB2BClient.session.revoke({ forceClear: true });
      window.location.href = "/";
    } catch (err) {
      console.error("Logout error:", err);
    }
  };

  return (
    <div style={{ maxWidth: "100%" }} className=" flex flex-col min-h-screen">
      {/* Header */}
      <header className="border-b-[1px] bg-[#19303d] text-white p-4 shadow-md ">
        <div className="px-10 mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <img
              className="w-10 h-10"
              alt="Stytch_Logo.png"
              src="Stytch_Logo.png"
            />
            <h1 className="text-2xl ml-2 text-[#fff] font-bold">
              SAML Example
            </h1>
          </div>

          {session && (
            <div
              onClick={handleLogout}
              className="hidden  md:flex space-x-4 font-bold cursor-pointer"
            >
              Logout
            </div>
          )}

          <button onClick={() => setIsOpen(!isOpen)} className="md:hidden">
            <FaBars />
          </button>
        </div>

        <div
          className={`md:hidden ${
            isOpen ? "mt-2 border-t-2 flex flex-col" : "hidden"
          }`}
        >
          {session ? (
            <>
              <p
                onClick={() =>
                  setActiveSection(
                    activeSection === "Profile" ? "Settings" : "Profile"
                  )
                }
                className="flex space-x-4 font-bold cursor-pointer"
              >
                {activeSection === "Profile" ? "Settings" : "Profile"}
              </p>

              <p
                onClick={handleLogout}
                className="flex space-x-4 font-bold cursor-pointer"
              >
                Logout
              </p>
            </>
          ) : (
            <>
              <Link href="/">Home</Link>
              <Link href="/signup">Sign Up</Link>
            </>
          )}
        </div>
      </header>

      <div id="root" className="flex flex-grow container my-auto  max-w-full">
        {children}
      </div>

      <footer className="bg-[#19303d] text-white p-4 shadow-md">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 SAML Example. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}