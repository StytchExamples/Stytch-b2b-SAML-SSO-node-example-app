import { Member } from "../database/models";
import { Request, Response } from "express";

export const getMemberProfile = async (req: Request, res: Response) => {
  const stytchMemberId = req.params.stytch_member_id;

  try {
    const member = await Member.findOne({
      where: { stytchMemberId },
      include: ["organization"],
    });

    res.status(201).json({ member: member });
  } catch (error) {
    console.log({ error });
    res.status(500).json({ message: "Something went wrong" });
  }
};
