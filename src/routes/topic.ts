import express from "express";
const router = express.Router();
import topicController from "../controllers/topicController";

/**
 * @openapi
 * tags:
 *   name: Topic
 *   description: Quản lý chủ đề
 */

/**
 * @openapi
 * /topic:
 *   get:
 *    summary: Lấy danh sách chủ đề của người dùng
 *    tags: [Topic]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Lấy danh sách chủ đề thành công
 *      401:
 *        description: Không có quyền truy cập
 *      500:
 *        description: Đã xảy ra lỗi máy chủ
 */

router.get("/", topicController.getTopics);

export default router;
