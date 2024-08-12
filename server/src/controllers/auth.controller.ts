import { Request, Response } from "express";
import { Op } from "sequelize";
import { B2BClient } from "stytch";
import { Member, Organization } from "../database/models";
const dotenv = require("dotenv");

dotenv.config();

const client = new B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID || "",
  secret: process.env.STYTCH_SECRET_KEY || "",
});

// Authenticate handler
export const authenticate = async (req: Request, res: Response) => {
  const { stytch_organization_id, stytch_member_id }: any = req.query;

  try {
    const organization = await Organization.findOne({
      where: { stytchOrganizationId: stytch_organization_id },
    });

    if (!organization) {
      return res.status(400).json({ message: "Organization not found" });
    }

    let member = await Member.findOne({
      where: { stytchMemberId: stytch_member_id },
    });

    if (!member) {
      const params = {
        member_id: stytch_member_id,
        organization_id: stytch_organization_id,
      };

      const stytchResp = await client.organizations.members.get(params);

      if (stytchResp.member.name) {
        const [firstName, lastName] = stytchResp.member.name.split(" ");
        member = await Member.create({
          firstName,
          lastName,
          email: stytchResp.member.email_address,
          organizationId: organization.id,
          stytchMemberId: stytchResp.member.member_id,
        });
      } else {
        member = await Member.create({
          email: stytchResp.member.email_address,
          organizationId: organization.id,
          stytchMemberId: stytchResp.member.member_id,
        });
      }
    }

    res.status(201).json({ message: "Member authenticated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SignUp handler
export const signUp = async (req: Request, res: Response) => {
  const {
    companyName,
    firstName,
    lastName,
    email,
    stytchOrganizationId,
    stytchMemberId,
  } = req.body;

  try {
    let organization: any;
    const [, domain] = email.split("@");
    const allowedDomains = [domain];

    const existingOrganization = await Organization.findOne({
      where: {
        [Op.or]: [{ companyName }, { domain }],
      },
      include: ["members"],
    });

    if (!existingOrganization) {
      organization = await Organization.create({
        companyName,
        domain,
        stytchOrganizationId,
      });
    } else {
      organization = existingOrganization;
    }

    const existingMember = await Member.findOne({ where: { email } });

    if (existingMember) {
      return res
        .status(400)
        .json({ message: "A Member already exists with this email" });
    }

    const member = await Member.create({
      firstName,
      lastName,
      email,
      organizationId: organization.id,
      stytchMemberId,
    });

    if (!existingOrganization) {
      await client.organizations.update(
        {
          organization_id: stytchOrganizationId,
          email_jit_provisioning: "RESTRICTED",
          email_allowed_domains: allowedDomains,
        },
        {
          authorization: {
            session_token: req.headers.sessiontoken as string,
          },
        }
      );

      const stytchConnection = await client.sso.saml.createConnection(
        {
          organization_id: stytchOrganizationId,
          display_name: `${organization.companyName}-SAML`,
          identity_provider: "microsoft-entra",
        },
        {
          authorization: {
            session_token: req.headers.sessiontoken as string,
          },
        }
      );

      if (stytchConnection.connection) {
        organization = await organization.update({
          stytchAcsUrl: stytchConnection.connection.acs_url,
          stytchAudienceUrl: stytchConnection.connection.audience_uri,
          connectionId: stytchConnection.connection.connection_id,
        });

        res.status(201).json({
          status: "success",
          data: { member, organization },
        });
      }
    } else {
      res.status(201).json({
        status: "success",
        data: { member, organization },
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// UpdateSamlConnection handler
export const updateSAMLConnection = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { metaDataUrl } = req.body;

  try {
    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    await client.sso.saml.updateConnection({
      organization_id: organization.stytchOrganizationId,
      connection_id: organization.connectionId,
      attribute_mapping: {
        email: "NameID",
        first_name: "firstName",
        last_name: "lastName",
      },
    });

    const updatedConnection = await client.sso.saml.updateByURL(
      {
        organization_id: organization.stytchOrganizationId,
        connection_id: organization.connectionId,
        metadata_url: metaDataUrl,
      },
      {
        authorization: {
          session_token: req.headers.sessiontoken as string,
        },
      }
    );

    await organization.update({
      metaDataUrl,
      idpSignOnUrl: updatedConnection.connection?.idp_sso_url,
      idpIssuerUrl: updatedConnection.connection?.idp_entity_id,
      samlConfigured: true,
    });

    res.json({ message: "SAML connection updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// SignIn handler
export const signIn = async (req: Request, res: Response) => {
  const { email, signInMethod } = req.body;

  try {
    const [, domain] = email.split("@");

    const organization = await Organization.findOne({ where: { domain } });

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    const member = await Member.findOne({ where: { email } });

    if (signInMethod === "SAML") {
      if (!organization.idpIssuerUrl) {
        return res
          .status(400)
          .json({ message: "This user does not have SAML provisioned" });
      }
      return res.json({ connection_id: organization.connectionId });
    } else if (signInMethod === "MagicLink") {
      if (member) {
        return res.json({ organization_id: organization.stytchOrganizationId });
      }

      if (!member && organization.idpIssuerUrl) {
        return res.status(400).json({
          message:
            "This organization has SAML provisioned, please sign in with saml",
        });
      }

      if (!member && !organization.idpIssuerUrl) {
        return res.status(400).json({ message: "Member does not exist" });
      }
    } else {
      return res.status(400).json({ message: "Invalid sign in method" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};
