const FILTERS = ['all', 'pending', 'completed']

export function Filters({ current, onChange }) {
  return (
    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.2rem', justifyContent: 'center' }}>
      {FILTERS.map(f => (
        <button
          key={f}
          onClick={() => onChange(f)}
          style={{
            padding: '0.4rem 1rem',
            background: current === f ? 'rgba(100,200,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: current === f ? '1px solid rgba(100,200,255,0.3)' : '1px solid rgba(168,216,234,0.1)',
            borderRadius: 20, color: current === f ? '#e0f0ff' : 'rgba(168,216,234,0.6)',
            fontSize: '0.8rem', cursor: 'pointer', textTransform: 'capitalize',
            transition: 'all 0.3s ease',
          }}
        >
          {f}
        </button>
      ))}
    </div>
  )
}
