import express from "express";
const router = express.Router();
import studyController from "../controllers/studyController";
import { validate } from '../validators';
import { startStudyValidator, getCardsValidator } from '../validators/studyValidator';


/**
 * @openapi
 * tags:
 *   name: Study
 *   description: Quản lý quá trình học tập
 */

/**
 * @openapi
 * /study/start:
 *   post:
 *     summary: Bắt đầu session học mới
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
 *               - studySetId
 *     responses:
 *       200:
 *         description: Session bắt đầu thành công
 *       400:
 *         description: studySetId là bắt buộc
 */
router.post('/start', validate(startStudyValidator), studyController.startStudySession);

/**
 * @openapi
 * /study/cards:
 *   get:
 *     summary: Lấy flashcards từ session
 *     tags: [Study]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: direction
 *         schema:
 *           type: string
 *           enum: [next, prev]
 *         required: false
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         required: false
 *     responses:
 *       200:
 *         description: Lấy flashcards thành công
 *       401:
 *         description: Session expired
 */
router.get('/cards', validate(getCardsValidator), studyController.getStudyCards);

export default router;