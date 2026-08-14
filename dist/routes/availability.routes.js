"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const availability_controller_1 = require("../controllers/availability.controller");
const router = express_1.default.Router();
router.get("/", availability_controller_1.getAvailability);
exports.default = router;
