import { NextFunction, Request, Response } from "express";
const tabRouter = require('express').Router()
const TabMongoose = require('../models/tab')
const UserMongoose = require('../models/user')
import { Tab } from "../types/tab-type"
import { AuthRequest } from "../types/request";

tabRouter.get('/', async (request: AuthRequest, response: Response) => {
    const tabs = await TabMongoose.find({ user: request.userId })
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

tabRouter.post('/', async (request: AuthRequest, response: Response, next: NextFunction) => {
    const body = request.body
    const userId = request.userId

    if (userId) {
        const user = await UserMongoose.findById(userId)

        const insertTabs: any[] = []
        const updateTabs: Tab[] = []

        body.forEach((tab: Tab) => {
            tab.user = user.id
            if (tab.id) {
                updateTabs.push(tab)
            } else {
                const mongooseTab = new TabMongoose({ ...tab })
                mongooseTab.localId = tab.localId
                insertTabs.push(mongooseTab)
            }
        });

        try {
            const insertedTabs = await TabMongoose.create(insertTabs)
            const updatedTabs = await Promise.all(
                updateTabs.map((tab: Tab) => TabMongoose.findByIdAndUpdate(tab.id, tab, { new: true }))
            )

            const insertedTabIds: {
                remote: string,
                local: string
            }[] = []
            const updatedTabIds: string[] = updatedTabs.map(tab => tab.id)

            insertedTabs.forEach((tab: Tab) => {
                insertedTabIds.push({
                    remote: tab.id,
                    local: tab.localId
                })
            })

            const result = {
                "inserted": insertedTabIds,
                "updated": updatedTabIds
            }

            response.status(201).json(result)
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

tabRouter.delete('/', async (request: AuthRequest, response: Response, next: NextFunction) => {
    try {
        await TabMongoose.deleteMany({ user: request.userId })
        response.status(204).end()
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