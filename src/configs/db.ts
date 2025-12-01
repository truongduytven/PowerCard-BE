import Knex from 'knex';
import { Model } from 'objection';
import dotenv from 'dotenv';

dotenv.config();

import knexConfig from "../configs/knexfile";
const knex = Knex(knexConfig.development);

// Bind knex instance to Model
Model.knex(knex);

export default knex;