import express from 'express'
import flashcardController from '../controllers/flashcardController'
import { validate } from '../validators'
import { markFlashcardValidator, flashcardIdParamValidator, markedStudySetValidator } from '../validators/flashcardValidator'

const router = express.Router()

/**
 * @openapi
 * tags:
 *   name: Flashcards
 *   description: Quản lý flashcards được đánh dấu
 */

/**
 * @openapi
 * /flashcards/mark:
 *   post:
 *     summary: Đánh dấu hoặc bỏ đánh dấu flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               flashcardId:
 *                 type: string
 *               isMarked:
 *                 type: boolean
 *             required:
 *               - flashcardId
 *               - isMarked
 *     responses:
 *       200:
 *         description: Flashcard đã được đánh dấu hoặc bỏ đánh dấu thành công
 *       400:
 *         description: Dữ liệu không hợp lệ
 */
router.post('/mark', validate(markFlashcardValidator), flashcardController.markFlashcard)

/**
 * @openapi
 * /flashcards/marked/{studySetId}:
 *  get:
 *     summary: Lấy tất cả flashcards đã được đánh dấu
 *     tags: [Flashcards]
 *     security:
 *      - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lấy flashcards đã đánh dấu thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/marked/:studySetId', validate(markedStudySetValidator), flashcardController.getMarkedFlashcards)

/**
 * @openapi
 * /flashcards/mark/{flashcardId}:
 *   delete:
 *     summary: Xóa đánh dấu flashcard
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flashcardId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của flashcard cần xóa đánh dấu
 *     responses:
 *       200:
 *         description: Đánh dấu flashcard đã được xóa thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.delete('/mark/:flashcardId', validate(flashcardIdParamValidator), flashcardController.deleteFlashcardMark)

/**
 * @openapi
 * /flashcards/mark-status/{flashcardId}:
 *   get:
 *     summary: Lấy trạng thái đánh dấu của một flashcard cụ thể
 *     tags: [Flashcards]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: flashcardId
 *         schema:
 *           type: string
 *         required: true
 *         description: ID của flashcard cần lấy trạng thái đánh dấu
 *     responses:
 *       200:
 *         description: Lấy trạng thái đánh dấu thành công
 *       500:
 *         description: Lỗi máy chủ
 */
router.get('/mark-status/:flashcardId', validate(flashcardIdParamValidator), flashcardController.getFlashcardMarkStatus)

export default router
