import { Router } from 'express'
import { check } from 'express-validator'

import {
  createTodo,
  getTodoById,
  getTodosByUserId,
  updateTodoById,
  deleteTodoById
  // deletePlacesByUserId
} from '../controllers/todos.js'

import checkToken from '../middleware/verifyToken.js'

const todosRouter = Router()

todosRouter.get('/:tid', getTodoById)

todosRouter.get('/user/:uid', getTodosByUserId)

todosRouter.use(checkToken)

todosRouter.post(
  '/',
  [
    check('title').notEmpty()

  ],
  createTodo
)

todosRouter.patch(
  '/:tid',
  [check('title').notEmpty()],
  updateTodoById
)

todosRouter.delete('/:tid', deleteTodoById)

// placesRouter.delete('/:uid/deleteall', deletePlacesByUserId)

export default todosRouter
