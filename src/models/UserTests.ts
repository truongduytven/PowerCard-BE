/**
 * @deprecated This model is deprecated and will be removed in future versions.
 * Test functionality now uses runtime-only logic without database persistence.
 * See testService.ts for new implementation.
 */

import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IUserTest {
  id: string
  userId: string
  studySetId: string
  numQuestions: number
  minutes: number
  score?: number
  status: string
  createdAt: string
  updatedAt: string
}

export default class UserTests extends BaseModel implements IUserTest {
  id!: string
  userId!: string
  studySetId!: string
  numQuestions!: number
  minutes!: number
  score?: number
  status!: string
  createdAt!: string
  updatedAt!: string
  
  public tableName = 'user_tests'

  public relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'user_tests.user_id',
        to: 'users.id',
      },
    },
    studyset: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'user_tests.study_set_id',
        to: 'study_sets.id',
      },
    },
    testflashcards: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./TestFlashcards').default,
      join: {
        from: 'user_tests.id',
        to: 'test_flashcards.user_test_id',
      },
    },
  }
}

