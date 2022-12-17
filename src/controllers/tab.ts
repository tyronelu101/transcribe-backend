import { NextFunction, Request, Response } from "express";
const tabRouter = require('express').Router()
const TabMongoose = require('../models/tab')

tabRouter.get('/', async (request: Request, response: Response) => {
    const tabs = await TabMongoose.find({})
    response.json(tabs)
})

tabRouter.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const tab = await TabMongoose
            .findById(request.params.id)
        if (tab) {
            response.json(tab)
        }
    } catch (exception) {
        next(exception)
    }
})

tabRouter.post('/', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body
    if (!body.title) {
        return response.status(400).json({
            error: 'title missing'
        })
    }

    const tab = new TabMongoose({
        ...body
    })

    try {
        const savedTab = await tab.save()
        response.status(201).json(savedTab)
    } catch (exception) {
        next(exception)
    }

})

tabRouter.put('/:id', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body

    const tab = {
        ...body
    }

    try {
        const updatedTab = await TabMongoose
            .findByIdAndUpdate(request.params.id, tab, { new: true })
        if (updatedTab) {
            response.json(updatedTab)
        }
    } catch (exception) {
        next(error)
    }
})

tabRouter.delete('/:id', async (request: Request, response: Response, next: NextFunction) => {
    try {
        await TabMongoose.findByIdAndRemove(request.params.id)
        response.status(204).end()
    } catch (exception) {
        next(exception)
    }
})

module.exports = tabRouter