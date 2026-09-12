const express = require('express');
const { register, login, getMe, updateProfile, changePassword, googleLogin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/change-password', protect, changePassword);
router.post('/google', googleLogin);

// ── Test email route (temporary - for debugging SMTP) ─────────────────────────
router.get('/test-email', async (req, res) => {
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM } = process.env;
  const config = {
    EMAIL_HOST: EMAIL_HOST || 'NOT SET',
    EMAIL_PORT: EMAIL_PORT || 'NOT SET',
    EMAIL_USER: EMAIL_USER || 'NOT SET',
    EMAIL_PASS: EMAIL_PASS ? `SET (${EMAIL_PASS.length} chars)` : 'NOT SET',
    EMAIL_FROM: EMAIL_FROM || 'NOT SET',
  };

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({ success: false, message: 'Email not configured', config });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: parseInt(EMAIL_PORT || '587', 10),
      secure: false,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    });

    await transporter.verify();
    await transporter.sendMail({
      from: `"${EMAIL_FROM || 'Royal Zone'}" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: '✅ Royal Zone - Email Test',
      html: '<h2>Email is working!</h2><p>Your SMTP configuration is correct.</p>',
    });

    res.json({ success: true, message: `Test email sent to ${EMAIL_USER}`, config });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message, config });
  }
});

module.exports = router;
