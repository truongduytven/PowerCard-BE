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
 *               icon:
 *                 type: string
 *               topicId:
 *                 type: string
 *               folderSetId:
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
router.put('/:id', studysetController.updateStudySet);

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
router.delete('/:id', studysetController.deleteStudySet);

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
router.post('/clone/:id', studysetController.cloneStudySet);

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
router.post('/duplicate/:id', studysetController.duplicateStudySet);

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
router.post('/:id/favorite', studysetController.addFavorite);

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
router.delete('/:id/favorite', studysetController.removeFavorite);

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
router.get('/:id/stats', studysetController.getStats);

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
router.get('/:id/test', studysetController.generateTest);

export default router;
