import { Request, Response } from "express"

const authRouter = require('express').Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const UserMongoose = require('../models/user')

const refreshTokens = []

authRouter.post('/login', async (request: Request, response: Response) => {
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
        userId: user.id,
        userName: user.userName
    }

    const token = jwt.sign(
        userForToken,
        process.env.ACCESS_TOKEN_PRIVATE,
        { expiresIn: "15s" })

    const refreshToken = jwt.sign(
        userForToken,
        process.env.REFRESH_TOKEN_PRIVATE,
        { expiresIn: "60m" }
    )

    refreshTokens.push(refreshToken)

    response
        .status(200)
        .send({
            token,
            refreshToken: refreshToken,
            userName: user.userName,
            name: user.name
        })
})

authRouter.post('/refresh', async (request: Request, response: Response) => {
    const { token } = request.body
    if (token == null) return response.status(401)
    if (!token.includes(token)) return response.sendStatus(401)
    jwt.verify(token, process.env.REFRESH_TOKEN_PRIVATE, (error: any, user: any) => {

        if (error) return response.sendStatus(403)
        const accessToken = jwt.sign(
            user,
            process.env.ACCESS_TOKEN_PRIVATE
        )
        return response
            .status(200)
            .send({ accessToken: accessToken })
    })
})

module.exports = authRouter