import { Organization } from "../database/models";
import { Request, Response } from "express";

export const getOrganizationByID = async (req: Request, res: Response) => {
  const id = req.params.id;

  try {
    const organization = await Organization.findByPk(id);

    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    res.status(200).json({ organization: organization });
  } catch (error) {
    console.error("Error retrieving organization:", error);
    return res.status(500).json({ message: "Error retrieving organization" });
  }
};
