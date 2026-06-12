import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../context/AuthContext'

const MILESTONES = [
  { days: 3, emoji: '🥉', label: 'Bronze Climber' },
  { days: 7, emoji: '🥈', label: 'Silver Summit' },
  { days: 14, emoji: '🥇', label: 'Golden Peak' },
  { days: 30, emoji: '🏆', label: 'Glacier Legend' },
  { days: 100, emoji: '👑', label: 'Mountain King' },
]

function getToday() { return new Date().toISOString().split('T')[0] }

function isYesterday(d) {
  const y = new Date(); y.setDate(y.getDate() - 1)
  return d === y.toISOString().split('T')[0]
}

export function useStreak(todos) {
  const { token } = useAuth()
  const [streakDates, setStreakDates] = useState([])
  const [freezeFlash, setFreezeFlash] = useState(false)
  const prevCompletedToday = useRef(false)

  useEffect(() => {
    if (!token) return
    fetch('/api/todos', { headers: { Authorization: 'Bearer ' + token } })
      .then(r => r.json())
      .then(data => setStreakDates(data.streakDates || []))
      .catch(() => {})
  }, [token])

  useEffect(() => {
    const today = getToday()
    const completedToday = todos.some(t => t.completed && t.completedAt === today)
    const hadDate = streakDates.includes(today)

    if (completedToday && !hadDate) {
      setStreakDates(prev => [...prev, today])
    } else if (!completedToday && hadDate) {
      setStreakDates(prev => prev.filter(d => d !== today))
    }
  }, [todos])

  const sorted = [...streakDates].sort()
  let streak = 0
  if (sorted.length > 0) {
    const last = sorted[sorted.length - 1]
    if (last === getToday() || isYesterday(last)) {
      streak = 1
      for (let i = sorted.length - 2; i >= 0; i--) {
        const cur = new Date(sorted[i] + 'T00:00:00')
        const next = new Date(sorted[i + 1] + 'T00:00:00')
        const diff = (next - cur) / (1000 * 60 * 60 * 24)
        if (diff === 1) streak++
        else break
      }
    }
  }

  const milestone = [...MILESTONES].reverse().find(m => streak >= m.days)

  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (new Date().getDay() - i))
    return {
      label: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i],
      isToday: i === new Date().getDay(),
      active: streakDates.includes(d.toISOString().split('T')[0]),
    }
  })

  return { streak: { count: streak }, freezeFlash, weekDays, milestone, MILESTONES }
}
