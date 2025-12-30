import { body, query } from 'express-validator';

export const configureDifficultyValidator = [
  body('userLearnId')
    .notEmpty()
    .withMessage('userLearnId là bắt buộc')
    .isUUID()
    .withMessage('userLearnId phải là UUID hợp lệ'),
  body('difficulties')
    .isArray()
    .withMessage('difficulties phải là một mảng'),
  body('difficulties.*.name')
    .notEmpty()
    .withMessage('Tên độ khó là bắt buộc'),
  body('difficulties.*.minutes')
    .isInt({ min: 1 })
    .withMessage('minutes phải là số nguyên dương'),
];

export const getDifficultyValidator = [
  query('userLearnId')
    .notEmpty()
    .withMessage('userLearnId là bắt buộc')
    .isUUID()
    .withMessage('userLearnId phải là UUID hợp lệ'),
];