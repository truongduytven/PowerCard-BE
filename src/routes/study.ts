import express from "express";
const router = express.Router();
import studyController from "../controllers/studyController";

/**
 * @openapi
 * tags:
 *   name: Study
 *   description: Quản lý quá trình học tập
 */

/**
 * @openapi
 * /study:
 *   get:
 *     summary: Lấy thẻ học tiếp theo
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: userLearnId
 *         schema:
 *           type: string
 *         required: true
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         required: true
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: Lấy thẻ học thành công
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Đã xảy ra lỗi máy chủ
 */
router.get('/', studyController.getStudyCard);

/**
 * @openapi
 * /study/start:
 *   post:
 *     summary: Bắt đầu phiên học mới
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               studySetId:
 *                 type: string
 *             required:
 *               - studySet
 *     responses:
 *       200:
 *         description: Bắt đầu học thành công
 *       400:
 *         description: studySetId là bắt buộc
 *       401:
 *         description: Không có quyền truy cập
 *       500:
 *         description: Đã xảy ra lỗi máy chủ
 */
router.post('/start', studyController.startStudy);

export default router;