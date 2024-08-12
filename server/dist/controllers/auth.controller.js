"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.signIn = exports.updateSAMLConnection = exports.signUp = exports.authenticate = void 0;
const sequelize_1 = require("sequelize");
const stytch_1 = require("stytch");
const models_1 = require("../database/models");
const dotenv = require("dotenv");
dotenv.config();
const client = new stytch_1.B2BClient({
    project_id: process.env.STYTCH_PROJECT_ID || "",
    secret: process.env.STYTCH_SECRET_KEY || "",
});
// Authenticate handler
const authenticate = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { stytch_organization_id, stytch_member_id } = req.query;
    try {
        const organization = yield models_1.Organization.findOne({
            where: { stytchOrganizationId: stytch_organization_id },
        });
        if (!organization) {
            return res.status(400).json({ message: "Organization not found" });
        }
        let member = yield models_1.Member.findOne({
            where: { stytchMemberId: stytch_member_id },
        });
        if (!member) {
            const params = {
                member_id: stytch_member_id,
                organization_id: stytch_organization_id,
            };
            const stytchResp = yield client.organizations.members.get(params);
            if (stytchResp.member.name) {
                const [firstName, lastName] = stytchResp.member.name.split(" ");
                member = yield models_1.Member.create({
                    firstName,
                    lastName,
                    email: stytchResp.member.email_address,
                    organizationId: organization.id,
                    stytchMemberId: stytchResp.member.member_id,
                });
            }
            else {
                member = yield models_1.Member.create({
                    email: stytchResp.member.email_address,
                    organizationId: organization.id,
                    stytchMemberId: stytchResp.member.member_id,
                });
            }
        }
        res.status(201).json({ message: "Member authenticated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.authenticate = authenticate;
// SignUp handler
const signUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, firstName, lastName, email, stytchOrganizationId, stytchMemberId, } = req.body;
    try {
        let organization;
        const [, domain] = email.split("@");
        const allowedDomains = [domain];
        const existingOrganization = yield models_1.Organization.findOne({
            where: {
                [sequelize_1.Op.or]: [{ companyName }, { domain }],
            },
            include: ["members"],
        });
        if (!existingOrganization) {
            organization = yield models_1.Organization.create({
                companyName,
                domain,
                stytchOrganizationId,
            });
        }
        else {
            organization = existingOrganization;
        }
        const existingMember = yield models_1.Member.findOne({ where: { email } });
        if (existingMember) {
            return res
                .status(400)
                .json({ message: "A Member already exists with this email" });
        }
        const member = yield models_1.Member.create({
            firstName,
            lastName,
            email,
            organizationId: organization.id,
            stytchMemberId,
        });
        if (!existingOrganization) {
            yield client.organizations.update({
                organization_id: stytchOrganizationId,
                email_jit_provisioning: "RESTRICTED",
                email_allowed_domains: allowedDomains,
            }, {
                authorization: {
                    session_token: req.headers.sessiontoken,
                },
            });
            const stytchConnection = yield client.sso.saml.createConnection({
                organization_id: stytchOrganizationId,
                display_name: `${organization.companyName}-SAML`,
                identity_provider: "microsoft-entra",
            }, {
                authorization: {
                    session_token: req.headers.sessiontoken,
                },
            });
            if (stytchConnection.connection) {
                organization = yield organization.update({
                    stytchAcsUrl: stytchConnection.connection.acs_url,
                    stytchAudienceUrl: stytchConnection.connection.audience_uri,
                    connectionId: stytchConnection.connection.connection_id,
                });
                res.status(201).json({
                    status: "success",
                    data: { member, organization },
                });
            }
        }
        else {
            res.status(201).json({
                status: "success",
                data: { member, organization },
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signUp = signUp;
// UpdateSamlConnection handler
const updateSAMLConnection = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { id } = req.params;
    const { metaDataUrl } = req.body;
    try {
        const organization = yield models_1.Organization.findByPk(id);
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        yield client.sso.saml.updateConnection({
            organization_id: organization.stytchOrganizationId,
            connection_id: organization.connectionId,
            attribute_mapping: {
                email: "NameID",
                first_name: "firstName",
                last_name: "lastName",
            },
        });
        const updatedConnection = yield client.sso.saml.updateByURL({
            organization_id: organization.stytchOrganizationId,
            connection_id: organization.connectionId,
            metadata_url: metaDataUrl,
        }, {
            authorization: {
                session_token: req.headers.sessiontoken,
            },
        });
        yield organization.update({
            metaDataUrl,
            idpSignOnUrl: (_a = updatedConnection.connection) === null || _a === void 0 ? void 0 : _a.idp_sso_url,
            idpIssuerUrl: (_b = updatedConnection.connection) === null || _b === void 0 ? void 0 : _b.idp_entity_id,
            samlConfigured: true,
        });
        res.json({ message: "SAML connection updated successfully" });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.updateSAMLConnection = updateSAMLConnection;
// SignIn handler
const signIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, signInMethod } = req.body;
    try {
        const [, domain] = email.split("@");
        const organization = yield models_1.Organization.findOne({ where: { domain } });
        if (!organization) {
            return res.status(404).json({ message: "Organization not found" });
        }
        const member = yield models_1.Member.findOne({ where: { email } });
        if (signInMethod === "SAML") {
            if (!organization.idpIssuerUrl) {
                return res
                    .status(400)
                    .json({ message: "This user does not have SAML provisioned" });
            }
            return res.json({ connection_id: organization.connectionId });
        }
        else if (signInMethod === "MagicLink") {
            if (member) {
                return res.json({ organization_id: organization.stytchOrganizationId });
            }
            if (!member && organization.idpIssuerUrl) {
                return res.status(400).json({
                    message: "This organization has SAML provisioned, please sign in with saml",
                });
            }
            if (!member && !organization.idpIssuerUrl) {
                return res.status(400).json({ message: "Member does not exist" });
            }
        }
        else {
            return res.status(400).json({ message: "Invalid sign in method" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
exports.signIn = signIn;
