import express from "express";
const router = express.Router();
import overviewController from "../controllers/overviewController";
import { validate } from '../validators';
import { heatmapQueryValidator } from '../validators/overviewValidator';

/**
 * @openapi
 * tags:
 *   name: Overview
 *   description: Quản lý thông tin tổng quan người dùng
 */

/**
 * @openapi
 * /overview/block:
 *   get:
 *     summary: Lấy thông tin overview blocks
 *     tags: [Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy thông tin thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/block', overviewController.getOverviewBlock);

/**
 * @openapi
 * /overview/progress:
 *   get:
 *     summary: Lấy tiến độ học tập và hoàn thành học phần
 *     tags: [Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy tiến độ thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/progress', overviewController.getLearningProgress);

/**
 * @openapi
 * /overview/insights:
 *   get:
 *     summary: Lấy phân tích học tập cá nhân hóa
 *     tags: [Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy phân tích thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/insights', overviewController.getLearningInsights);

/**
 * @openapi
 * /overview/weekly:
 *   get:
 *     summary: Lấy hoạt động học tập theo tuần (heatmap)
 *     tags: [Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy dữ liệu tuần thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/weekly', overviewController.getWeeklyActivity);

/**
 * @openapi
 * /overview/heatmap:
 *   get:
 *     summary: Lấy heatmap hoạt động học tập (tuần/tháng/năm)
 *     tags: [Overview]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: period
 *         schema:
 *           type: string
 *           enum: [week, month, year]
 *         required: false
 *         description: Khoảng thời gian (mặc định week)
 *     responses:
 *       200:
 *         description: Lấy heatmap thành công
 *       400:
 *         description: Period không hợp lệ
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/heatmap', validate(heatmapQueryValidator), overviewController.getActivityHeatmap);

/**
 * @openapi
 * /overview/deck-performance:
 *   get:
 *     summary: Lấy thông tin performance của các study sets
 *     tags: [Overview]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy deck performance thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/deck-performance', overviewController.getDeckPerformance);

export default router;