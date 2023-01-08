import { Request, Response } from "express"

export { }
const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')

usersRouter.get('/', async (request: Request, response: Response) => {
    const users = await User
        .find({})
        .populate('tabs')
    response.json(users)
})

usersRouter.get('/:username', async (request: Request, response: Response) => {
    const users = await User
        .find({userName: request.params.username})
        .populate('tabs')
    response.json(users)
})

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

usersRouter.delete('/', async (request: Request, response: Response) => {
    const { userName, password } = request.body

    const user = await User.findOne({ userName })
    const passwordCorrect = user === null ?
        false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const result = await user.delete()
    console.log(result);

    response.status(204).send()
})

module.exports = usersRouter