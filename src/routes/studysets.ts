import express from "express";
const router = express.Router();
import studysetController from "../controllers/studysetController";
import { validate } from '../validators';
import { query } from 'express-validator';
import {
  createStudySetValidator,
  updateStudySetValidator,
  studySetIdParamValidator,
  getPublicStudySetsQueryValidator,
} from '../validators/studysetValidator';

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
 *         name: page
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *       - in: query
 *         name: search
 *         required: false
 *         schema:
 *           type: string
 *         description: Tìm kiếm theo title, description, username
 *       - in: query
 *         name: topicId
 *         required: false
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Lọc theo topic
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
router.get("/", validate(getPublicStudySetsQueryValidator), studysetController.getListStudySets);

/**
 * @openapi
 * /studyset/my-study-sets:
 *   get:
 *     summary: Lấy danh sách bộ học tập mà user tạo
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 */
router.get("/my-study-sets", studysetController.getMyStudySets);

/**
 * @openapi
 * /studyset/learning:
 *   get:
 *     summary: Lấy danh sách bộ học tập đang học
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 */
router.get("/learning", studysetController.getLearningStudySets);

/**
 * @openapi
 * /studyset/public:
 *   get:
 *     summary: Lấy danh sách bộ học tập public trong hệ thống
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           minimum: 1
 *         required: false
 *         description: Số trang (mặc định 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         required: false
 *         description: Số lượng item mỗi trang (mặc định 20)
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         required: false
 *         description: Tìm kiếm theo title, description, username
 *       - in: query
 *         name: topicId
 *         schema:
 *           type: string
 *           format: uuid
 *         required: false
 *         description: Lọc theo topic
 *     responses:
 *       200:
 *         description: Lấy danh sách thành công
 *       401:
 *         description: Chưa xác thực
 *       500:
 *         description: Lỗi server
 */
router.get("/public", validate(getPublicStudySetsQueryValidator), studysetController.getPublicStudySets);

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
router.get("/:id", validate(studySetIdParamValidator), studysetController.getStudySetById);

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
 *               icon:
 *                 type: string
 *               topicId:
 *                 type: string
 *               folderSetId:
 *                 type: string
 *               isPublic:
 *                 type: boolean
 *               type:
 *                 type: string
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
router.post("/", validate(createStudySetValidator), studysetController.createStudySet);

/** 
 * @openapi
 * /studyset/{id}:
 *    put:
 *      summary: Cập nhật bộ học tập
 *      tags: [StudySets]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                title:
 *                  type: string
 *                description:
 *                  type: string
 *                folderSetId:
 *                  type: string
 *                icon:
 *                  type: string
 *                topicId:
 *                  type: string
 *                isPublic:
 *                  type: boolean
 *                flashcards:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      id:
 *                        type: string
 *                      mediaId:
 *                        type: string
 *                      position:
 *                        type: integer
 *                      term:
 *                        type: string
 *                      definition:
 *                        type: string
 *                      status:
 *                        type: string
 *        responses:
 *          200:
 *            description: Cập nhật bộ học tập thành công
 *          400:
 *            description: Yêu cầu không hợp lệ
 *          401:
 *            description: Chưa xác thực
 *          404:
 *            description: Không tìm thấy bộ học tập
 *          500:
 *            description: Lỗi server
 */
router.put('/:id', validate(updateStudySetValidator), studysetController.updateStudySet);

/** 
 * @openapi
 * /studyset/{id}:
 *    delete:
 *      summary: Xóa bộ học tập
 *      tags: [StudySets]
 *      security:
 *        - bearerAuth: []
 *      parameters:
 *        - in: path
 *          name: id
 *          required: true
 *          schema:
 *            type: string
 *      responses:
 *        200:
 *          description: Xóa bộ học tập thành công
 *        401:
 *          description: Chưa xác thực
 *        404:
 *          description: Không tìm thấy bộ học tập
 *        500:
 *          description: Lỗi server
 */
router.delete('/:id', validate(studySetIdParamValidator), studysetController.deleteStudySet);

// ===== INTERACTION ROUTES =====

/**
 * @openapi
 * /studyset/clone/{id}:
 *    post:
 *     summary: Sao chép bộ học tập
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
 *       201:
 *         description: Sao chép bộ học tập thành công
 *       400:
 *         description: Yêu cầu không hợp lệ
 *       401:
 *         description: Chưa xác thực
 *       403:
 *         description: Không có quyền sao chép bộ học tập này
 *       404:
 *         description: Không tìm thấy bộ học tập
 *       500:
 *         description: Lỗi server
 */
router.post('/clone/:id', validate(studySetIdParamValidator), studysetController.cloneStudySet);

/**
 * @openapi
 * /studyset/duplicate/{id}:
 *   post:
 *    summary: Nhân bản bộ học tập
 *    tags: [StudySets]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      201:
 *        description: Nhân bản bộ học tập thành công
 *      400:
 *        description: Yêu cầu không hợp lệ
 *      401:
 *        description: Chưa xác thực
 *      403:
 *        description: Không có quyền nhân bản bộ học tập này
 *      404:
 *        description: Không tìm thấy bộ học tập
 *      500:
 *        description: Lỗi server
 */
router.post('/duplicate/:id', validate(studySetIdParamValidator), studysetController.duplicateStudySet);

/**
 * @openapi
 * /studyset/{id}/favorite:
 *   post:
 *     summary: Thêm bộ học tập vào yêu thích
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
 *         description: Đã thêm vào yêu thích
 *       400:
 *         description: Đã yêu thích rồi
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy bộ học tập
 *       500:
 *         description: Lỗi server
 */
router.post('/:id/favorite', validate(studySetIdParamValidator), studysetController.addFavorite);

/**
 * @openapi
 * /studyset/{id}/favorite:
 *   delete:
 *     summary: Xóa bộ học tập khỏi yêu thích
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
 *         description: Đã xóa khỏi yêu thích
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Chưa yêu thích
 *       500:
 *         description: Lỗi server
 */
router.delete('/:id/favorite', validate(studySetIdParamValidator), studysetController.removeFavorite);

/**
 * @openapi
 * /studyset/{id}/stats:
 *   get:
 *     summary: Lấy thống kê của bộ học tập
 *     tags: [StudySets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Thống kê bộ học tập
 *       404:
 *         description: Không tìm thấy bộ học tập
 *       500:
 *         description: Lỗi server
 */
router.get('/:id/stats', validate(studySetIdParamValidator), studysetController.getStats);

// ===== TEST ROUTE =====

/**
 * @openapi
 * /studyset/{id}/test:
 *   get:
 *     summary: Tạo bài test từ bộ học tập (không lưu DB)
 *     tags: [StudySets]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: query
 *         name: limit
 *         required: false
 *         schema:
 *           type: integer
 *           default: 20
 *     responses:
 *       200:
 *         description: Bài test được tạo thành công
 *       400:
 *         description: Không đủ flashcard để tạo test
 *       401:
 *         description: Chưa xác thực
 *       404:
 *         description: Không tìm thấy bộ học tập
 *       500:
 *         description: Lỗi server
 */
router.get('/:id/test', validate([
  ...studySetIdParamValidator,
  query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('limit phải là số từ 1-100'),
]), studysetController.generateTest);

export default router;
