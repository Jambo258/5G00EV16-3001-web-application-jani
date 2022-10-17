import { Router } from 'express'
import { check } from 'express-validator'

import { getUsers, signUpUser, loginUser, updateUserById, deleteUserById, getUserById } from '../controllers/users.js'

const usersRouter = Router()

usersRouter.get('/', getUsers)

usersRouter.post(
  '/signup',
  [
    check('name').notEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 5 }),
    check('role').notEmpty().isIn(['admin', 'quest'])
  ],
  signUpUser
)

usersRouter.post('/login', loginUser)

usersRouter.get('/:uid', getUserById)

usersRouter.patch(
  '/:uid',
  [check('name').notEmpty(), check('password').isLength({ min: 5 })],
  updateUserById
)

usersRouter.delete('/:uid/delete', deleteUserById)

export default usersRouter
