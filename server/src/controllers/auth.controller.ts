import { Request, Response } from "express";
import { B2BClient } from "stytch";
const dotenv = require("dotenv");

dotenv.config();

const client = new B2BClient({
  project_id: process.env.STYTCH_PROJECT_ID || "",
  secret: process.env.STYTCH_SECRET_KEY || "",
});

export const authenticate = async (req: Request, res: Response) => {
  const { token }: any = req.query;

  try {
    const resp = await client.sso.authenticate({ sso_token: token });

    res.status(201).json({
      SessionToken: resp.session_token,
      SessionJwt: resp.session_jwt,
    });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};