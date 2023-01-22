import { Request, Response } from "express"

const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserMongoose = require('../models/user')

authRouter.post('/', async (request: Request, response: Response) => {
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
        { expiresIn: "1m" })

    const refreshToken = jwt.sign(
        userForToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        { expiresIn: "3m" }
    )
    response.cookie('jtw', refreshToken)

    response
        .status(200)
        .send({
            token,
            refreshToken: refreshToken,
            userName: user.userName,
            name: user.name
        })
})

authRouter.post('/refreshtoken', async (request: Request, response: Response) => {
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
        { expiresIn: "1m" })

    const refreshToken = jwt.sign(
        userForToken,
        process.env.REFRESH_TOKEN_PRIVATE_KEY,
        { expiresIn: "120m" }
    )
    response
        .status(200)
        .send({
            token,
            refreshToken: refreshToken,
            userName: user.userName,
            name: user.name
        })

})

module.exports = authRouter