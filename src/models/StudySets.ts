import { RelationMappings, Model } from 'objection'
import BaseModel from './BaseModel'

export interface IStudySet {
  id: string
  userId: string
  title: string
  description: string
  topicId: string
  icon: string | null
  isPublic: boolean
  numberOfFlashcards?: number
  fromStudySetId?: string | null
  type: string
  status: string
  createdAt: string
  updatedAt: string
}

export default class StudySets extends BaseModel implements IStudySet {
  id!: string
  userId!: string
  title!: string
  description!: string
  topicId!: string
  icon!: string | null
  isPublic!: boolean
  numberOfFlashcards?: number
  fromStudySetId?: string | null
  type!: string
  status!: string
  createdAt!: string
  updatedAt!: string

  static tableName = 'study_sets'

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Users').default,
      join: {
        from: 'study_sets.user_id',
        to: 'users.id',
      },
    },
    flashcards: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Flashcards').default,
      join: {
        from: 'study_sets.id',
        to: 'flashcards.study_set_id',
      },
    },
    reviews: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./Reviews').default,
      join: {
        from: 'study_sets.id',
        to: 'reviews.studySetId',
      },
    },
    folderstudyset: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./FolderStudySets').default,
      join: {
        from: 'study_sets.id',
        to: 'folder_study_sets.studySetId',
      },
    },
    userlearns: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./UserLearns').default,
      join: {
        from: 'study_sets.id',
        to: 'user_learns.studySetId',
      },
    },
    topic: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./Topics').default,
      join: {
        from: 'study_sets.topic_id',
        to: 'topics.id',
      },
    },
    interactions: {
      relation: Model.HasManyRelation,
      modelClass: () => require('./StudySetInteractions').default,
      join: {
        from: 'study_sets.id',
        to: 'study_set_interactions.study_set_id',
      },
    },
    stats: {
      relation: Model.HasOneRelation,
      modelClass: () => require('./StudySetStats').default,
      join: {
        from: 'study_sets.id',
        to: 'study_set_stats.study_set_id',
      },
    },
    fromStudySet: {
      relation: Model.BelongsToOneRelation,
      modelClass: () => require('./StudySets').default,
      join: {
        from: 'study_sets.from_study_set_id',
        to: 'study_sets.id',
      },
    }
  }
}

