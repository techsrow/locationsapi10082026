"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
// router.get("/", getProducts);
// router.get("/id/:id", getProductById);
// // router.get("/slug/:slug", getProductBySlug);
// router.get("/:slug", getProductBySlug);
// router.post("/add", addProduct);
// router.post("/add-slot", addSlot);
// router.put("/:id", updateProduct);
// router.delete("/:id", deleteProduct);
// router.delete("/slot/:id", deleteSlot);
// export default router;
router.get("/", product_controller_1.getProducts);
router.get("/id/:id", product_controller_1.getProductById);
router.get("/:slug", product_controller_1.getProductBySlug);
router.post("/add", product_controller_1.addProduct);
router.post("/add-slot", product_controller_1.addSlot);
/* PUT */
router.put("/:id", product_controller_1.updateProduct);
/* DELETE SLOT FIRST */
router.delete("/slot/:id", product_controller_1.deleteSlot);
/* DELETE PRODUCT LAST */
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
