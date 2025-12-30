import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IReview {
  id: string
  userId: string
  studySetId: string
  rating: number
  comment?: string
}

export default class Reviews extends BaseModel implements IReview{
  id!: string
  userId!: string
  studySetId!: string
  rating!: number
  comment?: string

  public tableName = 'reviews'

  public relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'reviews.userId',
        to: 'users.id',
      },
    },
    studyset: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'reviews.studySetId',
        to: 'study_sets.id',
      },
    }
  } 
}

