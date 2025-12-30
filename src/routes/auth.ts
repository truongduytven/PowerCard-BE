import express from "express";
import authController from "../controllers/authController";
import { protectedRoute } from "../middlewares/authMiddleware";
import upload from "../middlewares/upload";
import { validate } from "../validators";
import { registerValidator, loginValidator } from "../validators/authValidator";
const router = express.Router();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Xác thực người dùng
 */

/**
 * @openapi
 * /auth/users:
 *   get:
 *    summary: Lấy danh sách tất cả người dùng
 *    tags: [Auth]
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Lấy danh sách người dùng thành công
 *      500:
 *        description: Đã xảy ra lỗi máy chủ
 */
router.get("/users", authController.getAllUsers);

/**
 * @openapi
 * /auth/signin:
 *   post:
 *     summary: Đăng nhập
 *     tags: [Auth]
 *     requestBody:
 *       description: Thông tin đăng nhập
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Đăng nhập thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       401:
 *         description: Email hoặc mật khẩu không đúng
 *       500:
 *         description: Lỗi server
 */
router.post("/signin", validate(loginValidator), authController.login);

/**
 * @openapi
 * /auth/signup:
 *   post:
 *     summary: Đăng ký tài khoản mới
 *     tags: [Auth]
 *     requestBody:
 *       description: Thông tin đăng ký
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 *       409:
 *         description: Email đã được sử dụng
 *       500:
 *         description: Lỗi server
 */
router.post("/signup", validate(registerValidator), authController.register);

/**
 * @openapi
 * /auth/me:
 *   get:
 *     summary: Lấy thông tin tài khoản
 *     tags: [Auth]
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
router.get("/me", protectedRoute, authController.getMe);

/**
 * @openapi
 * /auth/upload-avatar:
 *   post:
 *     summary: Tải lên ảnh đại diện
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *         schema:
 *          type: object
 *          properties:
 *           avatar:
 *              type: string
 *              format: binary
 *     responses:
 *        200:
 *          description: Tải lên ảnh đại diện thành công
 *        400:
 *          description: Chưa có file được tải lên
 *        401:
 *          description: Không có quyền truy cập
 *        500:
 *          description: Đã xảy ra lỗi máy chủ
 */
router.post("/upload-avatar", protectedRoute, upload.single("avatar"), authController.uploadAvatar);

export default router;
