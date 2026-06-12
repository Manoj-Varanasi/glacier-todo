import { Router } from 'express'
import db from '../db.js'
import auth from '../middleware/auth.js'

const router = Router()
router.use(auth)

function getToday() {
  return new Date().toISOString().split('T')[0]
}

router.get('/', (req, res) => {
  const todos = db.prepare('SELECT * FROM todos WHERE user_id = ? ORDER BY created_at DESC').all(req.userId)
  const streakDates = db.prepare('SELECT date FROM streak_dates WHERE user_id = ?').all(req.userId).map(r => r.date)
  const totalCompleted = db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 1').get(req.userId).count

  res.json({
    todos: todos.map(t => ({ ...t, completed: !!t.completed })),
    streakDates,
    totalCompleted,
  })
})

router.post('/', (req, res) => {
  const { text } = req.body
  if (!text?.trim()) return res.status(400).json({ error: 'Text is required' })

  const id = Date.now() + '-' + Math.random().toString(36).slice(2)
  const now = new Date().toISOString()
  db.prepare('INSERT INTO todos (id, user_id, text, created_at) VALUES (?, ?, ?, ?)').run(id, req.userId, text.trim(), now)

  res.json({ id, text: text.trim(), completed: false, created_at: now, completed_at: null })
})

router.put('/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!todo) return res.status(404).json({ error: 'Todo not found' })

  const { text, completed } = req.body
  const today = getToday()

  if (typeof text === 'string' && text.trim()) {
    db.prepare('UPDATE todos SET text = ? WHERE id = ?').run(text.trim(), req.params.id)
  }

  if (typeof completed === 'boolean') {
    const wasCompleted = !!todo.completed
    if (completed && !wasCompleted) {
      db.prepare('UPDATE todos SET completed = 1, completed_at = ? WHERE id = ?').run(today, req.params.id)
      db.prepare('INSERT OR IGNORE INTO streak_dates (user_id, date) VALUES (?, ?)').run(req.userId, today)
    } else if (!completed && wasCompleted) {
      db.prepare('UPDATE todos SET completed = 0, completed_at = NULL WHERE id = ?').run(req.params.id)
      const hasOtherToday = db.prepare('SELECT COUNT(*) as count FROM todos WHERE user_id = ? AND completed = 1 AND completed_at = ? AND id != ?').get(req.userId, today, req.params.id).count
      if (hasOtherToday === 0) {
        db.prepare('DELETE FROM streak_dates WHERE user_id = ? AND date = ?').run(req.userId, today)
      }
    }
  }

  const updated = db.prepare('SELECT * FROM todos WHERE id = ?').get(req.params.id)
  res.json({ ...updated, completed: !!updated.completed })
})

router.delete('/:id', (req, res) => {
  const todo = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?').get(req.params.id, req.userId)
  if (!todo) return res.status(404).json({ error: 'Todo not found' })

  db.prepare('DELETE FROM todos WHERE id = ?').run(req.params.id)
  res.json({ success: true })
})

router.delete('/', (req, res) => {
  const { ids } = req.body
  if (!Array.isArray(ids)) return res.status(400).json({ error: 'ids array required' })

  const del = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?')
  const txn = db.transaction(() => { for (const id of ids) del.run(id, req.userId) })
  txn()

  res.json({ success: true })
})

export default router
