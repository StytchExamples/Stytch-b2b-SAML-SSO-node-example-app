"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = __importDefault(require("./database/database"));
const controllers_1 = require("./controllers");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const PORT = process.env.PORT || 3002;
// Initialize database
database_1.default
    .sync() // Use { alter: true } for production to update the tables without dropping them
    .then(() => {
    console.log("Database synchronized");
})
    .catch((err) => console.error("Error synchronizing database:", err));
app.post("/signup", controllers_1.signUp);
app.post("/signin", controllers_1.signIn);
app.get("/organization/:id", controllers_1.getOrganizationByID);
app.get("/member/:stytch_member_id", controllers_1.getMemberProfile);
app.get("/authenticate", controllers_1.authenticate);
app.put("/saml/connection/:id", controllers_1.updateSAMLConnection);
app.get("/", (req, res) => {
    res.send("Hello, Express with TypeScript!");
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
