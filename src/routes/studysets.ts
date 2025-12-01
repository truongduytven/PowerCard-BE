import express from 'express';
const router = express.Router();
import studysetController from '../controllers/studysetController';

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
 *         required: true  
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
router.get('/', studysetController.getListStudySets);

export default router;
