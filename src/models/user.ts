const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    userName: String,
    name: String,
    passwordHash: String,
    tabs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Tab'
        }
    ]
})

userSchema.set('toJSON', {
    transform: (document: Document, returnedObject: any) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User