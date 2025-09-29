import express from 'express'
import * as td from '../models/todo.js'
import { DB } from '../db/connectionManager.js'

const router = express.Router()

function getDB () {
  return DB.ensureModel('todo', 'todos', td.TodoSchema)
}

// Create
router.post('/', async (req, res, next) => {
  try {
    const Todo = getDB()
    const todo = await Todo.create({ title: req.body.title })
    res.status(201).json(todo)
  } catch (err) {
    next(err)
  }
})

// Read all
router.get('/', async (req, res, next) => {
  try {
    const Todo = getDB()
    const items = await Todo.find().sort({ createdAt: -1 })
    res.json(items)
  } catch (err) {
    next(err)
  }
})

// Update
router.put('/:id', async (req, res, next) => {
  try {
    const Todo = getDB()
    const item = await Todo.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    )
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.json(item)
  } catch (err) {
    next(err)
  }
})

// Delete
router.delete('/:id', async (req, res, next) => {
  try {
    const Todo = getDB()
    const item = await Todo.findByIdAndDelete(req.params.id)
    if (!item) return res.status(404).json({ error: 'Not found' })
    res.status(204).end()
  } catch (err) {
    next(err)
  }
})

export default router
