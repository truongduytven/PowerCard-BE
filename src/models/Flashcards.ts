import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IFlashcard {
  id: string
  mediaId: string | null
  position?: number
  studySetId: string
  term: string
  definition: string
  status: string
  createdAt: string
  updatedAt: string
}

export default class Flashcards extends BaseModel implements IFlashcard {
  id!: string
  mediaId!: string | null
  position!: number
  studySetId!: string
  term!: string
  definition!: string
  status!: string
  createdAt!: string
  updatedAt!: string

  public static tableName = 'flashcards'

  public static relationMappings: RelationMappings = {
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
    marks: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./FlashcardMarks').default,
      join: {
        from: 'flashcards.id',
        to: 'flashcard_marks.flashcard_id',
      },
    },
  }
}

