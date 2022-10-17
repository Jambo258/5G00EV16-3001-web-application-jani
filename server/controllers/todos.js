import { v4 } from 'uuid'
import { validationResult } from 'express-validator'

import HttpError from '../models/http-error.js'
import {
  addTodo,
  deleteTodoWithId,
  findTodosByUser,
  findTodoById,
  updateTodoWithId,
  deleteTodosByUser
} from '../models/todos.js'

const getTodoById = async (req, res, next) => {
  const todoId = req.params.tid
  const todo = await findTodoById(todoId)

  if (!todo) {
    const error = new HttpError(
      'Could not find a todo for the provided id.',
      404
    )
    return next(error)
  }

  res.json({ todo })
}

const getTodosByUserId = async (req, res, next) => {
  const todoCreator = req.params.uid
  const todos = await findTodosByUser(todoCreator)

  if (!todos || todos.length === 0) {
    return next(
      new HttpError('Could not find todos for the provided user id.', 404)
    )
  }

  res.json({ todos })
}

const createTodo = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }

  const { title, creator } = req.body
  const newTodo = {
    id: v4(),
    title,
    creator
  }

  const result = await addTodo(newTodo)
  if (!result) {
    return next(new HttpError('Something went wrong creating the user', 500))
  }
  res.status(201).json({ todo: newTodo })
}

const updateTodoById = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid values given, please check the data', 422)
    )
  }
  const { title } = req.body
  const todoId = req.params.tid

  const todo = await findTodoById(todoId)

  if (!todo) {
    return next(
      new HttpError('Could not find todo for the provided id.', 404)
    )
  }

  if (todo.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to update the todo.', 401))
  }

  const result = await updateTodoWithId(todoId, title)
  // console.log(result)
  if (!result) {
    return next(
      new HttpError('Could not update the details for the provided id.', 404)
    )
  }
  todo.title = title

  res.status(200).json({ todo: todo })
}

const deleteTodoById = async (req, res, next) => {
  const todoId = req.params.tid

  const todo = await findTodoById(todoId)
  if (!todo) {
    return next(
      new HttpError('Could not find todo for the provided id.', 404)
    )
  }

  if (todo.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to delete the todo.', 401))
  }

  const result = await deleteTodoWithId(todoId)
  if (!result) {
    return next(
      new HttpError('Could not delete the todo with the provided id.', 404)
    )
  }
  res.status(200).json({ message: 'Deleted the todo.' })
}

const deleteTodosByUserId = async (req, res, next) => {
  const todoCreator = req.params.uid
  const todos = await deleteTodosByUser(todoCreator)

  if (!todos || todos.length === 0) {
    return next(
      new HttpError('Could not find todo for the provided user id.', 404)
    )
  }

  res.status(200).json({ message: 'Deleted all user todos.' })
}

export {
  createTodo,
  getTodoById,
  getTodosByUserId,
  updateTodoById,
  deleteTodoById,
  deleteTodosByUserId
}
