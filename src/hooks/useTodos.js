import { useState, useCallback, useEffect } from 'react'

const STORAGE_KEY = 'glacierTodos'

function loadTodos() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []
  } catch {
    return []
  }
}

export function useTodos() {
  const [todos, setTodos] = useState(loadTodos)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }, [todos])

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
    setTodos(prev => prev.map(t =>
      t.id === id ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString().split('T')[0] : null } : t
    ))
  }, [])

  const deleteTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [])

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
  }

  return { todos, addTodo, toggleTodo, deleteTodo, stats }
}
