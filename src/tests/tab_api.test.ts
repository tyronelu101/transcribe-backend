import { test, afterAll, beforeEach, expect } from "@jest/globals"
import { Tab } from "../types/tab-type"

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const TabMongoose = require('../models/tab')

const initialTabs = [
    { title: 'Title1', artist: 'Artist1', arranger: 'Arranger1', dateCreated: new Date(), dateModified: new Date(), content: [] },
    { title: 'Title2', artist: 'Artist2', arranger: 'Arranger2', dateCreated: new Date(), dateModified: new Date(), content: [] }
]

beforeEach(async () => {
    await TabMongoose.deleteMany({})
    let noteObject = new TabMongoose(initialTabs[0])
    await noteObject.save()
    noteObject = new TabMongoose(initialTabs[1])
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
    expect(response.body).toHaveLength(initialTabs.length)
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

    const response = await api.get('/api/tabs')
    const contents = response.body.map((tab: Tab) => tab.title)

    expect(response.body).toHaveLength(initialTabs.length + 1)
    expect(contents).toContain('New Title1')

})

afterAll(() => {
    mongoose.connection.close()
})