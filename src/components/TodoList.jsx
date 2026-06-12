import { useMemo } from 'react'

function escapeHtml(str) {
  const d = document.createElement('div')
  d.textContent = str
  return d.innerHTML
}

export function TodoList({ todos, filter, onToggle, onDelete }) {
  const filtered = useMemo(() => {
    if (filter === 'pending') return todos.filter(t => !t.completed)
    if (filter === 'completed') return todos.filter(t => t.completed)
    return todos
  }, [todos, filter])

  if (filtered.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(168,216,234,0.4)' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.5 }}>🏔️</div>
        <p style={{ fontSize: '0.9rem' }}>No tasks yet. Add your first summit!</p>
      </div>
    )
  }

  return (
    <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
      {filtered.map(t => (
        <li
          key={t.id}
          className={`todo-item ${t.completed ? 'completed' : ''}`}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.8rem',
            padding: '0.9rem 1rem',
            background: 'linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))',
            border: '1px solid rgba(168,216,234,0.08)',
            borderRadius: 14, opacity: t.completed ? 0.5 : 1,
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
            <input
              type="checkbox"
              checked={t.completed}
              onChange={() => onToggle(t.id)}
              className="todo-checkbox"
              style={{
                width: '100%', height: '100%', cursor: 'pointer', opacity: 0,
                position: 'absolute', margin: 0,
              }}
            />
            <span className={`checkmark ${t.completed ? 'checked' : ''}`} style={{
              width: '100%', height: '100%', borderRadius: '50%',
              border: `2px solid ${t.completed ? '#4a9ed4' : 'rgba(168,216,234,0.3)'}`,
              background: t.completed ? 'linear-gradient(135deg, #4a9ed4, #2c6e9e)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.3s ease',
              boxShadow: t.completed ? '0 0 12px rgba(74,158,212,0.3)' : 'none',
              fontSize: '0.7rem', color: 'white', fontWeight: 'bold',
            }}>
              {t.completed ? '\u2713' : ''}
            </span>
          </label>
          <span style={{
            flex: 1, fontSize: '0.95rem', color: '#e8f4f8', wordBreak: 'break-word',
            textDecoration: t.completed ? 'line-through' : 'none',
          }}>
            {escapeHtml(t.text)}
          </span>
          <span className="todo-date" style={{ fontSize: '0.65rem', color: 'rgba(168,216,234,0.3)', flexShrink: 0 }}>
            {new Date(t.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
          </span>
          <button
            onClick={() => onDelete(t.id)}
            className="todo-delete"
            style={{
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
      ))}
    </ul>
  )
}
