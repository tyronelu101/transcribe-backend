import { NextFunction, Request, Response } from "express";

const tabRouter = require('express').Router()
const Tab = require('../models/tab')

tabRouter.get('/', (request: Request, response: Response) => {
    Tab.find({}).then((tabs) => {
        response.json(tabs)
    })
})

tabRouter.get('/:id', (request: Request, response: Response, next: NextFunction) => {
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

tabRouter.post('/', (request: Request, response: Response) => {
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

tabRouter.put('/:id', (request: Request, response: Response, next: NextFunction) => {
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

tabRouter.delete('/:id', (request: Request, response: Response, next: NextFunction) => {
    Tab.findByIdAndRemove(request.params.id)
        .then(tab => {
            response.status(204).end()
        })
        .catch((error: Error) => next(error))
})

module.exports = tabRouter