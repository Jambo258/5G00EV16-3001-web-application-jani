import pool from '../database/db.js'

const getAllUsers = async () => {
  const users = await pool.query('SELECT * FROM users ORDER BY id ASC')
  // console.log(users)
  return users.rows
}

const getUserRowCountByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  // console.log(result)
  return result.rowCount !== 0
}

const getUserByEmail = async (email) => {
  const user = await pool.query('SELECT * FROM users WHERE email=$1', [email])
  // console.log(user)
  return user.rows[0]
}

const addUser = async (user) => {
  const result = await pool.query('INSERT INTO users (id, name, email, password,role) VALUES ($1, $2, $3, $4, $5)',
    [user.id, user.name, user.email, user.password, user.role])
  // console.log(result)
  return result.rows
}
const findUserById = async (userId) => {
  const users = await pool.query('SELECT * FROM users WHERE id=$1', [
    userId
  ])
  // console.log('PLACESs', users)
  return users.rows[0]
}
/*
const updatePlaceWithId = async (placeId, title, description) => {
  const result = await pool.query('UPDATE places SET title=$1, description=$2 WHERE id=$3',
    [title, description, placeId])
*/
const updateUserWithId = async (userId, name, hashedPassword) => {
  const result = await pool.query(
    'UPDATE users SET name=$1, password=$2 WHERE id=$3',
    [name, hashedPassword, userId]
  )
  return result.rowCount !== 0
}

const deleteUserWithId = async (userId) => {
  const result = await pool.query('DELETE FROM users WHERE id=$1', [userId])
  // console.log('DELETE', result)
  return result.rowCount !== 0
}

export {
  getAllUsers,
  getUserByEmail,
  getUserRowCountByEmail,
  addUser,
  updateUserWithId,
  deleteUserWithId,
  findUserById
}
