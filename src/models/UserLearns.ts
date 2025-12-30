import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IUserLearn {
  id: string
  userId: string
  studySetId: string
  processing: number
  status: string
}

export default class UserLearns extends BaseModel implements IUserLearn{
  id!: string
  userId!: string
  studySetId!: string
  processing!: number
  status!: string

  public tableName = 'user_learns'

  public relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'user_learns.userId',
        to: 'users.id',
      },
    },
    studyset: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'user_learns.studySetId',
        to: 'study_sets.id',
      },
    },
    learnFlashcard: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./LearnFlashcards').default,
      join: {
        from: 'user_learns.id',
        to: 'learn_flashcards.userLearnId',
      },
    },
    difficulties: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Difficulties').default,
      join: {
        from: 'user_learns.id',
        to: 'difficulties.user_learn_id',
      },
    }
  }
}

