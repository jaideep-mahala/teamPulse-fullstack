import express from "express";
import cors from "cors";
import authRouter from "./src/authentication";
import { errorHandler } from "./helper/errorHandler";

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use(authRouter);


app.use(errorHandler);

app.listen(4000, () => {
  console.log("running on port 4000");
});
