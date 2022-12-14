import { NextFunction, Request, Response } from "express";
import { Tab } from "../types/tab-type"
const tabRouter = require('express').Router()
const TabMongoose = require('../models/tab')

tabRouter.get('/', (request: Request, response: Response) => {
    TabMongoose.find({}).then((tabs: Tab) => {
        response.json(tabs)
    })
})

tabRouter.get('/:id', (request: Request, response: Response, next: NextFunction) => {
    TabMongoose.findById(request.params.id)
        .then((tab: Tab) => {
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

    const tab = new TabMongoose({
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

    TabMongoose.findByIdAndUpdate(request.params.id, tab, { new: true })
        .then((tab: Tab) => {
            response.json(tab)
        })
        .catch((error: Error) => next(error))

})

tabRouter.delete('/:id', (request: Request, response: Response, next: NextFunction) => {
    TabMongoose.findByIdAndRemove(request.params.id)
        .then((tab: Tab) => {
            response.status(204).end()
        })
        .catch((error: Error) => next(error))
})

module.exports = tabRouter