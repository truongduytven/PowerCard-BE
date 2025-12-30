import BaseModel from './BaseModel';
import { Model } from 'objection';
import StudySets from './StudySets';
import Users from './Users';

export type InteractionType = 'view' | 'favorite' | 'clone' | 'share';

class StudySetInteractions extends BaseModel {
  public static tableName = 'study_set_interactions';

  id!: string;
  studySetId!: string;
  userId!: string | null;
  type!: InteractionType;
  createdAt!: string;

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['studySetId', 'type'],
      properties: {
        id: { type: 'string' },
        studySetId: { type: 'string' },
        userId: { type: ['string', 'null'] },
        type: { 
          type: 'string',
          enum: ['view', 'favorite', 'clone', 'share']
        },
        createdAt: { type: 'string' }
      }
    };
  }

  public static get relationMappings() {
    return {
      studySet: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudySets,
        join: {
          from: 'study_set_interactions.study_set_id',
          to: 'study_sets.id'
        }
      },
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: Users,
        join: {
          from: 'study_set_interactions.user_id',
          to: 'users.id'
        }
      }
    };
  }
}

export default StudySetInteractions;
