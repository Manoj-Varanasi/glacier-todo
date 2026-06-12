import { useState, useCallback, useEffect, useRef } from 'react'

const STORAGE_KEY = 'glacierStreak'

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function isYesterday(dateStr) {
  const d = new Date(dateStr + 'T00:00:00')
  const y = new Date()
  y.setDate(y.getDate() - 1)
  return d.toISOString().split('T')[0] === y.toISOString().split('T')[0]
}

function loadStreak() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { count: 0, lastDate: null, dates: {} }
  } catch {
    return { count: 0, lastDate: null, dates: {} }
  }
}

export function useStreak(todos) {
  const [streak, setStreak] = useState(loadStreak)
  const [freezeFlash, setFreezeFlash] = useState(false)
  const prevCompletedToday = useRef(false)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(streak))
  }, [streak])

  useEffect(() => {
    const today = getToday()
    const completedToday = todos.some(t => t.completed && t.completedAt === today)

    if (completedToday && !prevCompletedToday.current) {
      setStreak(prev => {
        const dates = { ...prev.dates, [today]: true }
        let count = prev.count
        if (prev.lastDate === null || isYesterday(prev.lastDate)) {
          count++
          setFreezeFlash(true)
          setTimeout(() => setFreezeFlash(false), 800)
        } else if (prev.lastDate !== today) {
          count = 1
          Object.keys(dates).forEach(k => { if (k !== today) delete dates[k] })
        }
        return { count, lastDate: today, dates }
      })
    } else if (!completedToday && prevCompletedToday.current) {
      setStreak(prev => {
        const dates = { ...prev.dates }
        delete dates[today]
        const count = Math.max(0, prev.count - 1)
        return { count, lastDate: count === 0 ? null : prev.lastDate, dates }
      })
    }

    prevCompletedToday.current = completedToday
  }, [todos])

  const weekDays = [...Array(7)].map((_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (new Date().getDay() - i))
    const key = d.toISOString().split('T')[0]
    return {
      label: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][i],
      isToday: i === new Date().getDay(),
      active: !!streak.dates[key],
    }
  })

  return { streak, freezeFlash, weekDays }
}
