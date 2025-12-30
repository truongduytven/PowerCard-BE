import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IUserLog {
  id: string
  userId: string
  recordStreaks: number
  longestStreaks: number
  lastLoginAt: string | null
}

export default class UserLogs extends BaseModel implements IUserLog{
  id!: string
  userId!: string
  recordStreaks!: number
  longestStreaks!: number
  lastLoginAt!: string | null

  public static tableName = 'user_logs'

  public static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'user_learns.userId',
        to: 'users.id',
      },
    },
  }
}