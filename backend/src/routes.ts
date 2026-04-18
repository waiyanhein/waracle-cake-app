import { Router } from "express";
import { AppDataSource } from "./data-source";
import { Cake } from "./entities/cake";

export const router = Router();

const repo = AppDataSource.getRepository(Cake);

router.get('/', async (req, res) => {
    return res.status(200).json({ message: "Hello World" });
});

router.get("/cakes", async (req, res) => {
    const cakes = await repo.find();
    return res.status(200).json({ cakes, message: "Cakes fetched successfully" });
});
