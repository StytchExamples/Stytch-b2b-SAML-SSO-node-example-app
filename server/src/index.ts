import express, { Request, Response } from "express";
import sequelize from "./database/database";
import {
  signIn,
  signUp,
  updateSAMLConnection,
  authenticate,
  getMemberProfile,
  getOrganizationByID,
} from "./controllers";
import cors from "cors";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3002;

// Initialize database
sequelize
  .sync() // Use { alter: true } for production to update the tables without dropping them
  .then(() => {
    console.log("Database synchronized");
  })
  .catch((err) => console.error("Error synchronizing database:", err));

app.post("/signup", signUp);
app.post("/signin", signIn);
app.get("/organization/:id", getOrganizationByID);
app.get("/member/:stytch_member_id", getMemberProfile);
app.get("/authenticate", authenticate);
app.put("/saml/connection/:id", updateSAMLConnection);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello, Express with TypeScript!");
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
