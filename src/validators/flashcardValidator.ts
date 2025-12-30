import { body, param } from 'express-validator'

export const markFlashcardValidator = [
  body('flashcardId')
    .notEmpty()
    .withMessage('flashcardId là bắt buộc')
    .isUUID()
    .withMessage('flashcardId phải là UUID hợp lệ'),
  body('isMarked')
    .notEmpty()
    .withMessage('isMarked là bắt buộc')
    .isBoolean()
    .withMessage('isMarked phải là boolean (true/false)'),
]

export const flashcardIdParamValidator = [
  param('flashcardId')
    .notEmpty()
    .withMessage('flashcardId là bắt buộc')
    .isUUID()
    .withMessage('flashcardId phải là UUID hợp lệ'),
]

export const markedStudySetValidator = [
  param('studySetId')
    .notEmpty()
    .withMessage('studySetId là bắt buộc')
    .isUUID()
    .withMessage('studySetId phải là UUID hợp lệ'),
]
