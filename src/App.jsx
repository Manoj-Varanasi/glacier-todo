import { useState } from 'react'
import { useTodos } from './hooks/useTodos'
import { useStreak } from './hooks/useStreak'
import { SnowCanvas } from './components/SnowCanvas'
import { StreakHeader } from './components/StreakHeader'
import { TodoForm } from './components/TodoForm'
import { Filters } from './components/Filters'
import { TodoList } from './components/TodoList'
import './App.css'

function Mountains() {
  const peaks = [
    { cls: 'mountain-1', left: '-5%', bw: '0 25vw 42vh 18vw', bc: '#1a3050', sw: '0 5vw 8vh 8vw', sc: '#f0f8ff', top: '-42vh', leftOff: '18vw' },
    { cls: 'mountain-2', left: '15%', bw: '0 30vw 50vh 22vw', bc: '#243b5e', sw: '0 6vw 10vh 10vw', sc: '#e8f4ff', top: '-50vh', leftOff: '22vw' },
    { cls: 'mountain-3', left: '35%', bw: '0 22vw 38vh 16vw', bc: '#1f3658', sw: '0 4vw 7vh 7vw', sc: '#f5faff', top: '-38vh', leftOff: '16vw' },
    { cls: 'mountain-4', left: '55%', bw: '0 28vw 48vh 20vw', bc: '#2a4365', sw: '0 5vw 9vh 9vw', sc: '#e0f0ff', top: '-48vh', leftOff: '20vw' },
    { cls: 'mountain-5', left: '72%', bw: '0 20vw 35vh 15vw', bc: '#1c3252', sw: '0 3vw 6vh 6vw', sc: '#f8fcff', top: '-35vh', leftOff: '15vw' },
    { cls: 'mountain-6', left: '85%', bw: '0 24vw 40vh 18vw', bc: '#253d60', sw: '0 4vw 7vh 7vw', sc: '#ecf5ff', top: '-40vh', leftOff: '18vw' },
  ]
  return (
    <div className="mountains">
      {peaks.map((p, i) => (
        <div key={i} className={`mountain ${p.cls}`} style={{
          position: 'absolute', bottom: 0, width: 0, height: 0,
          borderStyle: 'solid', left: p.left,
          borderWidth: p.bw, borderColor: p.bc,
        }}>
          <div className="snowcap" style={{
            position: 'absolute', top: p.top, left: p.leftOff, width: 0, height: 0,
            borderStyle: 'solid', borderWidth: p.sw, borderColor: p.sc,
            transform: 'translateX(-50%)',
          }} />
        </div>
      ))}
    </div>
  )
}

export default function App() {
  const { todos, addTodo, toggleTodo, deleteTodo, stats } = useTodos()
  const { streak, freezeFlash, weekDays } = useStreak(todos)
  const [filter, setFilter] = useState('all')

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
        <StreakHeader streak={streak} weekDays={weekDays} />

        <div className="stats">
          <span>Total: <strong>{stats.total}</strong></span>
          <span>Completed: <strong>{stats.completed}</strong></span>
          <span>Pending: <strong>{stats.pending}</strong></span>
        </div>

        <TodoForm onAdd={addTodo} />

        <Filters current={filter} onChange={setFilter} />

        <TodoList
          todos={todos}
          filter={filter}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
        />
      </div>
    </>
  )
}
