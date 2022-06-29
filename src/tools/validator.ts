import Joi from 'joi'
import { NextFunction, Request, Response } from 'express'

type SchemaType = Joi.PartialSchemaMap<any> | (() => Joi.PartialSchemaMap<any>)

namespace Validator {
	export const validate = (schema: Joi.Schema, data: any, res: Response) => {
		let { value, error } = schema.validate(data, { abortEarly: false, stripUnknown: true })
		if (error != null) {
			res.status(400).json({
				error: {
					status: 400,
					type: 'validation_failed',
					details: error.details.map((e: any) => ({
						field: e.path.join('.'),
						error: e.type,
						message: e.message,
					})),
				},
			})
			return null
		}

		return value ?? {}
	}

	export const body = (schema: SchemaType) => {
		return (req: Request, res: Response, next: NextFunction) => {
			req.body = validate(Joi.object(typeof schema === 'function' ? schema() : schema), req.body, res)
			if (req.body != null) return next()
		}
	}

	export const queries = (schema: SchemaType) => {
		return (req: Request, res: Response, next: NextFunction) => {
			req.queries = validate(Joi.object(typeof schema === 'function' ? schema() : schema), req.queries, res)
			if (req.queries != null) return next()
		}
	}

	export const params = (schema: SchemaType) => {
		return (req: Request, res: Response, next: NextFunction) => {
			req.params = validate(Joi.object(typeof schema === 'function' ? schema() : schema), req.params, res)
			if (req.params != null) return next()
		}
	}
}

export default Validator
