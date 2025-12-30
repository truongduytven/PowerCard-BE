import { body, param } from 'express-validator'

export const createFolderSetValidator = [
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề folder là bắt buộc')
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
    .withMessage('Icon là bắt buộc')
    .trim()
    .isString()
    .withMessage('Icon phải là chuỗi hợp lệ'),
  body('studySets')
    .optional()
    .isArray()
    .withMessage('studySets phải là một mảng'),
  body('studySets.*')
    .isUUID()
    .withMessage('Mỗi studySetId phải là UUID hợp lệ'),
]

export const updateFolderSetValidator = [
  param('id')
    .notEmpty()
    .withMessage('Folder ID là bắt buộc')
    .isUUID()
    .withMessage('Folder ID phải là UUID hợp lệ'),
  body('title')
    .notEmpty()
    .withMessage('Tiêu đề folder là bắt buộc')
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
    .withMessage('Icon là bắt buộc')
    .trim()
    .isString()
    .withMessage('Icon phải là chuỗi hợp lệ'),
  body('studySets')
    .optional()
    .isArray()
    .withMessage('studySets phải là một mảng'),
  body('studySets.*')
    .isUUID()
    .withMessage('Mỗi studySetId phải là UUID hợp lệ'),
]

export const folderSetIdParamValidator = [
  param('id')
    .notEmpty()
    .withMessage('Folder ID là bắt buộc')
    .isUUID()
    .withMessage('Folder ID phải là UUID hợp lệ'),
]

// export const addStudySetToFolderValidator = [
//   param('id')
//     .notEmpty()
//     .withMessage('Folder ID là bắt buộc')
//     .isUUID()
//     .withMessage('Folder ID phải là UUID hợp lệ'),
//   body('studySetId')
//     .notEmpty()
//     .withMessage('studySetId là bắt buộc')
//     .isUUID()
//     .withMessage('studySetId phải là UUID hợp lệ'),
// ]
