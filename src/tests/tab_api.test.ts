import { test, afterAll, beforeEach, expect, jest } from "@jest/globals"
import { Tab } from "../types/tab-type"

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const TabMongoose = require('../models/tab')
const helper = require('./test-helper')

beforeEach(async () => {
    await TabMongoose.deleteMany({})
    let noteObject = new TabMongoose(helper.initialTabs[0])
    await noteObject.save()
    noteObject = new TabMongoose(helper.initialTabs[1])
    await noteObject.save()
})

test('tabs are returned as json', async () => {
    await api
        .get('/api/tabs')
        .expect(200)
        .expect('Content-Type', /application\/json/)
}, 100000)

test('all tabs are returned', async () => {
    const response = await api.get('/api/tabs')
    expect(response.body).toHaveLength(helper.initialTabs.length)
})

test('a specific tab is within the returned tabs', async () => {
    const response = await api.get('/api/tabs')
    const contents = response.body.map((r: any) => r.title)
    expect(contents).toContain('Title2')
})

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

test('a specific tab can be viewed', async () => {
    const tabsAtStart = await helper.tabsInDb()

    const tabToView = tabsAtStart[0]
    const tabResult = await api
        .get(`/api/tabs/${tabToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    const processedTabToView = JSON.parse(JSON.stringify(tabToView))
    expect(tabResult.body).toEqual(processedTabToView)

})

test('a tab can be deleted', async () => {
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

afterAll(() => {
    mongoose.connection.close()
})