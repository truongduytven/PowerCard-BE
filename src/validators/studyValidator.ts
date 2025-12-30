import { body, param, query } from 'express-validator'

export const startStudyValidator = [
  body('studySetId')
    .notEmpty()
    .withMessage('studySetId là bắt buộc')
    .isUUID()
    .withMessage('studySetId phải là UUID hợp lệ'),
];

export const getCardsValidator = [
  query('direction')
    .optional()
    .isIn(['next', 'prev'])
    .withMessage('direction phải là next hoặc prev'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('limit phải là số từ 1-100'),
];

export const startLearningValidator = [
  param('studySetId')
    .notEmpty()
    .withMessage('studySetId là bắt buộc')
    .isUUID()
    .withMessage('studySetId phải là UUID hợp lệ'),
]

export const submitAnswerValidator = [
  body('flashcardId')
    .notEmpty()
    .withMessage('flashcardId là bắt buộc')
    .isUUID()
    .withMessage('flashcardId phải là UUID hợp lệ'),
  body('difficultyId')
    .notEmpty()
    .withMessage('difficultyId là bắt buộc')
    .isUUID()
    .withMessage('difficultyId phải là UUID hợp lệ'),
  body('userLearnId')
    .notEmpty()
    .withMessage('userLearnId là bắt buộc')
    .isUUID()
    .withMessage('userLearnId phải là UUID hợp lệ'),
]

export const updateDifficultyValidator = [
  body('difficulties')
    .notEmpty()
    .withMessage('difficulties là bắt buộc')
    .isArray()
    .withMessage('difficulties phải là một mảng'),
  body('difficulties.*.id')
    .notEmpty()
    .withMessage('Difficulty ID là bắt buộc')
    .isUUID()
    .withMessage('Difficulty ID phải là UUID hợp lệ'),
  body('difficulties.*.minutes')
    .notEmpty()
    .withMessage('minutes là bắt buộc')
    .isInt({ min: 1 })
    .withMessage('minutes phải là số nguyên dương'),
]
