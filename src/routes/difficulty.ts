import express from "express";
const router = express.Router();
import difficultyController from "../controllers/difficultyController";

/**
 * @openapi
 * tags:
 *   name: Difficulty
 *   description: Quản lý độ khó học tập
 */


/**
 * @openapi
 * /difficulty/config:
 *   post:
 *     summary: Cấu hình độ khó học tập cho người dùng
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userLearnId:
 *                 type: string
 *               difficulties:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     minutes:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Cấu hình độ khó thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Đã xảy ra lỗi máy chủ
 */
router.post('/config', difficultyController.configureDifficulty);

/**
 * @openapi
 * /difficulty:
 *   get:
 *     summary: Lấy cấu hình độ khó học tập cho người dùng
 *     tags: [Difficulty]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userLearnId
 *         schema:
 *           type: string
 *         required: true
 *     responses:
 *       200:
 *         description: Lấy cấu hình độ khó thành công
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Đã xảy ra lỗi máy chủ
 */
router.get('/', difficultyController.getDifficultyConfig);

export default router;