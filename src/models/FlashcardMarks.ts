import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IFlashcardMark {
  id: string
  userId: string
  flashcardId: string
  isMarked: boolean
  markedAt: string
  updatedAt: string
}

export default class FlashcardMarks extends BaseModel implements IFlashcardMark {
  id!: string
  userId!: string
  flashcardId!: string
  isMarked!: boolean
  markedAt!: string
  updatedAt!: string

  public tableName = 'flashcard_marks'

  public relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'flashcard_marks.userId',
        to: 'users.id',
      },
    },
    flashcard: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Flashcards').default,
      join: {
        from: 'flashcard_marks.flashcardId',
        to: 'flashcards.id',
      },
    },
  }
}
