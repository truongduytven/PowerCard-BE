import type { Knex } from 'knex'
import { config as dotenvConfig } from 'dotenv'
import { knexSnakeCaseMappers } from 'objection'
import path from 'node:path'

dotenvConfig({ path: path.resolve(__dirname, '../../.env') })

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/database',
      // ssl: { rejectUnauthorized: false }
    },
    migrations: {
      extension: 'ts',
      directory: '../../migrations'
    },
    seeds: {
      extension: 'ts',
      directory: '../../seeds'
    },
    ...knexSnakeCaseMappers(),
    searchPath: ['public']
  },
  production: {
    client: 'pg',
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    },
    migrations: {
      extension: 'ts',
      directory: '../../migrations'
    },
    seeds: {
      extension: 'ts',
      directory: '../../seeds'
    },
    ...knexSnakeCaseMappers(),
    searchPath: ['public']
  }
}

export default knexConfig
