# [name]

[description]

## 📚 Primary Dependencies

```
- NodeJS 16.x
- Express 4.18.x (HTTP Framework)
- Joi 17.6.x (Request Validation)
```

## ⚛️ App Structure

The entrypoint of the app is of course `src/main.ts`. Everything is initialize in this file, and all asynchronous initializations are in the `async main` function

### 📁 Files

- `libs` folder contains `stateful` modules like database or external modules

- `routes` folder contains `router.ts` file and every controller files used in the app

- `tools` folder contains different functions used everywhere in the app, categorized by type (`consts`, `parsers`, ...)

- `types` folder contains global `typescript` types definitions

### 🚏 Routes

To create a new route controller, simply add a file in the `routes` directory with the code below.

_A good practice would be to make the path of the file about the same as the controller prefix route name_

```ts
import { Router } from 'express'

const route = Router({ mergeParams: true })

route.get(
  '/',

  async (req, res) => {
    ...
  }
)

export default route

```

Every route controllers are registered automaticly in the `router.ts`, inside the `route` function

## 🚀 How to run?

```sh
# npm
npm install
npm run dev

# yarn
yarn install
yarn run dev
```
