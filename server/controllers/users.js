import { validationResult } from 'express-validator'
import { v4 } from 'uuid'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
// import { useParams } from 'react-router-dom'
import HttpError from '../models/http-error.js'

import {
  addUser,
  getAllUsers,
  getUserByEmail,
  getUserRowCountByEmail,
  updateUserWithId,
  deleteUserWithId,
  findUserById
} from '../models/users.js'

import {

  deleteTodosByUser
} from '../models/todos.js'

const getUsers = async (req, res, next) => {
  const users = await getAllUsers()
  res.json({ users: users })
}

const signUpUser = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid values given, please check the data', 422))
  }

  const { name, email, password, role } = req.body
  const exist = await getUserRowCountByEmail(email)
  if (exist) {
    return next(new HttpError('Could not create user, user exist', 422))
  }

  let hashedPassword
  try {
    // Parameters, the string to hash, salt length to generate or salt to use
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(HttpError(
      'Could not create user, try again', 500))
  }

  // console.log(hashedPassword.length)

  const newUser = {
    id: v4(),
    name,
    email,
    password: hashedPassword,
    role
  }

  const result = await addUser(newUser)
  if (!result) {
    return next(new HttpError('Something went wrong creating the user', 500))
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: newUser.id, // payload, anything that make sense and
        email: newUser.email,
        role: newUser.role // what you might need on the frontend
      },
      process.env.JWT_KEY, // secret key
      { expiresIn: '1h' } // options like an experation time
    )
  } catch (err) {
    return next(new HttpError('Signup failed, please try again', 500))
  }

  res.status(201).json({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    token: token
  })
}

const loginUser = async (req, res, next) => {
  const { email, password } = req.body

  const identifiedUser = await getUserByEmail(email)

  if (!identifiedUser) {
    return next(new HttpError('Could not identify user, credetials might be wrong', 401))
  }

  let isValidPassword = false
  try {
    isValidPassword = await bcrypt.compare(password, identifiedUser.password)
  } catch (err) {
    return next(new HttpError('Could not log you in , check your credetials', 500))
  }

  if (!isValidPassword) {
    return next(new HttpError('Could not identify user, credetials might be wrong', 401))
  }

  let token
  try {
    token = jwt.sign(
      {
        userId: identifiedUser.id, // payload, anything that make sense and
        email: identifiedUser.email,
        role: identifiedUser.role // what you might need on the frontend
      },
      process.env.JWT_KEY, // secret key
      { expiresIn: '1h' } // options like an experation time
    )
  } catch (err) {
    return next(new HttpError('Login in failed, please try again', 500))
  }

  res.status(201).json({
    userId: identifiedUser.id,
    email: identifiedUser.email,
    role: identifiedUser.role,
    token: token
  })
}

const updateUserById = async (req, res, next) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return next(new HttpError('Invalid values given, please check the data', 422))
  }

  const { name, password } = req.body

  const userId = req.params.uid
  const user = await findUserById(userId)
  // console.log(user.name)
  if (!user) {
    return next(
      new HttpError('Could not find a user for the provided id.', 404)
    )
  }
  /*
  if (user.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to update the place.', 401))
  }
*/
  let hashedPassword
  try {
  // Parameters, the string to hash, salt length to generate or salt to use
    hashedPassword = await bcrypt.hash(password, 12)
  } catch (err) {
    return next(HttpError('Could not create user, try again', 500))
  }

  const result = await updateUserWithId(userId, name, hashedPassword)
  // console.log(result)

  if (!result) {
    return next(
      new HttpError('Could not update the details for the provided id.', 404)
    )
  }

  user.name = name
  user.password = hashedPassword

  res.status(200).json({ user: user })
}

const deleteUserById = async (req, res, next) => {
  const userId = req.params.uid
  // console.log(userId)
  const user = await findUserById(userId)
  if (!user) {
    return next(
      new HttpError('Could not find a user for the provided id.', 404)
    )
  }
  /*
  if (user.creator !== req.userData.userId) {
    return next(new HttpError('Not authorized to delete the place.', 401))
  }
*/

  const todoCreator = req.params.uid
  const todos = await deleteTodosByUser(todoCreator)
  console.log(todos)
  const result = await deleteUserWithId(userId)
  if (!result) {
    return next(
      new HttpError('Could not delete the user with provided id.', 404)
    )
  }
  res.status(200).json({ message: 'Deleted the user.' })
}

const getUserById = async (req, res, next) => {
  const userId = req.params.uid
  // console.log(userId)
  const user = await findUserById(userId)

  if (!user) {
    const error = new HttpError(
      'Could not find a user with the provided id.',
      404
    )
    return next(error)
  }

  res.json({ user })
}

export {
  getUsers,
  signUpUser,
  loginUser,
  deleteUserById,
  updateUserById,
  getUserById

}
