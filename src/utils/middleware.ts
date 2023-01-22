import { NextFunction, Request, Response } from "express";
import { AuthRequest } from "../types/request";

const jwt = require('jsonwebtoken')
const logger = require('./logger')

const authorization = (request: AuthRequest, response: Response, next: NextFunction) => {
    const authorization = request.get('authorization')
    let token = null
    if (authorization && authorization.toLocaleLowerCase().startsWith('bearer ')) {
        token = authorization.substring(7)
    }

    let decodedToken = null
    try {
        decodedToken = jwt.verify(token, process.env.SECRET)
        if (!decodedToken.id) {
            return response.status(401).json({
                error: 'token missing or invalid'
            })
        } else {
            request.userId = decodedToken.id
            next()
        }
    } catch (exception) {
        next(exception)
    }
}

const requestLogger = (request: Request, response: Response, next: NextFunction) => {
    logger.info('Method:', request.method)
    logger.info('Path:', request.path)
    logger.info('Body:', request.body)
    logger.info('---:', request.method)
    next()
}

const unknownEndpoint = (request: Request, response: Response) => {
    response.status(404).send({ error: 'unkown endpoint' })
}

const errorHandler = (error: Error, request: Request, response: Response, next: NextFunction) => {
    logger.error(error.message)
    logger.error("HELLO")
    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.name === 'JsonWebTokenError') {
        return response.status(401).json({ error: 'invalid token' })
    } else if (error.name === 'TokenExpiredError') {
        return response.status(401).json({ error: 'token expired' })
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    authorization
}