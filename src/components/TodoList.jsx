import { useState, useMemo, useRef, useEffect } from 'react'

function escapeHtml(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

function TodoItem({ todo, onToggle, onEdit, onDelete }) {
  const [editing, setEditing] = useState(false)
  const [editText, setEditText] = useState(todo.text)
  const inputRef = useRef(null)

  useEffect(() => { if (editing) inputRef.current?.focus() }, [editing])

  function saveEdit() {
    const val = editText.trim()
    if (val && val !== todo.text) onEdit(todo.id, val)
    else setEditText(todo.text)
    setEditing(false)
  }

  return (
    <li
      className={`todo-item ${todo.completed ? 'completed' : ''}`}
      style={{
        display: 'flex', alignItems: 'center', gap: '0.8rem',
        padding: '0.9rem 1rem',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
        border: '1px solid rgba(168,216,234,0.08)',
        borderRadius: 14, opacity: todo.completed ? 0.5 : 1,
        transition: 'all 0.3s ease', backdropFilter: 'blur(4px)',
        animation: 'todoSlideIn 0.3s ease',
      }}
      onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255,255,255,0.07), rgba(255,255,255,0.02))'; e.currentTarget.style.borderColor = 'rgba(168,216,234,0.15)'; e.currentTarget.style.transform = 'translateX(2px)' }}
      onMouseLeave={e => { e.currentTarget.style.background = ''; e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = '' }}
    >
      <label className="checkbox-wrap" style={{
        width: 22, height: 22, flexShrink: 0, cursor: 'pointer',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <input type="checkbox" checked={todo.completed} onChange={() => onToggle(todo.id)}
          className="todo-checkbox"
          style={{ width: '100%', height: '100%', cursor: 'pointer', opacity: 0, position: 'absolute', margin: 0 }}
        />
        <span className={`checkmark ${todo.completed ? 'checked' : ''}`} style={{
          width: '100%', height: '100%', borderRadius: '50%',
          border: `2px solid ${todo.completed ? '#4a9ed4' : 'rgba(168,216,234,0.3)'}`,
          background: todo.completed ? 'linear-gradient(135deg, #4a9ed4, #2c6e9e)' : 'transparent',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.3s ease',
          boxShadow: todo.completed ? '0 0 12px rgba(74,158,212,0.3)' : 'none',
          fontSize: '0.7rem', color: 'white', fontWeight: 'bold',
        }}>
          {todo.completed ? '\u2713' : ''}
        </span>
      </label>

      {editing ? (
        <input
          ref={inputRef}
          value={editText}
          onChange={e => setEditText(e.target.value)}
          onBlur={saveEdit}
          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') { setEditText(todo.text); setEditing(false) } }}
          className="edit-input"
          style={{
            flex: 1, fontSize: '0.95rem', padding: '0.3rem 0.5rem',
            background: 'rgba(255,255,255,0.08)',
            border: '1px solid rgba(100,200,255,0.4)',
            borderRadius: 8, color: '#e8f4f8', outline: 'none',
          }}
        />
      ) : (
        <span
          onDoubleClick={() => { if (!todo.completed) setEditing(true) }}
          style={{
            flex: 1, fontSize: '0.95rem', color: '#e8f4f8', wordBreak: 'break-word',
            textDecoration: todo.completed ? 'line-through' : 'none',
            cursor: todo.completed ? 'default' : 'pointer',
          }}
          title={todo.completed ? '' : 'Double-click to edit'}
        >
          {escapeHtml(todo.text)}
        </span>
      )}

      <span className="todo-date" style={{ fontSize: '0.65rem', color: 'rgba(168,216,234,0.3)', flexShrink: 0 }}>
        {new Date(todo.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
      </span>
      <button onClick={() => onDelete(todo.id)} className="todo-delete" style={{
        background: 'none', border: 'none', color: 'rgba(168,216,234,0.3)',
        cursor: 'pointer', fontSize: '1.1rem', padding: '0.2rem',
        transition: 'all 0.3s ease', lineHeight: 1, opacity: 0,
      }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ff6b6b'; e.currentTarget.style.transform = 'scale(1.2)' }}
        onMouseLeave={e => { e.currentTarget.style.color = ''; e.currentTarget.style.transform = '' }}
      >
        ✕
      </button>
    </li>
  )
}

export function TodoList({ todos, filter, onToggle, onEdit, onDelete }) {
  const filtered = useMemo(() => {
    if (filter === 'pending') return todos.filter(t => !t.completed)
    if (filter === 'completed') return todos.filter(t => t.completed)
    return todos
  }, [todos, filter])

  if (filtered.length === 0) {
    const messages = {
      all: ['🏔️', 'No tasks yet. Add your first summit!'],
      pending: ['⛰️', 'All peaks conquered! Nothing pending.'],
      completed: ['❄️', 'No completed summits yet. Start climbing!'],
    }
    const [icon, msg] = messages[filter] || messages.all
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(168,216,234,0.4)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>{icon}</div>
        <p style={{ fontSize: '0.9rem' }}>{msg}</p>
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {filtered.map(t => (
        <TodoItem key={t.id} todo={t} onToggle={onToggle} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  )
}
