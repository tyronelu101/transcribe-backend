import { NextFunction, Request, Response } from "express";
import { Tab } from "../types/tab-type"
const tabRouter = require('express').Router()
const TabMongoose = require('../models/tab')

tabRouter.get('/', async (request: Request, response: Response) => {
    const tabs = await TabMongoose.find({})
    response.json(tabs)
})

tabRouter.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
    const tab = await TabMongoose
        .findBy(request.params.id)
        .catch((error: Error) => next(error))

    if (tab) {
        response.json(tab)
    }
})

tabRouter.post('/', async (request: Request, response: Response) => {
    const body = request.body
    if (!body.title) {
        return response.status(400).json({
            error: 'title missing'
        })
    }

    const tab = new TabMongoose({
        ...body
    })

    const savedTab = await tab.save()
    response.status(201).json(savedTab)

})

tabRouter.put('/:id', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body

    const tab = {
        ...body
    }

    const updatedTab = await TabMongoose
        .findByIdAndUpdate(request.params.id, tab, { new: true })
        .catch((error: Error) => next(error))
    if (updatedTab) {
        response.json(updatedTab)

    }
})

tabRouter.delete('/:id', (request: Request, response: Response, next: NextFunction) => {
    TabMongoose.findByIdAndRemove(request.params.id)
        .then((tab: Tab) => {
            response.status(204).end()
        })
        .catch((error: Error) => next(error))
})

module.exports = tabRouter