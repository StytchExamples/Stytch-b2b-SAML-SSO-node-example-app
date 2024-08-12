// src/database.ts
import { Sequelize } from "sequelize-typescript";
import { Organization } from "./models/Organization";
import { Member } from "./models/Member";

const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: "database.sqlite",
  models: [Organization, Member],
  logging: false,
});

export default sequelize;
