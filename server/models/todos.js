import pool from '../database/db.js'

const addTodo = async (todo) => {
  const result = await pool.query(
    'INSERT INTO todos (id, title, creator) VALUES ($1, $2, $3)',
    [
      todo.id,
      todo.title,
      todo.creator
    ]
  )
  return result.rows
}

const findTodosByUser = async (userId) => {
  const todos = await pool.query('SELECT * FROM todos WHERE creator=$1', [
    userId
  ])
  return todos.rows
}

const findTodoById = async (todoId) => {
  const todos = await pool.query('SELECT * FROM todos WHERE id=$1', [
    todoId
  ])
  return todos.rows[0]
}

const updateTodoWithId = async (todoId, title) => {
  const result = await pool.query(
    'UPDATE todos SET title=$1 WHERE id=$2',
    [title, todoId]
  )
  return result.rowCount !== 0
}

const deleteTodoWithId = async (todoId) => {
  const result = await pool.query('DELETE FROM todos WHERE id=$1', [todoId])
  return result.rowCount !== 0
}

const deleteTodosByUser = async (userId) => {
  const result = await pool.query('DELETE FROM todos WHERE creator=$1', [
    userId
  ])
  return result.rowCount !== 0
}

export {
  addTodo,
  deleteTodoWithId,
  findTodosByUser,
  findTodoById,
  updateTodoWithId,
  deleteTodosByUser
}
