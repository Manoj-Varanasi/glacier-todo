import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

const API = '/api/todos'

export function useTodos() {
  const { token } = useAuth()
  const [todos, setTodos] = useState([])
  const [totalCompleted, setTotalCompleted] = useState(0)
  const [loaded, setLoaded] = useState(false)

  const headers = { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }

  useEffect(() => {
    if (!token) return
    fetch(API, { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => {
        setTodos(data.todos)
        setTotalCompleted(data.totalCompleted)
        setLoaded(true)
      })
      .catch(() => setLoaded(true))
  }, [token])

  const addTodo = useCallback(async (text) => {
    const r = await fetch(API, { method: 'POST', headers, body: JSON.stringify({ text: text.trim() }) })
    if (!r.ok) return
    const t = await r.json()
    setTodos(prev => [{ ...t, completed: false }, ...prev])
  }, [token])

  const toggleTodo = useCallback(async (id) => {
    const todo = todos.find(t => t.id === id)
    if (!todo) return
    const next = !todo.completed
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: next, completed_at: next ? new Date().toISOString().split('T')[0] : null } : t))
    if (next) setTotalCompleted(p => p + 1)
    const r = await fetch(API + '/' + id, { method: 'PUT', headers, body: JSON.stringify({ completed: next }) })
    if (!r.ok && next) setTotalCompleted(p => p - 1)
  }, [token, todos])

  const editTodo = useCallback(async (id, text) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text } : t))
    await fetch(API + '/' + id, { method: 'PUT', headers, body: JSON.stringify({ text }) })
  }, [token])

  const deleteTodo = useCallback(async (id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
    await fetch(API + '/' + id, { method: 'DELETE', headers })
  }, [token])

  const clearCompleted = useCallback(async () => {
    const completed = todos.filter(t => t.completed)
    setTodos(prev => prev.filter(t => !t.completed))
    await fetch(API, { method: 'DELETE', headers, body: JSON.stringify({ ids: completed.map(t => t.id) }) })
  }, [token, todos])

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }

  return { todos, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted, stats, totalCompleted, loaded }
}
