import { NextFunction, Request, Response } from "express";
import { Error } from "mongoose";

const express = require('express')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json({ limit: '10MB' }));

const Tab = require('./models/tab')

app.get('/api/tabs/', (request: Request, response: Response) => {
  Tab.find({}).then((tabs) => {
    response.json(tabs)
  })
})

app.get('/api/tabs/:id', (request: Request, response: Response, next: NextFunction) => {
  Tab.findById(request.params.id)
    .then(tab => {
      if (tab) {
        response.json(tab)
      } else {
        response.status(404).end()
      }
    })
    .catch((error: Error) => next(error))
})


app.delete('/api/tabs/:id', (request: Request, response: Response, next: NextFunction) => {
  Tab.findByIdAndRemove(request.params.id)
    .then(tab => {
      response.status(204).end()
    })
    .catch((error: Error) => next(error))
})

app.post('/api/tabs', (request: Request, response: Response) => {
  const body = request.body
  if (!body.title) {
    return response.status(400).json({
      error: 'title missing'
    })
  }

  const tab = new Tab({
    ...body
  })

  tab.save().then((savedTab: any) => {
    response.json(savedTab)
  })

})

app.put('/api/tabs/:id', (request: Request, response: Response, next: NextFunction) => {
  const body = request.body

  const tab = {
    ...body
  }

  Tab.findByIdAndUpdate(request.params.id, tab, { new: true })
    .then(updatedTab => {
      response.json(updatedTab)
    })
    .catch((error: Error) => next(error))

})

const unknownEndpoint = (request: Request, response: Response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
  console.log(error.message);

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  next(error)
}

app.use(errorHandler)

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})