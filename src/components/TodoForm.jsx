import { useState } from 'react'

export function TodoForm({ onAdd }) {
  const [text, setText] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const val = text.trim()
    if (!val) return
    onAdd(val)
    setText('')
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
      <input
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Add a new task..."
        autoComplete="off"
        style={{
          flex: 1, padding: '0.9rem 1.2rem',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(168,216,234,0.15)',
          borderRadius: 14, color: '#e8f4f8', fontSize: '1rem',
          outline: 'none', backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease',
        }}
        onFocus={e => { e.target.style.borderColor = 'rgba(100,200,255,0.5)'; e.target.style.background = 'rgba(255,255,255,0.1)'; e.target.style.boxShadow = '0 0 20px rgba(100,200,255,0.1)' }}
        onBlur={e => { e.target.style.borderColor = 'rgba(168,216,234,0.15)'; e.target.style.background = 'rgba(255,255,255,0.06)'; e.target.style.boxShadow = 'none' }}
      />
      <button type="submit" style={{
        padding: '0.9rem 1.3rem',
        background: 'linear-gradient(135deg, #2c6e9e, #4a9ed4)',
        border: 'none', borderRadius: 14, color: 'white',
        fontSize: '1.2rem', cursor: 'pointer',
        transition: 'all 0.3s ease', whiteSpace: 'nowrap',
      }}
        onMouseEnter={e => { e.target.style.transform = 'translateY(-2px)'; e.target.style.boxShadow = '0 6px 20px rgba(74,158,212,0.4)' }}
        onMouseLeave={e => { e.target.style.transform = ''; e.target.style.boxShadow = '' }}
      >
        +
      </button>
    </form>
  )
}
