import { test, afterAll, beforeEach, expect, jest, describe } from "@jest/globals"
import { Tab } from "../types/tab-type"

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const TabMongoose = require('../models/tab')
const helper = require('./test-helper')

beforeEach(async () => {
    await TabMongoose.deleteMany({})

    const tabObjects = helper.initialTabs.map((tab: Tab) => new TabMongoose(tab))
    const promiseArray = tabObjects.map((tab: any) => tab.save())
    await Promise.all(promiseArray)
})

describe('when there is initally some tabs saved', () => {
    test('tabs are returned as json', async () => {
        await api
            .get('/api/tabs')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all tabs are returned', async () => {
        const response = await api.get('/api/tabs')
        expect(response.body).toHaveLength(helper.initialTabs.length)
    })

    test('a specific tab is within the returned tabs', async () => {
        const response = await api.get('/api/tabs')
        const contents = response.body.map((r: any) => r.title)
        expect(contents).toContain('Title2')
    })
})

describe('viewing a specific tab', () => {
    test('succeeds with a valid id', async () => {
        const tabsAtStart = await helper.tabsInDb()

        const tabToView = tabsAtStart[0]
        const tabResult = await api
            .get(`/api/tabs/${tabToView.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const processedTabToView = JSON.parse(JSON.stringify(tabToView))
        expect(tabResult.body).toEqual(processedTabToView)
    })

    test('fails with statuscode 404 if tab does not exist', async () => {
        const validNonexistingId = await helper.nonExistingId()
        await api
            .get(`/api/tabs/${validNonexistingId}`)
            .expect(404)
    })

    test('fails with 400 if id is not valid', async () => {
        const invalidId = "5a3d5da59070081a82a3445"
        await api
            .get(`/api/tabs/${invalidId}`)
            .expect(400)
    })
})

describe('addition of a new tab', () => {
    test('a valid tab can be added', async () => {
        const newTab = {
            title: 'New Title1',
            artist: 'New Artist1',
            arranger: 'New Arranger1',
            dateCreated: new Date(),
            dateModified: new Date(),
            content: []
        }

        await api
            .post('/api/tabs')
            .send(newTab)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const tabs = await helper.tabsInDb()
        expect(tabs).toHaveLength(helper.initialTabs.length + 1)

        const tabTitles = tabs.map((tab: Tab) => tab.title)
        expect(tabTitles).toContain('New Title1')

    })

    test('a tab without title can not be added', async () => {
        const newTab = {
            artist: 'New Artist1',
            arranger: 'New Arranger1',
            dateCreated: new Date(),
            dateModified: new Date(),
            content: []
        }

        await api
            .post('/api/tabs')
            .send(newTab)
            .expect(400)

        const tabs = await helper.tabsInDb()

        expect(tabs).toHaveLength(helper.initialTabs.length)
    })
})

describe('deletion of a tab', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const tabsAtStart = await helper.tabsInDb()
        const tabToDelete = tabsAtStart[0]

        await api.delete(`/api/tabs/${tabToDelete.id}`).expect(204)
        const tabsAtEnd = await helper.tabsInDb()

        expect(tabsAtEnd).toHaveLength(
            helper.initialTabs.length - 1
        )

        const contents = tabsAtEnd.map((r: any) => r.title)

        expect(contents).not.toContain(tabToDelete.title)
    })
})



afterAll(() => {
    mongoose.connection.close()
})