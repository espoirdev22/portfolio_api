const jwt = require('jsonwebtoken')

const login = (req, res) => {
  const { password } = req.body

  // Mot de passe admin — change "admin123" par ton mot de passe
  if (password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      success: false,
      message: 'Mot de passe incorrect'
    })
  }

  // Génère un token valable 24h
  const token = jwt.sign(
    { role: 'admin' },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )

  res.json({
    success: true,
    token
  })
}

module.exports = { login }