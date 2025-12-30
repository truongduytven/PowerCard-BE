import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IUser {
  id: string
  username: string
  email: string
  password: string
  role: string
  status: string
  avatarUrl?: string
  avatarId?: string
  createdAt: string
  updatedAt: string
}

export default class Users extends BaseModel implements IUser {
  id!: string
  username!: string
  email!: string
  password!: string
  role!: string
  status!: string
  avatarUrl?: string
  avatarId?: string
  createdAt!: string
  updatedAt!: string

  public tableName = 'users'

  public relationMappings: RelationMappings = {
    studyset: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'users.id',
        to: 'study_sets.user_id',
      },
    },
    usertests: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./UserTests').default,
      join: {
        from: 'users.id',
        to: 'user_tests.user_id',
      },
    },
    foldersets: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./FolderSets').default,
      join: {
        from: 'users.id',
        to: 'folder_sets.userId',
      },
    },
    reviews: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Reviews').default,
      join: {
        from: 'users.id',
        to: 'reviews.userId',
      },
    },
    userlearns: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./UserLearns').default,
      join: {
        from: 'users.id',
        to: 'user_learns.userId',
      },
    },
    userlog: {
      relation: Model.HasOneRelation,
      modelClass: () => require('./UserLog').default,
      join: {
        from: 'users.id',
        to: 'user_logs.userId',
      },
    },
  }
}

