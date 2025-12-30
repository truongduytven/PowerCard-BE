import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IMedia {
  id: string
  name?: string
  imageUrl?: string
  imageId?: string
  isPublic: boolean
  status: string
}

export default class Media extends BaseModel implements IMedia {
  id!: string
  name!: string
  imageUrl!: string
  imageId!: string
  isPublic!: boolean
  status!: string

  public tableName = 'media'

  public relationMappings: RelationMappings = {
    flashcard: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Flashcards').default,
      join: {
        from: 'media.id',
        to: 'flashcards.mediaId'
      }
    }
  }
}

