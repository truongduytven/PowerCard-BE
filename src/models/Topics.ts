import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface ITopic {
  id: string
  name: string
  status: string
}

export default class Topics extends BaseModel implements ITopic {
  id!: string
  name!: string
  status!: string

  public static tableName = 'topics'

  public static relationMappings: RelationMappings = {
    studyset: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'topics.id',
        to: 'study_sets.topicId'
      },
    }
  }
}

