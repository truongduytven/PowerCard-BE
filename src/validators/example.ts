/**
 * EXAMPLE: Cách sử dụng validators trong routes
 * 
 * File này minh họa cách áp dụng validators vào các routes khác nhau
 */

import express from 'express'
import { validate } from '../validators'
import {
  createStudySetValidator,
  updateStudySetValidator,
  studySetIdParamValidator,
  getStudySetsQueryValidator,
} from '../validators/studysetValidator'

const router = express.Router()

// Example controller (giả định)
const studysetController = {
  create: (req: express.Request, res: express.Response) => {
    // Khi đến đây, dữ liệu đã được validate
    // req.body.title, req.body.description, req.body.flashcards đều hợp lệ
    res.json({ message: 'Created' })
  },
  update: (req: express.Request, res: express.Response) => {
    res.json({ message: 'Updated' })
  },
  getById: (req: express.Request, res: express.Response) => {
    res.json({ message: 'Get by ID' })
  },
  getAll: (req: express.Request, res: express.Response) => {
    res.json({ message: 'Get all' })
  },
}

/**
 * POST /studyset
 * Validate: title (required, 1-255 chars), description (optional, max 1000 chars),
 *          flashcards array với term và definition
 */
router.post('/', validate(createStudySetValidator), studysetController.create)

/**
 * PUT /studyset/:id
 * Validate: id param (UUID), optional fields trong body
 */
router.put('/:id', validate(updateStudySetValidator), studysetController.update)

/**
 * GET /studyset/:id
 * Validate: id param (UUID)
 */
router.get('/:id', validate(studySetIdParamValidator), studysetController.getById)

/**
 * GET /studyset
 * Validate: query params (page, limit, search, filters)
 */
router.get('/', validate(getStudySetsQueryValidator), studysetController.getAll)

/**
 * TESTING EXAMPLES:
 * 
 * 1. Valid request:
 * POST /studyset
 * {
 *   "title": "My Study Set",
 *   "description": "This is a description",
 *   "flashcards": [
 *     { "term": "Term 1", "definition": "Definition 1" },
 *     { "term": "Term 2", "definition": "Definition 2" }
 *   ]
 * }
 * ✅ Response: 200 OK
 * 
 * 2. Invalid request (missing title):
 * POST /studyset
 * {
 *   "description": "This is a description"
 * }
 * ❌ Response: 400 Bad Request
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": [
 *     { "field": "title", "message": "Tiêu đề là bắt buộc" }
 *   ]
 * }
 * 
 * 3. Invalid request (invalid UUID):
 * GET /studyset/invalid-uuid
 * ❌ Response: 400 Bad Request
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": [
 *     { "field": "id", "message": "Study set ID phải là UUID hợp lệ" }
 *   ]
 * }
 * 
 * 4. Invalid request (invalid query params):
 * GET /studyset?page=0&limit=200
 * ❌ Response: 400 Bad Request
 * {
 *   "success": false,
 *   "message": "Validation failed",
 *   "errors": [
 *     { "field": "page", "message": "page phải là số nguyên dương" },
 *     { "field": "limit", "message": "limit phải là số từ 1-100" }
 *   ]
 * }
 */

export default router
