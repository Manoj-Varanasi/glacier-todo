import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import { useTodos } from './hooks/useTodos'
import { useStreak } from './hooks/useStreak'
import { SnowCanvas } from './components/SnowCanvas'
import { StreakHeader } from './components/StreakHeader'
import { TodoForm } from './components/TodoForm'
import { Filters } from './components/Filters'
import { TodoList } from './components/TodoList'
import Login from './pages/Login'
import Register from './pages/Register'
import './App.css'

function Mountains() {
  const peaks = [
    { left: '-5%', bw: '0 25vw 42vh 18vw', bc: '#1a3050', sw: '0 5vw 8vh 8vw', sc: '#f0f8ff', top: '-42vh', lo: '18vw' },
    { left: '15%', bw: '0 30vw 50vh 22vw', bc: '#243b5e', sw: '0 6vw 10vh 10vw', sc: '#e8f4ff', top: '-50vh', lo: '22vw' },
    { left: '35%', bw: '0 22vw 38vh 16vw', bc: '#1f3658', sw: '0 4vw 7vh 7vw', sc: '#f5faff', top: '-38vh', lo: '16vw' },
    { left: '55%', bw: '0 28vw 48vh 20vw', bc: '#2a4365', sw: '0 5vw 9vh 9vw', sc: '#e0f0ff', top: '-48vh', lo: '20vw' },
    { left: '72%', bw: '0 20vw 35vh 15vw', bc: '#1c3252', sw: '0 3vw 6vh 6vw', sc: '#f8fcff', top: '-35vh', lo: '15vw' },
    { left: '85%', bw: '0 24vw 40vh 18vw', bc: '#253d60', sw: '0 4vw 7vh 7vw', sc: '#ecf5ff', top: '-40vh', lo: '18vw' },
  ]
  return (
    <div className="mountains">
      {peaks.map((p, i) => (
        <div key={i} className="mountain" style={{
          position: 'absolute', bottom: 0, width: 0, height: 0,
          borderStyle: 'solid', left: p.left,
          borderWidth: p.bw, borderColor: p.bc,
        }}>
          <div style={{
            position: 'absolute', top: p.top, left: p.lo, width: 0, height: 0,
            borderStyle: 'solid', borderWidth: p.sw, borderColor: p.sc,
            transform: 'translateX(-50%)',
          }} />
        </div>
      ))}
    </div>
  )
}

function Dashboard() {
  const { user, logout } = useAuth()
  const { todos, addTodo, toggleTodo, editTodo, deleteTodo, clearCompleted, stats, totalCompleted } = useTodos()
  const { streak, freezeFlash, weekDays, milestone } = useStreak(todos)
  const [filter, setFilter] = useState('all')
  const pct = stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0

  return (
    <>
      <SnowCanvas />
      <div className="aurora">
        <div className="aurora-band" />
        <div className="aurora-band" />
        <div className="aurora-band" />
      </div>
      <div className="glacier-glow" />
      <Mountains />
      <div className={`freeze-flash ${freezeFlash ? 'active' : ''}`} />

      <div className="app-container">
        <div className="user-bar">
          <span>🧗 {user?.name}</span>
          <button onClick={logout} className="logout-btn">Sign Out</button>
        </div>

        <StreakHeader streak={streak} weekDays={weekDays} milestone={milestone} />

        <div className="summit-row">
          <span>🏔️ <strong>{totalCompleted}</strong> summits conquered</span>
        </div>

        {stats.total > 0 && (
          <div className="progress-wrap">
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${pct}%` }} />
              <div className="progress-glow" style={{ width: `${pct}%` }} />
            </div>
            <span className="progress-label">{pct}%</span>
          </div>
        )}

        <div className="stats">
          <span>Total: <strong>{stats.total}</strong></span>
          <span>Completed: <strong>{stats.completed}</strong></span>
          <span>Pending: <strong>{stats.pending}</strong></span>
        </div>

        <TodoForm onAdd={addTodo} />

        {stats.completed > 0 && (
          <div style={{ textAlign: 'center', marginBottom: '0.8rem' }}>
            <button onClick={clearCompleted} className="clear-btn">
              ❄️ Clear {stats.completed} completed
            </button>
          </div>
        )}

        <Filters current={filter} onChange={setFilter} />

        <TodoList
          todos={todos}
          filter={filter}
          onToggle={toggleTodo}
          onEdit={editTodo}
          onDelete={deleteTodo}
        />
      </div>
    </>
  )
}

export default function App() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="auth-page">
        <div className="auth-card" style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏔️</div>
          <p style={{ color: 'rgba(168,216,234,0.6)' }}>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register />} />
      <Route path="/" element={user ? <Dashboard /> : <Navigate to="/login" />} />
    </Routes>
  )
}
