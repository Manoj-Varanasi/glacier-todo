export function StreakHeader({ streak, weekDays }) {
  return (
    <div style={{
      textAlign: 'center', marginBottom: '2.5rem', padding: '1.5rem',
      background: 'linear-gradient(135deg, rgba(44,74,110,0.4), rgba(107,158,196,0.2))',
      borderRadius: 20, backdropFilter: 'blur(12px)',
      border: '1px solid rgba(168,216,234,0.15)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '0.5rem' }}>
        <span style={{
          fontSize: '2.5rem', lineHeight: 1,
          filter: 'drop-shadow(0 0 8px rgba(100,200,255,0.6))',
          animation: 'icePulse 2s ease-in-out infinite',
        }}>
          ❄️
        </span>
        <span style={{
          fontSize: '3.5rem', fontWeight: 800,
          background: 'linear-gradient(135deg, #a8d8ea, #e0f0ff, #ffffff)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
          backgroundClip: 'text', lineHeight: 1,
        }}>
          {streak.count}
        </span>
      </div>
      <div style={{
        fontSize: '1rem', color: '#a8d8ea', letterSpacing: 2,
        textTransform: 'uppercase', fontWeight: 300,
      }}>
        Day Streak
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: '1rem' }}>
        {weekDays.map((d, i) => (
          <div key={i} style={{
            width: 32, height: 32, borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '0.6rem', color: d.active ? '#e8f4f8' : 'rgba(255,255,255,0.2)',
            background: d.active
              ? 'linear-gradient(135deg, rgba(100,200,255,0.3), rgba(0,136,255,0.2))'
              : 'rgba(255,255,255,0.05)',
            border: d.isToday
              ? '1px solid rgba(168,216,234,0.5)'
              : d.active
                ? '1px solid rgba(100,200,255,0.4)'
                : '1px solid rgba(168,216,234,0.1)',
            boxShadow: d.active ? '0 0 12px rgba(100,200,255,0.2)' : 'none',
            transition: 'all 0.4s ease',
          }}>
            {d.label[0]}
          </div>
        ))}
      </div>
    </div>
  )
}
