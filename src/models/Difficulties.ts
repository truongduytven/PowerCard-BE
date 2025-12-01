import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IDifficulty {
  id: string
  name: string
  minutes: number
}

export default class Difficulties extends BaseModel implements IDifficulty {
  id!: string
  name!: string
  minutes!: number

  static tableName = 'difficulties'

  static relationMappings: RelationMappings = {
    learnFlashcard: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./LearnFlashcards').default,
      join: {
        from: 'difficulties.id',
        to: 'learn_flashcards.difficultyId'
      },
    }
  }
}

