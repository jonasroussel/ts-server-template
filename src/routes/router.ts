import glob from 'glob'
import path from 'path'
import { Request, Response, NextFunction, Router } from 'express'

import logger from '@/tools/logger'

/**
 * API Routes
 */
export const routes = () => {
	const router = Router({ mergeParams: true })

	// All routes
	glob.sync(`${__dirname}/**/*.js`).forEach((file) => {
		const name = path.basename(file)
		if (name === 'router.js') return
		router.use(require(path.resolve(file)).default)
	})

	// Health Check
	router.get('/healthcheck', (_, res) => res.status(200).end())

	return router
}

/**
 * Utils Middleware
 */
export const utils = () => {
	return (req: Request, res: Response, next: NextFunction) => {
		res.error = (status, type, message) => {
			return res.status(status).json({
				valid: false,
				error: {
					type: type,
					message: message ?? type,
				},
			})
		}

		res.success = (data) => {
			return res.json({
				valid: true,
				data: data,
			})
		}

		req.queries = req.query as any

		return next()
	}
}

/**
 * Logs Middleware
 */
export const logs = () => {
	const format = (req: Request, res: Response, error?: any) => {
		req.time = new Date(req.time != null ? Date.now() - req.time.getTime() : 0)

		let stack = ''
		if (error) stack = error.stack ?? error

		const base = `${req.method} ${req.originalUrl} ${req.ip}`
		if (req.state !== 'closed') {
			return `${base} ${res.statusCode} (${req.time.getTime()}ms) ${stack}`.trim()
		} else {
			return `${base} (closed) ${stack}`.trim()
		}
	}

	return (req: Request, res: Response, next: NextFunction) => {
		req.time = new Date()

		res.on('error', (error) => {
			req.state = 'error'

			logger.error('http', format(req, res, error))
		})

		res.on('close', () => {
			if (req.state != null || req.originalUrl === '/healthcheck') return
			req.state = 'closed'

			logger.info('http', format(req, res))
		})

		res.on('finish', () => {
			if (req.state != null || req.originalUrl === '/healthcheck') return
			req.state = 'success'

			logger.log(res.statusCode >= 400 ? 'warning' : 'info', 'http', format(req, res))
		})

		return next()
	}
}

/**
 * Errors Handler
 */
export const errors = () => {
	// JSON Parsing Error
	const json = (error: any, req: Request, res: Response, next: NextFunction) => {
		if (!(error instanceof SyntaxError)) return next(error)

		return res.status(400).json({
			error: {
				status: 400,
				type: 'invalid_json',
				message: error.message,
			},
		})
	}

	// Invalid Path Error
	const path = (req: Request, res: Response) => {
		return res.status(404).json({
			error: {
				status: 404,
				type: 'invalid_path',
				message: `${req.method} ${req.originalUrl} is not a valid path`,
			},
		})
	}

	// Unknown Error
	const unknown = (error: any, req: Request, res: Response, next: NextFunction) => {
		res.emit('error', error)

		return res.status(500).json({
			error: {
				status: 500,
				type: 'unknown',
				message: 'An unknown error has occurred during the request',
			},
		})
	}

	return [json, path, unknown]
}
