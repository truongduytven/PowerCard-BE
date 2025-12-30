import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IDifficulty {
  id: string
  userLearnId: string
  name: string
  minutes: number
}

export default class Difficulties extends BaseModel implements IDifficulty {
  id!: string
  userLearnId!: string
  name!: string
  minutes!: number

  public static tableName = 'difficulties'

  public static relationMappings: RelationMappings = {
    learnFlashcard: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./LearnFlashcards').default,
      join: {
        from: 'difficulties.id',
        to: 'learn_flashcards.difficultyId'
      },
    },
    userlearn: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./UserLearns').default,
      join: {
        from: 'difficulties.user_learn_id',
        to: 'user_learns.id',
      },
    }
  }
}

