const jwt = require('jsonwebtoken');
const {
  connectFirebaseAdmin,
  getUserByUid,
  getUserByEmail,
  createUser,
  signInWithPassword
} = require('../config/firebase-admin');
const logger = require('../utils/logger');

// Ensure Firebase Admin is connected (used for registration)
connectFirebaseAdmin();


const register = async (req, res) => {
  const { email, password, displayName } = req.body;

  try {
    let user;

    try {
      // Check if user exists
      user = await getUserByEmail(email);

      return res.status(400).json({
        success: false,
        error: "User already exists"
      });

    } catch (err) {
      // ✅ If user NOT found → this is GOOD (continue)
      if (err.code !== 'auth/user-not-found') {
        throw err;
      }
    }

    // ✅ Create new user
    const newUser = await createUser({ email, password, displayName });

    return res.status(201).json({
      success: true,
      data: newUser
    });

  } catch (error) {
    console.error("Register error:", error.message);

    return res.status(500).json({
      success: false,
      error: error.message
    });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    let signInData;
    try {
      signInData = await signInWithPassword({ email, password });
    } catch (error) {
      if (error.code === 400 || error.message.includes('INVALID_PASSWORD') || error.message.includes('EMAIL_NOT_FOUND') || error.message.includes('INVALID_EMAIL')) {
        return res.status(401).json({ success: false, error: 'Invalid credentials' });
      }
      throw error;
    }

    const token = jwt.sign(
      { uid: signInData.localId, email: signInData.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    logger.info(`User login: ${email}`);

    res.json({
      success: true,
      data: {
        user: {
          uid: signInData.localId,
          email: signInData.email
        },
        token
      }
    });
  } catch (error) {
    logger.error('Login error:', error);
    next(error);
  }
};

const logout = (req, res) => {
  logger.info(`User logout: ${req.user?.email}`);
  res.json({ success: true, message: 'Logged out successfully' });
};

const refresh = (req, res, next) => {
  try {
    const token = jwt.sign(
      { uid: req.user.uid, email: req.user.email },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    res.json({ success: true, data: { token } });
  } catch (error) {
    next(error);
  }
};

const me = async (req, res, next) => {
  try {
    const user = await getUserByUid(req.user.uid);

    res.json({
      success: true,
      data: {
        user: {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          createdAt: user.metadata.creationTime
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout, refresh, me };
