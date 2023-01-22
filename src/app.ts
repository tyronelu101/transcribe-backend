import { Error } from "mongoose"

export { }
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const tabRouter = require('./controllers/tab')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then((result: any) => {
    logger.info('connected to MongoDB')
  }).catch((error: Error) => {
    logger.error("Error connecting to MongoDB", error.message);
  })

app.use(cors())
app.use(express.json({ limit: '10MB' }));
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

app.use(middleware.authorization)
app.use('/api/tabs', tabRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app