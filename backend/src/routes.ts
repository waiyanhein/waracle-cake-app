import { Router } from "express";
import Container from "typedi";
import express, { Express } from "express";
import { CakeController } from "./controllers/cakeController";
import path from "path";
import { appConfig } from "./appConfig";

export const configureRoutes = (app: Express) => {
    app.use("/storage", express.static(path.join(process.cwd(), appConfig.storage.directory)));
    const router = Router();

const cakeController = Container.get(CakeController);

router.get('/', async (req, res) => {
    return res.status(200).json({ message: "Hello World" });
});

router.post("/cakes", cakeController.uploadImagesMiddleware, cakeController.createOne);

router.get("/cakes", cakeController.findMany);

return router;
}
