import createError from 'http-errors'
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import indexRouter from './routes/index'
import { Request, Response, NextFunction } from 'express'
import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUi from 'swagger-ui-express'

// Import database connection
import knex from './configs/db'
import { initializeDatabase } from './configs/init'
import { checkDatabaseTables } from './configs/checkDb'

// --------------------- //

import dotenv from 'dotenv'
dotenv.config()

var app = express()

if (process.env.NODE_ENV !== 'production') {
  app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
  }))
}

app.disable('etag')

app.locals.knex = knex

// Initialize database on startup
const startDatabase = async () => {
  try {
    await initializeDatabase()
    await checkDatabaseTables()
  } catch (error) {
    console.error('Database startup failed:', error)
  }
}

startDatabase()

app.use(logger('dev'))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(express.json({ limit: '50mb' }))
app.use(cookieParser())

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'PowerCard API',
      version: '1.0.0',
      description: 'API documentation with Swagger UI'
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:3000/api'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ]
  },
  apis: ['src/routes/*.ts', 'src/controllers/*.ts', 'dist/routes/*.js', 'dist/controllers/*.js']
}

const swaggerSpec = swaggerJsdoc(options)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec))
app.use('/api', indexRouter)

app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404))
})

app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  res.locals.message = err.message
  res.locals.error = req.app.get('env') === 'development' ? err : {}
  res.status(err.status || 500)
  res.json({ error: res.locals.error })
})

export default app
