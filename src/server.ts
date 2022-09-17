import express, { Request, Response } from "express";
import dotenv from "dotenv";
import mainRoutes from "./routes/index";

dotenv.config();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(mainRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT);
