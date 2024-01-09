import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";

import generalRouter from "./general/router";

dotenv.config();

const port = process.env.PORT || 3000 ;

const app = express();

app.use(bodyParser.json());

app.use(generalRouter);
// app.use(authRouter);

app.listen(3000, () => {
  console.log(`Server listening on port ${port}`);
});

