import express from "express";
const router = express.Router();
import mediaController from "../controllers/mediaController";
import upload from "../middlewares/upload";

/**
 * @openapi
 * tags:
 *   name: Media
 *   description: Quản lý kho ảnh
 */

/**
 * @openapi
 * /media/upload:
 *    post:
 *      summary: Tải lên media
 *      tags: [Media]
 *      security:
 *        - bearerAuth: []
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                media:
 *                  type: string
 *                  format: binary
 *      responses:
 *        201:
 *          description: Tải lên media thành công
 *        400:
 *          description: Chưa có file được tải lên
 *        401:
 *          description: Không có quyền truy cập
 *        500:
 *          description: Đã xảy ra lỗi máy chủ
 */

router.post("/upload", upload.single("media"), mediaController.uploadMedia);

/**
 * @openapi
 * /media:
 *   get:
 *    summary: Lấy danh sách media của người dùng
 *    tags: [Media]
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *      - in: query
 *        name: search
 *        schema:
 *          type: string
 *          required: false
 *    responses:
 *      200:
 *        description: Lấy danh sách media thành công
 *      401:
 *        description: Không có quyền truy cập
 *      500:
 *        description: Đã xảy ra lỗi máy chủ
 */

router.get("/", mediaController.getMediaList);

export default router;
