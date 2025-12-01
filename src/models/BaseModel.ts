import { Model, snakeCaseMappers } from 'objection';

export default class BaseModel extends Model {
  static get columnNameMappers() {
    return snakeCaseMappers();
  }
}