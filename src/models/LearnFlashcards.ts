import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface ILearnFlashcard {
  id: string
  userLearnId: string
  flashcardId: string
  isLearned: boolean
  difficultyId: string | null
  nextReviewAt: string | null
  lastReviewedAt: string | null
}

export default class LearnFlashcards extends BaseModel implements ILearnFlashcard {
  id!: string
  userLearnId!: string
  flashcardId!: string
  isLearned!: boolean
  difficultyId!: string | null
  nextReviewAt!: string | null
  lastReviewedAt!: string | null

  public tableName = 'learn_flashcards'

  public relationMappings: RelationMappings = {
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

