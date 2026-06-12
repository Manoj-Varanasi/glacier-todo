import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'glacier-todo-secret-change-in-production'

export { JWT_SECRET }

export default function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'No token provided' })
  }
  try {
    const decoded = jwt.verify(header.split(' ')[1], JWT_SECRET)
    req.userId = decoded.id
    next()
  } catch {
    res.status(401).json({ error: 'Invalid token' })
  }
}
