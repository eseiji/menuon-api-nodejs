import { Router } from "express";
import * as IndexController from "../controllers/indexController";

const router = Router();

router.get("/", IndexController.main);
router.get("/companies", IndexController.listCompanies);
router.get("/company/:id_company", IndexController.listCompany);
router.post("/company", IndexController.insertCompany);

router.get("/orders", IndexController.listOrders);
router.get("/order_products", IndexController.listOrderProducts);
router.post("/order", IndexController.insertOrder);
router.post("/order_products", IndexController.insertOrderProducts);

export default router;
