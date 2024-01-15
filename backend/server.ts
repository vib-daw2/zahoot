import express from "express";
import dotenv from "dotenv";
import generalRouter from "./routes/general/router";
import authRouter from "./routes/auth/router";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", generalRouter); // Ping (health check)
app.use("/api/auth", authRouter); // Signup, login


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port ", port);
});