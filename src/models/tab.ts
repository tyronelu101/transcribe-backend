import { Document } from "mongoose"

const mongoose = require('mongoose')

const tabSchema = new mongoose.Schema({
    title: String,
    artist: String,
    arranger: String,
    tuning: String,
    dateCreated: Date,
    dateModified: Date,
    content: []
})

tabSchema.set('toJSON', {
    transform: (document: Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Tab', tabSchema)