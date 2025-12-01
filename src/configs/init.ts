import { Model } from 'objection';
import knex from './db';

export const initializeDatabase = async () => {
  try {
    await knex.raw('SELECT 1');
    Model.knex(knex);
    return true;
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    throw error;
  }
};

export default initializeDatabase;