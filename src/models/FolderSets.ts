import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IFolderSet {
  id: string
  userId: string
  icon: string | null
  title: string
  description: string
  numberOfStudySets?: number
  status: string
}

export default class FolderSets extends BaseModel implements IFolderSet {
  id!: string
  userId!: string
  icon!: string | null
  title!: string
  description!: string
  numberOfStudySets?: number
  status!: string

  public tableName = 'folder_sets'

  public relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'folder_sets.userId',
        to: 'users.id',
      },
    },
    folderstudyset: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./FolderStudySets').default,
      join: {
        from: 'folder_sets.id',
        to: 'folder_study_sets.folderSetId',
      },
    }
  }
}

