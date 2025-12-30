import express from 'express';
const router = express.Router();
import foldersetController from '../controllers/foldersetController';
import { validate } from '../validators';
import {
  createFolderSetValidator,
  updateFolderSetValidator,
  folderSetIdParamValidator,
} from '../validators/foldersetValidator';

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
router.get('/:id', validate(folderSetIdParamValidator), foldersetController.getFolderSetById);

/** 
 * @openapi
 * /folderset:
 *   post:
 *    summary: Tạo bộ thư mục mới
 *    tags: [FolderSet]
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              title:
 *                type: string
 *              description:
 *                type: string
 *              icon:
 *                type: string
 *              studySets:
 *                type: array
 *                items:
 *                  type: string
 *    responses:
 *      201:
 *        description: Tạo bộ thư mục thành công
 *      400:
 *        description: Yêu cầu không hợp lệ
 *      401:
 *        description: Chưa xác thực
 *      500:
 *        description: Lỗi server
 */
router.post('/', validate(createFolderSetValidator), foldersetController.createFolderSet);

/** 
 * @openapi
 * /folderset/{id}:
 *    put:
 *     summary: Cập nhật bộ thư mục
 *     tags: [FolderSet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                icon: 
 *                  type: string
 *                studySets:
 *                  type: array
 *                  items:
 *                    type: string
 *     responses:
 *      200:
 *        description: Cập nhật bộ thư mục thành công
 *      400:
 *        description: Yêu cầu không hợp lệ
 *      401:
 *        description: Chưa xác thực
 *      404:
 *        description: Không tìm thấy bộ thư mục
 *      500:
 *        description: Lỗi server
 */
router.put('/:id', validate(updateFolderSetValidator), foldersetController.updateFolderSet);

/** 
 * @openapi
 * /folderset/{id}:
 *    delete:
 *     summary: Xóa bộ thư mục
 *     tags: [FolderSet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *    responses:
 *      200:
 *        description: Xóa bộ thư mục thành công
 *      401:
 *        description: Chưa xác thực
 *      404:
 *        description: Không tìm thấy bộ thư mục
 *      500:
 *        description: Lỗi server
 */

router.delete('/:id', validate(folderSetIdParamValidator), foldersetController.deleteFolderSet);

export default router;