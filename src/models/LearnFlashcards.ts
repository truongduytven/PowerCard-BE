import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface ILearnFlashcard {
  id: string
  userLearnId: string
  flashcardId: string
  isLearned: boolean
  difficultyId: string
  nextReviewAt: string
  lastReviewedAt: string
}

export default class LearnFlashcards extends BaseModel implements ILearnFlashcard {
  id!: string
  userLearnId!: string
  flashcardId!: string
  isLearned!: boolean
  difficultyId!: string
  nextReviewAt!: string
  lastReviewedAt!: string

  static tableName = 'learn_flashcards'

  static relationMappings: RelationMappings = {
    userlearn: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./UserLearns').default,
      join: {
        from: 'learn_flashcards.user_learn_id',
        to: 'user_learns.id',
      },
    },
    flashcard: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Flashcards').default,
      join: {
        from: 'learn_flashcards.flashcard_id',
        to: 'flashcards.id',
      },
    },
    difficulty: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Difficulties').default,
      join: {
        from: 'learn_flashcards.difficulty_id',
        to: 'difficulties.id',
      },
    },
  }
}

