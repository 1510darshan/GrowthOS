const jwt = require('jsonwebtoken');
const { verifyFirebaseToken } = require('../config/firebase-admin');
const logger = require('../utils/logger');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, error: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];
    let decoded;
    let userType = 'jwt';

    // Try Firebase token first (for Firebase Auth users)
    try {
      decoded = await verifyFirebaseToken(token);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        type: 'firebase'
      };
      userType = 'firebase';
      return next();
    } catch (firebaseError) {
      // Not a Firebase token, try JWT
    }

    // JWT fallback
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = {
        uid: decoded.uid,
        email: decoded.email,
        type: 'jwt'
      };
      return next();
    } catch (jwtError) {
      return res.status(401).json({ success: false, error: 'Invalid token' });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(401).json({ success: false, error: 'Authentication failed' });
  }
};

module.exports = authMiddleware;
