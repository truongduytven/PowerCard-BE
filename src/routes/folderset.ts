import express from 'express';
const router = express.Router();
import foldersetController from '../controllers/foldersetController';

/**
 * @openapi
 * tags:
 *   name: FolderSet
 *   description: Quản lý bộ thư mục
 */

/**
 * @openapi
 * /folderset:
 *   get:
 *     summary: Lấy thông tin bộ thư mục
 *     tags: [FolderSet]
 *     security:
 *       - bearerAuth: []
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
router.get('/', foldersetController.getAllFolderSets);


/**
 * @openapi
 * /folderset/{id}:
 *   get:
 *     summary: Lấy thông tin chi tiết bộ thư mục
 *     tags: [FolderSet]
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
router.get('/:id', foldersetController.getFolderSetById);

export default router;