import { NextFunction, Request, Response } from "express";
const tabRouter = require('express').Router()
const TabMongoose = require('../models/tab')
const UserMongoose = require('../models/user')
const jwt = require('jsonwebtoken')

const getTokenFrom = (request: Request) => {
    const authorization = request.get('authorization')
    if (authorization && authorization.toLocaleLowerCase().startsWith('bearer ')) {
        return authorization.substring(7)
    }
    return null
}

tabRouter.get('/', async (request: Request, response: Response) => {
    const tabs = await TabMongoose.find({})
        .populate('user', { userName: 1, name: 1 })
    response.json(tabs)
})

tabRouter.get('/:id', async (request: Request, response: Response, next: NextFunction) => {
    try {
        const tab = await TabMongoose
            .findById(request.params.id)
        if (tab) {
            response.json(tab)
        } else {
            response.status(404).end()
        }
    } catch (exception) {
        next(exception)
    }
})

tabRouter.post('/', async (request: Request, response: Response, next: NextFunction) => {
    const body = request.body

    const token = getTokenFrom(request)
    let decodedToken = null
    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({
                error: 'token missing or invalid'
            })
        }
    } catch (exception) {
        next(exception)
    }

    if (!body.title) {
        return response.status(400).json({
            error: 'title missing'
        })
    }
    
    if (decodedToken) {
        const user = await UserMongoose.findById(decodedToken.id)

        const tab = new TabMongoose({
            ...body,
            user: user._id
        })

        try {
            const savedTab = await tab.save()
            user.tabs = user.tabs.concat(savedTab._id)
            await user.save()
            response.status(201).json(savedTab)
        } catch (exception) {
            next(exception)
        }
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
        next(exception)
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