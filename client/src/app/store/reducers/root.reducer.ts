import { combineReducers } from "@reduxjs/toolkit";

export interface OrganizationInterface {
  id: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  connection_id: string;
  stytchOrganizationId: string;
  idpSignOnUrl: string;
  metaDataUrl: string;
  idpIssuerUrl: string;
  stytchAudienceUrl: string;
  stytchAcsUrl: string;
  stytchIssuerUrl: string;
  companyName: string;
  samlConfigured: boolean;
}

export interface MemberInterface {
  id: string;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  firstName: string;
  lastName: string;
  email: string;
  organizationId: string;
  stytchMemberId: string;
  roles: string[];
}

export interface DashboardInterface {
  activeSection: string;
}

export const SET_MEMBER = "SET_MEMBER";
export const SET_ORGANIZATION = "SET_ORGANIZATION";
export const SET_DASHBOARD_INTERFACE = "SET_DASHBOARD_INTERFACE";

export interface SetOrganizationAction {
  type: typeof SET_ORGANIZATION;
  payload: OrganizationInterface;
}

// Action creator to set organization
export const setOrganization = (
  organization: OrganizationInterface
): SetOrganizationAction => ({
  type: SET_ORGANIZATION,
  payload: organization,
});

export interface SetMemberAction {
  type: typeof SET_MEMBER;
  payload: MemberInterface;
}

// Action creator to set member
export const setMember = (member: MemberInterface): SetMemberAction => ({
  type: SET_MEMBER,
  payload: member,
});

export interface SetDashboardAction {
  type: typeof SET_DASHBOARD_INTERFACE;
  payload: DashboardInterface;
}

export const setDashboard = (
  dashboard: DashboardInterface
): SetDashboardAction => ({
  type: SET_DASHBOARD_INTERFACE,
  payload: dashboard,
});

const initialMemberState = {
  member: null,
};

const initialDashboardState = {
  activeSection: "Profile",
};

const initialOrganizationState: { organization: OrganizationInterface } = {
  organization: {
    id: "",
    CreatedAt: "",
    UpdatedAt: "",
    DeletedAt: null,
    connection_id: "",
    stytchOrganizationId: "",
    idpSignOnUrl: "",
    idpIssuerUrl: "",
    stytchAudienceUrl: "",
    metaDataUrl: "",
    stytchAcsUrl: "",
    stytchIssuerUrl: "",
    companyName: "",
    samlConfigured: false,
  },
};

export const organizationReducer = (
  state = initialOrganizationState,
  action: SetOrganizationAction
) => {
  switch (action.type) {
    case SET_ORGANIZATION:
      return {
        ...state,
        organization: action.payload,
      };
    default:
      return state;
  }
};

export const dashboardReducer = (
  state = initialDashboardState,
  action: SetDashboardAction
) => {
  switch (action.type) {
    case SET_DASHBOARD_INTERFACE:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export const memberReducer = (
  state = initialMemberState,
  action: SetMemberAction
) => {
  switch (action.type) {
    case SET_MEMBER:
      return {
        ...state,
        member: action.payload,
      };
    default:
      return state;
  }
};

export const rootReducer = combineReducers({
  memberReducer,
  organizationReducer: organizationReducer,
  dashboardReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
