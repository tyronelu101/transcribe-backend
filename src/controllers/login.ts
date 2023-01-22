import { Request, Response } from "express"

export { }
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const UserMongoose = require('../models/user')

loginRouter.post('/', async (request: Request, response: Response) => {
    const { userName, password } = request.body

    const user = await UserMongoose.findOne({ userName })
    const passwordCorrect = user === null ?
        false
        : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        return response.status(401).json({
            error: 'invalid username or password'
        })
    }

    const userForToken = {
        userName: user.userName,
        id: user._id,
    }

    const token = jwt.sign(
        userForToken,
        process.env.SECRET,
        { expiresIn: 60 * 60 })

    response
        .status(200)
        .send({ token, userName: user.userName, name: user.name })

})

module.exports = loginRouter