"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// src/database.ts
const sequelize_typescript_1 = require("sequelize-typescript");
const Organization_1 = require("./models/Organization");
const Member_1 = require("./models/Member");
const sequelize = new sequelize_typescript_1.Sequelize({
    dialect: "sqlite",
    storage: "database.sqlite",
    models: [Organization_1.Organization, Member_1.Member],
    logging: false,
});
exports.default = sequelize;
