const jwt = require('jsonwebtoken');
const User = require('../models/User');

const isAdmin = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (user && user.accounttype === 'admin') {
      req.user = user;
      next(); // Admin නම් පමණක් ඉදිරියට යාමට ඉඩ දෙයි
    } else {
      res.status(403).json({ message: 'Access denied. Admins only.' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = { isAdmin };