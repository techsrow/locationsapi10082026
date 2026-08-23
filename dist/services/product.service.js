"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.createSlot = exports.updateProduct = exports.createProduct = void 0;
const prisma_1 = __importDefault(require("../lib/prisma"));
const slugify_1 = __importDefault(require("slugify"));
const createProduct = async (data) => {
    const slug = (0, slugify_1.default)(data.name, {
        lower: true,
        strict: true,
        trim: true
    });
    const product = await prisma_1.default.product.create({
        data: {
            name: data.name,
            slug: slug,
            price: data.price,
            bookingAmount: data.bookingAmount,
            slots: data.slots
                ? {
                    create: data.slots.map((slot) => ({
                        label: slot.label,
                        startTime: slot.startTime,
                        endTime: slot.endTime
                    }))
                }
                : undefined
        },
        include: {
            slots: true
        }
    });
    return product;
};
exports.createProduct = createProduct;
const updateProduct = async (id, data) => {
    const slug = data.slug && data.slug.trim() !== ""
        ? (0, slugify_1.default)(data.slug, {
            lower: true,
            strict: true,
            trim: true
        })
        : (0, slugify_1.default)(data.name, {
            lower: true,
            strict: true,
            trim: true
        });
    return prisma_1.default.product.update({
        where: { id },
        data: {
            name: data.name,
            slug,
            price: data.price,
            bookingAmount: data.bookingAmount
        }
    });
};
exports.updateProduct = updateProduct;
const createSlot = async (data) => {
    const product = await prisma_1.default.product.findUnique({
        where: { id: data.productId }
    });
    if (!product) {
        throw new Error("Product not found");
    }
    return prisma_1.default.slot.create({
        data: {
            productId: data.productId,
            label: data.label,
            startTime: data.startTime,
            endTime: data.endTime
        }
    });
};
exports.createSlot = createSlot;
const getProductById = async (id) => {
    const product = await prisma_1.default.product.findUnique({
        where: { id },
        include: {
            slots: true
        }
    });
    if (!product) {
        throw new Error("Product not found");
    }
    return product;
};
exports.getProductById = getProductById;
