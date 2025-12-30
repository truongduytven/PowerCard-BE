import { body, param } from 'express-validator'

export const createTopicValidator = [
  body('name')
    .notEmpty()
    .withMessage('Tên chủ đề là bắt buộc')
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên chủ đề phải có từ 1-100 ký tự'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được vượt quá 500 ký tự'),
]

export const updateTopicValidator = [
  param('id')
    .notEmpty()
    .withMessage('Topic ID là bắt buộc')
    .isUUID()
    .withMessage('Topic ID phải là UUID hợp lệ'),
  body('name')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ min: 1, max: 100 })
    .withMessage('Tên chủ đề phải có từ 1-100 ký tự'),
  body('description')
    .optional({ values: 'falsy' })
    .trim()
    .isLength({ max: 500 })
    .withMessage('Mô tả không được vượt quá 500 ký tự'),
]

export const topicIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Topic ID là bắt buộc')
    .isUUID()
    .withMessage('Topic ID phải là UUID hợp lệ'),
]
