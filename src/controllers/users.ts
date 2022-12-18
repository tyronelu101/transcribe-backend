import { Request, Response } from "express"

export { }
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.post('/', async (request: Request, response: Response) => {
    const { userName, name, password } = request.body

    const existingUser = await User.findOne({ userName })
    if (existingUser) {
        return response.status(400).json({
            error: 'username must be unique'
        })
    }


    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = new User({
        userName,
        name,
        passwordHash
    })

    const savedUser = await user.save()

    response.status(201).json(savedUser)
})

module.exports = usersRouter