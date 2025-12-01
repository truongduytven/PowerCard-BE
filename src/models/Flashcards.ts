import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IFlashcard {
  id: string
  mediaId?: string
  position?: number
  studySetId: string
  term: string
  definition: string
  createdAt: string
  updatedAt: string
}

export default class Flashcards extends BaseModel implements IFlashcard {
  id!: string
  mediaId!: string
  position!: number
  studySetId!: string
  term!: string
  definition!: string
  createdAt!: string
  updatedAt!: string

  static tableName = 'flashcards'

  static relationMappings: RelationMappings = {
    studyset: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'flashcards.study_set_id',
        to: 'study_sets.id',
      },
    },
    testflashcards: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./TestFlashcards').default,
      join: {
        from: 'flashcards.id',
        to: 'test_flashcards.flashcard_id',
      },
    },
    learnflashcards: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./LearnFlashcards').default,
      join: {
        from: 'flashcards.id',
        to: 'learn_flashcards.flashcardId',
      },
    },
    media: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Media').default,
      join: {
        from: 'flashcards.mediaId',
        to: 'media.id',
      },
    },
  }
}

