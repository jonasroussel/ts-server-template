import 'module-alias/register'

import http from 'http'

import cors from 'cors'
import express from 'express'
import 'express-async-errors'

import Logger from '@/tools/logger'
import * as router from '@/routes/router'

/******************/
/* Initialization */
/******************/

Logger.debug('server', 'starting...')

// Server Port
const PORT = parseInt(process.env.PORT || '8080')

// HTTP Application
const app = express()
if (process.env.NODE_ENV === 'production') app.enable('trust proxy')

// HTTP Server
const server = http.createServer(app)

/***************/
/* Application */
/***************/

// CORS Handler
app.use(
	cors({
		origin: '*',
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
		optionsSuccessStatus: 204,
		credentials: true,
		preflightContinue: false,
		maxAge: 3600,
	})
)

// JSON Parsing
app.use(express.json({ limit: '42mb' }))

// Utils Middleware
app.use(router.utils())

// Logs Middleware
app.use(router.logs())

// API Routes
app.use(router.routes())

// Errors Handler
app.use(router.errors())

/******************/
/* Start Services */
/******************/

process.on('uncaughtException', (error) =>
	Logger.crit('server', `Uncaught Exception: ${error.stack ?? `${error.name} ${error.message}`}`)
)

async function main() {
	server.listen(PORT, () => {
		Logger.debug('server', `started on port ${PORT}`)
	})
}

main()
