namespace Logger {
	const colorOfLevel: any = {
		debug: '96',
		info: '32',
		warning: '33',
		error: '91',
		critical: '31',
	}

	export const debug = (tag: string, message: any) => log('debug', tag, message)
	export const info = (tag: string, message: any) => log('info', tag, message)
	export const warn = (tag: string, message: any) => log('warning', tag, message)
	export const error = (tag: string, message: any) => log('error', tag, message)
	export const crit = (tag: string, message: any) => log('critical', tag, message)

	export const log = (level: string, tag: string, message: any) => {
		if (typeof message !== 'string') {
			if (message?.stack != null) message = message.stack
			else message = `Undefined Message: ${message}`
		}

		const log = level === 'critical' || level === 'error' ? console.error : console.log

		log(
			`\x1B[${colorOfLevel[level]}m[${format(new Date())}]`,
			`[${level.toUpperCase()}]`,
			`[${tag.toUpperCase()}]`,
			message,
			'\x1B[0m'
		)
	}

	const format = (date: Date) =>
		date
			.toISOString()
			.replace('T', ' ')
			.replace(/\.[0-9]*Z/, '')
}

export default Logger
