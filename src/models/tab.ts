import { Document, Schema } from "mongoose"
const mongoose = require('mongoose')

const tabSchema: Schema = new mongoose.Schema({
    title: String,
    artist: String,
    arranger: String,
    tuning: String,
    dateCreated: Date,
    dateModified: Date,
    status: String,
    content: [],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})

tabSchema.set('toJSON', {
    transform: (document: Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Tab', tabSchema)