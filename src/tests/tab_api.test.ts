import { test, afterAll, beforeEach, expect } from "@jest/globals"

const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Tab = require('../models/tab')

const initialTabs = [
    { title: 'Title1', artist: 'Artist1', arranger: 'Arranger1', dateCreated: new Date(), dateModified: new Date(), content: [] },
    { title: 'Title2', artist: 'Artist2', arranger: 'Arranger2', dateCreated: new Date(), dateModified: new Date(), content: [] }
]

beforeEach(async () => {
    await Tab.deleteMany({})
    let noteObject = new Tab(initialTabs[0])
    await noteObject.save()
    noteObject = new Tab(initialTabs[1])
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

afterAll(() => {
    mongoose.connection.close()
})