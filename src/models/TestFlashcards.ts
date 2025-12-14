/**
 * @deprecated This model is deprecated and will be removed in future versions.
 * Test functionality now uses runtime-only logic without database persistence.
 * See testService.ts for new implementation.
 */

import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface ITestFlashcard {
  id: string
  userTestId: string
  flashcardId: string
  userAnswer?: string
}

export default class TestFlashcards extends BaseModel implements ITestFlashcard {
  id!: string
  userTestId!: string
  flashcardId!: string
  userAnswer?: string

  static tableName = 'test_flashcards'

  static relationMappings: RelationMappings = {
    usertest: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./UserTests').default,
      join: {
        from: 'test_flashcards.user_test_id',
        to: 'user_tests.id',
      },
    },
    flashcard: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Flashcards').default,
      join: {
        from: 'test_flashcards.flashcard_id',
        to: 'flashcards.id',
      },
    },
  }
}

