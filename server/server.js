import express from 'express'
import bodyParser from 'body-parser'
import morgan from 'morgan'
// import 'dotenv/config'
import usersRouter from './routes/users.js'
import todosRouter from './routes/todos.js'

import HttpError from './models/http-error.js'
// require('dotenv').config()
const app = express()

app.use(bodyParser.json())
app.use(morgan('combined'))

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Authorization'
  )
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE')
  next()
})

app.use('/api/users', usersRouter)
app.use('/api/todos', todosRouter)

app.use((req, res, next) => {
  throw new HttpError('Could not find this route.', 404)
})

app.use((error, req, res, next) => {
  if (res.headerSent) {
    return next(error)
  }

  res.status(error.code || 500)
  res.json({ message: error.message || 'Unknown error occured' })
})

const port = process.env.PORT || 5000
if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    console.log(`API is running on port ${port}`)
  })
}
export default app
