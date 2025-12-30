import BaseModel from './BaseModel';
import { Model } from 'objection';
import StudySets from './StudySets';

class StudySetStats extends BaseModel {
  public static tableName = 'study_set_stats';

  studySetId!: string;
  views!: number;
  favorites!: number;
  clones!: number;
  shares!: number;
  createdAt!: string;
  updatedAt!: string;

  public static get idColumn() {
    return 'study_set_id';
  }

  public static get jsonSchema() {
    return {
      type: 'object',
      required: ['studySetId'],
      properties: {
        studySetId: { type: 'string' },
        views: { type: 'integer', minimum: 0, default: 0 },
        favorites: { type: 'integer', minimum: 0, default: 0 },
        clones: { type: 'integer', minimum: 0, default: 0 },
        shares: { type: 'integer', minimum: 0, default: 0 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' }
      }
    };
  }

  public static get relationMappings() {
    return {
      studySet: {
        relation: Model.BelongsToOneRelation,
        modelClass: StudySets,
        join: {
          from: 'study_set_stats.study_set_id',
          to: 'study_sets.id'
        }
      }
    };
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default StudySetStats;
