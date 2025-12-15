import express from "express";
const router = express.Router();
import overviewController from "../controllers/overviewController";

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

export default router;