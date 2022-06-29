import { Router } from 'express'

const route = Router({ mergeParams: true })

route.get(
	'/',

	async (req, res) => {
		return res.success({ hello: 'world' })
	}
)

export default route
