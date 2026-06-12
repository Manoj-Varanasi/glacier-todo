import { useState, useCallback, useEffect } from 'react'

const TODOS_KEY = 'glacierTodos'
const STATS_KEY = 'glacierLifetimeStats'

function loadTodos() {
  try { return JSON.parse(localStorage.getItem(TODOS_KEY)) || [] } catch { return [] }
}

function loadLifetime() {
  try { return JSON.parse(localStorage.getItem(STATS_KEY)) || 0 } catch { return 0 }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)
  const [totalCompleted, setTotalCompleted] = useState(loadLifetime)

  useEffect(() => { localStorage.setItem(TODOS_KEY, JSON.stringify(todos)) }, [todos])
  useEffect(() => { localStorage.setItem(STATS_KEY, JSON.stringify(totalCompleted)) }, [totalCompleted])

  const addTodo = useCallback((text) => {
    setTodos(prev => [{
      id: Date.now() + Math.random(),
      text: text.trim(),
      completed: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
    }, ...prev])
  }, [])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => {
      if (t.id !== id) return t
      const wasCompleted = t.completed
      const now = new Date().toISOString().split('T')[0]
      if (!wasCompleted) setTotalCompleted(p => p + 1)
      return { ...t, completed: !wasCompleted, completedAt: wasCompleted ? null : now }
    }))
  }, [])

  const editTodo = useCallback((id, text) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, text: text.trim() } : t))
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearCompleted = useCallback(() => {
    setTodos(prev => prev.filter(t => !t.completed))
  }, [])

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }

  return { todos, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted, stats, totalCompleted }
}
