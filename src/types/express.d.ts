namespace Express {
	interface Request {
		time?: Date
		state?: 'success' | 'closed' | 'error'
		queries: any
	}

	interface Response {
		error: (status: number, type: string, message?: string) => Response
		success: (data?: any) => Response
	}
}
