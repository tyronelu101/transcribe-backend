export { }
const config = require('./utils/config')
const express = require('express')
const app = express()
const cors = require('cors')
const tabRouter = require('./controllers/tab')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')
console.log("CONFIG IS", config);

logger.info('connectings to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then((result: any) => {
    logger.info('conncted to MongoDB')
  }).catch((error) => {
    logger.error("Error connecting to MongoDB", error.message);
  })

app.use(cors())
app.use(express.json({ limit: '10MB' }));
app.use(middleware.requestLogger)

app.use('/api/tab', tabRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})