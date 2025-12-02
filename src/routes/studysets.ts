import express from "express";
const router = express.Router();
import studysetController from "../controllers/studysetController";

/**
 * @openapi
 * tags:
 *   name: StudySets
 *   description: Quản lý bộ học tập
 */

/**
 * @openapi
 * /studyset:
 *   get:
 *     summary: Lấy thông tin bộ học tập
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isAuthor
 *         required: false
 *         schema:
 *           type: boolean
 *       - in: query
 *         name: isLearning
 *         required: false
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy tài khoản
 *       500:
 *         description: Lỗi server
 */
router.get("/", studysetController.getListStudySets);

/**
 * @openapi
 * /studyset/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết bộ học tập
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thông tin tài khoản
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy tài khoản
 *       500:
 *         description: Lỗi server
 */
router.get("/:id", studysetController.getStudySetById);

/**
 * @openapi
 * /studyset:
 *   post:
 *     summary: Tạo bộ học tập mới
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               topicId:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               flashcards:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     mediaId:
 *                       type: string
 *                     position:
 *                       type: integer
 *                     term:
 *                       type: string
 *                     definition:
 *                       type: string
 *     responses:
 *       201:
 *         description: Tạo bộ học tập thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 */
router.post("/", studysetController.createStudySet);

export default router;
