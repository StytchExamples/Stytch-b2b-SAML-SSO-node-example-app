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
exports.getMemberProfile = void 0;
const models_1 = require("../database/models");
const getMemberProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const stytchMemberId = req.params.stytch_member_id;
    try {
        const member = yield models_1.Member.findOne({
            where: { stytchMemberId },
            include: ["organization"],
        });
        res.status(201).json({ member: member });
    }
    catch (error) {
        console.log({ error });
        res.status(500).json({ message: "Something went wrong" });
    }
});
exports.getMemberProfile = getMemberProfile;
