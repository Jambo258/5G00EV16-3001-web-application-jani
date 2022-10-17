import { beforeAll, describe, it, expect } from '@jest/globals'
import supertest from 'supertest'
import app from '../server.js'
import pool from '../database/db.js'

const loggedInUser = {
  userId: '',
  email: '',
  token: '',
  role: 'quest'
}

beforeAll(async () => {
  await pool.query('DELETE FROM users WHERE email=$1', [
    'john.wayne@domain.com'
  ])
  const data = {
    name: 'John Wayne',
    email: 'john.wayne@domain.com',
    password: 'password123',
    role: 'quest'
  }

  const response = await supertest(app)
    .post('/api/users/signup')
    .set('Accept', 'application/json')
    .send(data)
  loggedInUser.userId = response.body.userId
  loggedInUser.email = response.body.email
  loggedInUser.token = response.body.token
})

describe('The places route', () => {
  let createdTodoId = ''
  it('POST /api/todos should create a todo', async () => {
    const todo = {
      title: 'Pick up groceries',
      creator: loggedInUser.userId
    }
    const response = await supertest(app)
      .post('/api/todos')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(todo)
    expect(response.status).toEqual(201)
    expect(response.body.todo.id).toBeTruthy()
    expect(response.body.todo.title).toEqual('Pick up groceries')
    expect(response.body.todo.creator).toEqual(loggedInUser.userId)
    createdTodoId = response.body.todo.id
    // console.log(createdTodoId)
  })

  it('GET /api/todos/user/userId should return todos of the user', async () => {
    const response = await supertest(app)
      .get('/api/todos/user/' + loggedInUser.userId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(Array.isArray(response.body.todos)).toBeTruthy()
  })

  it('GET /api/todos/user/userId should return for no valid user', async () => {
    const response = await supertest(app)
      .get('/api/todos/user/b6bc11e2-7b2d-42ae-a517-41dfc8e6a546')
      .set('Accept', 'application/json')
    expect(response.status).toEqual(404)
    expect(response.text).toEqual(
      '{"message":"Could not find todos for the provided user id."}'
    )
  })

  it('PATCH /api/todos/todoId should update the todo', async () => {
    const todo = {
      title: 'pick up groceries!'
    }
    const response = await supertest(app)
      .patch('/api/todos/' + createdTodoId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(todo)
    expect(response.status).toEqual(200)
    expect(response.body.todo.title).toBeTruthy()
    expect(response.body.todo.title).toEqual('pick up groceries!')
  })

  it('PATCH /api/todos/todoId should not update todo with invalid title', async () => {
    const todo = {
      title: ''
    }
    const response = await supertest(app)
      .patch('/api/todos/' + createdTodoId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
      .send(todo)
    expect(response.status).toEqual(422)
    expect(response.text).toEqual(
      '{"message":"Invalid values given, please check the data"}'
    )
  })

  it('GET /api/todos/todoId should return todo', async () => {
    const response = await supertest(app)
      .get('/api/todos/' + createdTodoId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.todo.id).toEqual(createdTodoId)
    expect(response.body.todo.title).toBeTruthy()
    expect(response.body.todo.title).toEqual('pick up groceries!')
  })

  it('GET /api/todos/todoId should not return a todo if invalid todo id', async () => {
    const response = await supertest(app)
      .get('/api/todos/b6bc11e2-7b2d-42ae-a517-41dfc8e6a546')
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(404)
    expect(response.text).toEqual(
      '{"message":"Could not find a todo for the provided id."}'
    )
  })

  it('DELETE /api/todos/todoId should delete todo', async () => {
    const response = await supertest(app)
      .delete('/api/todos/' + createdTodoId)
      .set('Authorization', 'Bearer ' + loggedInUser.token)
      .set('Accept', 'application/json')
    expect(response.status).toEqual(200)
    expect(response.body.message).toEqual('Deleted the todo.')
  })
})
