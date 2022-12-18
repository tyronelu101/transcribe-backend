import { NextFunction, Request, Response } from "express";

const logger = require('./logger')

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
    }
    next(error)
}

module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler
}