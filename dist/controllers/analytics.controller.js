"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDashboardAnalytics = void 0;
const analyticsService_1 = require("../services/analyticsService");
const getDashboardAnalytics = async (req, res) => {
    try {
        const data = await (0, analyticsService_1.getDashboardAnalyticsService)();
        res.json(data);
    }
    catch (error) {
        console.error("Analytics Error:", error);
        res.status(500).json({
            message: "Failed to fetch analytics"
        });
    }
};
exports.getDashboardAnalytics = getDashboardAnalytics;
