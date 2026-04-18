import express from "express";
import dotenv from "dotenv";
import { router } from "./routes";
dotenv.config();
export const app = express();

//use express.json() to parse incoming requests with JSON payloads
app.use(express.json());
app.use(express.urlencoded({ extended: true })); //parse incoming requests with urlencoded payloads

app.use("/", router);