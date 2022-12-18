const TabMongoose = require('../models/tab')
const UserMongoose = require('../models/user')

const initialTabs = [
    { title: 'Title1', artist: 'Artist1', arranger: 'Arranger1', dateCreated: new Date(), dateModified: new Date(), content: [] },
    { title: 'Title2', artist: 'Artist2', arranger: 'Arranger2', dateCreated: new Date(), dateModified: new Date(), content: [] }
]

const nonExistingId = async () => {
    const tab = new TabMongoose(
        {
            title: 'TempTitle1',
            artist: 'TempArtist1',
            arranger: 'TempArranger1',
            dateCreated: new Date(),
            dateModified: new Date(),
            Gcontent: []
        },
    )
    await tab.save()
    await tab.remove()

    return tab._id.toString()
}

const tabsInDb = async () => {
    const tabs = await TabMongoose.find({})
    return tabs.map((tab: any) => tab.toJSON())
}

const usersInDb = async () => {
    const users = await UserMongoose.find({})
    return users.map((u: any) => u.toJSON())
}

module.exports = {
    initialTabs,
    nonExistingId,
    tabsInDb,
    usersInDb
}