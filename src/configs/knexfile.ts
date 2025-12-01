import type { Knex } from 'knex'
import { config as dotenvConfig } from 'dotenv'
import { knexSnakeCaseMappers } from 'objection'
import path from 'path'

dotenvConfig({ path: path.resolve(__dirname, '../../.env') })

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: process.env.DATABASE_URL || 'postgres://user:password@localhost:5432/database',
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
