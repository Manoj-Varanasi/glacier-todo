import { useEffect, useRef } from 'react'

export function SnowCanvas() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let flakes = []
    let id

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 120; i++) {
      flakes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 1,
        speed: Math.random() * 1 + 0.3,
        wind: Math.random() * 0.5 - 0.25,
        opacity: Math.random() * 0.6 + 0.2,
      })
    }

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      for (const f of flakes) {
        ctx.beginPath()
        ctx.arc(f.x, f.y, f.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${f.opacity})`
        ctx.fill()
        f.y += f.speed
        f.x += f.wind
        if (f.y > canvas.height) { f.y = -f.r; f.x = Math.random() * canvas.width }
        if (f.x > canvas.width) f.x = 0
        if (f.x < 0) f.x = canvas.width
      }
      id = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(id)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas ref={canvasRef} style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 0,
    }} />
  )
}
