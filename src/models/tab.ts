const mongoose = require('mongoose')
const url = process.env.MONGODB_CONNSTRING

mongoose.connect(url).then((result: any) => {
    console.log('conncted to MongoDB')
}).catch((error) => {
    console.log("Error connecting to MongoDB", error.message);

})

const tabSchema = new mongoose.Schema({
    title: String,
    arranger: String,
    tuning: String,
    dateCreated: Date,
    dateModified: Date,
    content: []
})


tabSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Tab', tabSchema)