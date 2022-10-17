import { test, expect } from '@jest/globals'
import supertest from 'supertest'

import app from '../server.js'
import pool from '../database/db.js'

const loggedInUser = {
  userId: '',
  email: '',
  token: '',
  role: 'quest'
}

test('POST /api/users/signup', async () => {
  await pool.query('DELETE FROM users WHERE email=$1', [
    'alan.grey@domain.com'
  ])

  const data = {
    name: 'Alan Grey',
    email: 'alan.grey@domain.com',
    password: 'password123',
    role: 'quest'
  }

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(201)
  expect(response.body.email).toEqual('alan.grey@domain.com')
  expect(response.body.token).toBeTruthy()
  expect(response.body.userId).toBeTruthy()
  expect(response.body.role).toBeTruthy()
  loggedInUser.userId = response.body.userId
  loggedInUser.email = response.body.email
  loggedInUser.token = response.body.token
})

test('GET /api/users', async () => {
  await supertest(app)
    .get('/api/users')
    .expect(200)
    .then((response) => {
      expect(Array.isArray(response.body.users)).toBeTruthy()
    })
})

test('POST /api/users/login', async () => {
  const data = {
    email: 'alan.grey@domain.com',
    password: 'password123'
  }

  const response = await supertest(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(201)
  expect(response.body.email).toEqual('alan.grey@domain.com')
  expect(response.body.token).toBeTruthy()
  expect(response.body.userId).toBeTruthy()
})

test('POST /api/users/login with wrong email', async () => {
  const data = {
    email: 'alan.grey@domain.com',
    password: 'password123321'
  }

  const response = await supertest(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(401)
  expect(response.text).toEqual(
    '{"message":"Could not identify user, credetials might be wrong"}'
  )
})

test('POST /api/users/login with wrong password', async () => {
  const data = {
    email: 'alan.grey1000@domain.com',
    password: 'password123'
  }

  const response = await supertest(app)
    .post('/api/users/login')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(401)
  expect(response.text).toEqual(
    '{"message":"Could not identify user, credetials might be wrong"}'
  )
})

test('POST /api/users/signup with invalid name length', async () => {
  const data = {
    email: 'alan.grey543@domain.com',
    password: 'password123'
  }
  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(422)
  expect(response.text).toEqual(
    '{"message":"Invalid values given, please check the data"}'
  )
})

test('POST /api/users/signup with invalid email', async () => {
  const data = {
    name: 'Alan Grey',
    email: 'alan.grey543@domain',
    password: 'password123'
  }
  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(422)
  expect(response.text).toEqual(
    '{"message":"Invalid values given, please check the data"}'
  )
})

test('POST /api/users/signup with invalid password', async () => {
  const data = {
    name: 'Alan Grey',
    email: 'alan.grey543@domain.com',
    password: 'pass',
    role: 'quest'
  }
  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(422)
  expect(response.text).toEqual(
    '{"message":"Invalid values given, please check the data"}'
  )
})

test('POST /api/users/signup with existing user', async () => {
  const data = {
    name: 'Alan Grey',
    email: 'alan.grey@domain.com',
    password: 'password123',
    role: 'quest'
  }
  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(422)
  expect(response.text).toEqual(
    '{"message":"Could not create user, user exist"}'
  )
})

test('PATCH /api/users/userId change name of the user and password', async () => {
  const data = {
    name: 'clint',
    password: 'password12345'
  }

  const response = await supertest(app)
    .patch('/api/users/' + loggedInUser.userId)
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(200)
})

test('PATCH /api/users/userId change name of the user and password with empty values', async () => {
  const data = {
    name: '',
    password: ''
  }

  const response = await supertest(app)
    .patch('/api/users/' + loggedInUser.userId)
    .set('Accept', 'application/json')
    .send(data)
  expect(response.status).toEqual(422)
  expect(response.text).toEqual(
    '{"message":"Invalid values given, please check the data"}'
  )
})

test('DELETE /api/users/userId/delete delete user', async () => {
  const response = await supertest(app)
    .delete('/api/users/' + loggedInUser.userId + '/delete')
    .set('Accept', 'application/json')
  expect(response.status).toEqual(200)
  expect(response.text).toEqual(
    '{"message":"Deleted the user."}'
  )
})

test('DELETE /api/users/userId/delete try to delete user with wrong id', async () => {
  const response = await supertest(app)
    .delete('/api/users/abcdefg123456789/delete')
    .set('Accept', 'application/json')
  expect(response.status).toEqual(404)
  expect(response.text).toEqual(
    '{"message":"Could not find a user for the provided id."}'
  )
})
