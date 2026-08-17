"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSlot = exports.deleteProduct = exports.addSlot = exports.updateProduct = exports.addProduct = exports.getProductBySlug = exports.getProductById = exports.getProducts = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const productService = __importStar(require("../services/product.service"));
/* ---------------------------------------------------
   GET ALL PRODUCTS
--------------------------------------------------- */
const getProducts = async (req, res) => {
    try {
        const products = await prisma_1.default.product.findMany({
            include: {
                slots: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });
        res.json(products);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
exports.getProducts = getProducts;
/* ---------------------------------------------------
   GET PRODUCT BY ID (ADMIN USE)
--------------------------------------------------- */
const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { id },
            include: {
                slots: true
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
exports.getProductById = getProductById;
/* ---------------------------------------------------
   GET PRODUCT BY SLUG (PUBLIC WEBSITE)
--------------------------------------------------- */
const getProductBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const product = await prisma_1.default.product.findUnique({
            where: { slug },
            include: {
                slots: true
            }
        });
        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }
        res.json(product);
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
exports.getProductBySlug = getProductBySlug;
/* ---------------------------------------------------
   ADD PRODUCT
--------------------------------------------------- */
const addProduct = async (req, res) => {
    try {
        const { name, price, bookingAmount, slots } = req.body;
        if (!name || !price || !bookingAmount) {
            return res.status(400).json({
                success: false,
                message: "Name, price and bookingAmount are required"
            });
        }
        const product = await productService.createProduct({
            name,
            price: Number(price),
            bookingAmount: Number(bookingAmount),
            slots
        });
        res.status(201).json({
            success: true,
            product
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
exports.addProduct = addProduct;
/* ---------------------------------------------------
   Update PRODUCT
--------------------------------------------------- */
const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, price, bookingAmount } = req.body;
        const product = await productService.updateProduct(id, {
            name,
            slug,
            price: Number(price),
            bookingAmount: Number(bookingAmount)
        });
        res.json({
            success: true,
            product
        });
    }
    catch (error) {
        console.error("Update product error:", error);
        res.status(500).json({
            success: false,
            message: error.message || "Failed to update product"
        });
    }
};
exports.updateProduct = updateProduct;
/* ---------------------------------------------------
   ADD SLOT
--------------------------------------------------- */
const addSlot = async (req, res) => {
    try {
        const { productId, label, startTime, endTime } = req.body;
        if (!productId || !label || !startTime || !endTime) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }
        if (startTime >= endTime) {
            return res.status(400).json({
                success: false,
                message: "Start time must be before end time"
            });
        }
        /* CHECK OVERLAPPING SLOTS */
        const existingSlots = await prisma_1.default.slot.findMany({
            where: { productId }
        });
        const overlap = existingSlots.some((slot) => {
            return startTime < slot.endTime && endTime > slot.startTime;
        });
        if (overlap) {
            return res.status(400).json({
                success: false,
                message: "Slot overlaps with existing slot"
            });
        }
        const slot = await productService.createSlot({
            productId,
            label,
            startTime,
            endTime
        });
        res.status(201).json({
            success: true,
            slot
        });
    }
    catch (err) {
        res.status(400).json({
            success: false,
            message: err.message
        });
    }
};
exports.addSlot = addSlot;
/* ---------------------------------------------------
   DELETE PRODUCT
--------------------------------------------------- */
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        /* Check if bookings exist */
        const bookingCount = await prisma_1.default.booking.count({
            where: { productId: id }
        });
        if (bookingCount > 0) {
            return res.status(400).json({
                success: false,
                message: "Cannot delete product because bookings exist"
            });
        }
        /* Delete slots first */
        await prisma_1.default.slot.deleteMany({
            where: { productId: id }
        });
        /* Delete product */
        await prisma_1.default.product.delete({
            where: { id }
        });
        res.json({
            success: true
        });
    }
    catch (error) {
        console.error("Delete product error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to delete product"
        });
    }
};
exports.deleteProduct = deleteProduct;
/* ---------------------------------------------------
   DELETE SLOT
--------------------------------------------------- */
const deleteSlot = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.slot.delete({
            where: { id }
        });
        res.json({
            success: true
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: "Failed to delete slot"
        });
    }
};
exports.deleteSlot = deleteSlot;
