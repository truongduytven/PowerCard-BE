import { body, param, query } from 'express-validator'

export const createStudySetValidator = [
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề là bắt buộc')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Tiêu đề phải có từ 1-255 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được vượt quá 1000 ký tự'),
  body('icon')
    .notEmpty()
    .withMessage('icon là bắt buộc')
    .isString()
    .withMessage('icon phải là chuỗi'),
  body('topicId')
    .notEmpty()
    .withMessage('topicId là bắt buộc'),
  body('folderSetId')
    .optional()
    .isUUID()
    .withMessage('folderSetId phải là UUID hợp lệ'),
  body('isPublic')
    .notEmpty()
    .withMessage('isPublic là bắt buộc')
    .isBoolean()
    .withMessage('isPublic phải là boolean'),
  body('flashcards')
    .notEmpty()
    .withMessage('flashcards là bắt buộc')
    .isArray()
    .withMessage('flashcards phải là một mảng'),
  body('flashcards.*.term')
    .notEmpty()
    .withMessage('Thuật ngữ flashcard là bắt buộc')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Thuật ngữ không được vượt quá 500 ký tự'),
  body('flashcards.*.definition')
    .notEmpty()
    .withMessage('Định nghĩa flashcard là bắt buộc')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Định nghĩa không được vượt quá 1000 ký tự'),
  body('flashcards.*.position')
    .notEmpty()
    .withMessage('Vị trí flashcard là bắt buộc')
    .isInt({ min: 1 })
    .withMessage('Vị trí phải là số nguyên dương'),
  body('flashcards.*.mediaId')
    .optional()
    .isUUID()
    .withMessage('mediaId phải là UUID hợp lệ'),  
]

export const updateStudySetValidator = [
  param('id')
    .notEmpty()
    .withMessage('Study set ID là bắt buộc')
    .isUUID()
    .withMessage('Study set ID phải là UUID hợp lệ'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Tiêu đề phải có từ 1-255 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được vượt quá 1000 ký tự'),
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic phải là boolean'),
]

export const studySetIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Study set ID là bắt buộc')
    .isUUID()
    .withMessage('Study set ID phải là UUID hợp lệ'),
    body('title')
    .notEmpty()
    .withMessage('Tiêu đề là bắt buộc')
    .trim()
    .isLength({ min: 1, max: 255 })
    .withMessage('Tiêu đề phải có từ 1-255 ký tự'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Mô tả không được vượt quá 1000 ký tự'),
  body('icon')
    .notEmpty()
    .withMessage('icon là bắt buộc')
    .isString()
    .withMessage('icon phải là chuỗi'),
  body('topicId')
    .notEmpty()
    .withMessage('topicId là bắt buộc'),
  body('folderSetId')
    .optional()
    .isUUID()
    .withMessage('folderSetId phải là UUID hợp lệ'),
  body('isPublic')
    .notEmpty()
    .withMessage('isPublic là bắt buộc')
    .isBoolean()
    .withMessage('isPublic phải là boolean'),
  body('flashcards')
    .notEmpty()
    .withMessage('flashcards là bắt buộc')
    .isArray()
    .withMessage('flashcards phải là một mảng'),
  body('flashcards.*.term')
    .notEmpty()
    .withMessage('Thuật ngữ flashcard là bắt buộc')
    .trim()
    .isLength({ max: 500 })
    .withMessage('Thuật ngữ không được vượt quá 500 ký tự'),
  body('flashcards.*.definition')
    .notEmpty()
    .withMessage('Định nghĩa flashcard là bắt buộc')
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Định nghĩa không được vượt quá 1000 ký tự'),
  body('flashcards.*.position')
    .notEmpty()
    .withMessage('Vị trí flashcard là bắt buộc')
    .isInt({ min: 1 })
    .withMessage('Vị trí phải là số nguyên dương'),
  body('flashcards.*.mediaId')
    .optional()
    .isUUID()
    .withMessage('mediaId phải là UUID hợp lệ'),  
]

export const getStudySetsQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page phải là số nguyên dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit phải là số từ 1-100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('search không được vượt quá 255 ký tự'),
  query('topicId')
    .optional()
    .isUUID()
    .withMessage('topicId phải là UUID hợp lệ'),
  query('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic phải là boolean'),
  query('isLearning')
    .optional()
    .isBoolean()
    .withMessage('isLearning phải là boolean'),
]

// Validator cho public study sets (có search và pagination)
export const getPublicStudySetsQueryValidator = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('page phải là số nguyên dương'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit phải là số từ 1-100'),
  query('search')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('search không được vượt quá 255 ký tự'),
  query('topicId')
    .optional()
    .isUUID()
    .withMessage('topicId phải là UUID hợp lệ'),
]
