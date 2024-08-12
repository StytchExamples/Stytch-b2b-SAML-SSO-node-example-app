"use client";

import { useCallback, useEffect } from "react";

import { useStytchMember, useStytchMemberSession } from "@stytch/nextjs/b2b";
import { Sidebar, Profile, Settings } from "../components/dashboard";
import { useDispatch, useSelector } from "react-redux";
import { axiosInstance } from "../utils";
import { RootState } from "../store/reducers";
import { RoleSource } from "../interfaces";
import { useRouter } from "next/navigation";

const Dashboard: React.FC = () => {
  const { member } = useStytchMember();
  const { session } = useStytchMemberSession();
  const dispatch = useDispatch();
  const router = useRouter();
  const reduxMember = useSelector(
    (state: RootState) => state.memberReducer.member
  );

  const activeSection = useSelector(
    (state: RootState) => state.dashboardReducer.activeSection
  );

  const getProfile = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/member/${member?.member_id}`);
      dispatch({
        type: "SET_MEMBER",
        payload: {
          ...response?.data?.member,
          roles: member?.roles.map(
            (role: { role_id: string; sources: RoleSource[] }) => role.role_id
          ),
        },
      });

      dispatch({
        type: "SET_ORGANIZATION",
        payload: response?.data?.member?.organization,
      });
    } catch (error) {
      console.error({ error });
    }
  }, [dispatch, member]);

  const checkSession = useCallback(() => {
    if (!session) {
      router.push("/"); // Redirect to the home page
    }
  }, [session, router]);

  useEffect(() => {
    checkSession();
  }, [checkSession]);

  useEffect(() => {
    if (!reduxMember) {
      getProfile();
    }
  }, [getProfile]);

  const updateActiveSection = (section: string) => {
    section &&
      dispatch({
        type: "SET_DASHBOARD_INTERFACE",
        payload: { activeSection: section },
      });
  };

  return (
    <div className="flex w-full min-h-screen bg-gray-100">
      <Sidebar
        activeSection={activeSection}
        setActiveSection={updateActiveSection}
      />
      <div className="flex justify-center w-full flex-grow p-6">
        {activeSection === "Profile" && <Profile />}
        {activeSection === "Settings" && <Settings />}
      </div>
    </div>
  );
};

export default Dashboard;
