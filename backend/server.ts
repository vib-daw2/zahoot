import express from "express";
import dotenv from "dotenv";
import generalRouter from "./routes/general/router";

dotenv.config();

const app = express();

app.use(express.json());

app.use("/api", (req, res, next) => {
  next();
}) // We mount all the routes under /api

app.use(generalRouter); // Ping


const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log("Server is running on port ", port);
});