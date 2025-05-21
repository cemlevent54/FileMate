const jwt = require('jsonwebtoken');

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Lütfen giriş yapın' });
    }

    const token = authHeader.split(' ')[1];
    const secret = process.env.JWT_SECRET || 'SECRET_KEY';

    const decoded = jwt.verify(token, secret);
    req.user = decoded;

    next();
  } catch (error) {
    console.error('Auth Error:', error.message);
    return res.status(401).json({ message: 'Lütfen giriş yapın' });
  }
};

module.exports = auth;
