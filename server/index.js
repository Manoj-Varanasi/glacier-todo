import express from 'express'
import cors from 'cors'
import authRoutes from './routes/auth.js'
import todoRoutes from './routes/todos.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)

app.get('/api/health', (_, res) => res.json({ status: 'ok' }))

app.listen(PORT, () => {
  console.log(`Glacier server running on http://localhost:${PORT}`)
})
