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
  const EMAIL_HOST = process.env.EMAIL_HOST || 'smtp.gmail.com';
  const EMAIL_PORT = parseInt(process.env.EMAIL_PORT || '465', 10);
  const EMAIL_USER = process.env.EMAIL_USER;
  const EMAIL_PASS = process.env.EMAIL_PASS;
  const EMAIL_FROM = process.env.EMAIL_FROM || 'Royal Zone';

  const config = {
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER: EMAIL_USER || 'NOT SET',
    EMAIL_PASS: EMAIL_PASS ? `SET (${EMAIL_PASS.length} chars)` : 'NOT SET',
    EMAIL_FROM,
  };

  if (!EMAIL_USER || !EMAIL_PASS) {
    return res.status(500).json({ 
      success: false, 
      message: 'EMAIL_USER or EMAIL_PASS not set in Railway environment variables', 
      config 
    });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: EMAIL_PORT,
      secure: EMAIL_PORT === 465,
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
      connectionTimeout: 10000,
      greetingTimeout: 5000,
      socketTimeout: 10000,
    });

    await transporter.verify();
    await transporter.sendMail({
      from: `"${EMAIL_FROM}" <${EMAIL_USER}>`,
      to: EMAIL_USER,
      subject: '✅ Royal Zone - Email Test',
      html: '<h2>Email is working!</h2><p>Your SMTP configuration is correct.</p>',
    });

    return res.json({ success: true, message: `Test email sent successfully to ${EMAIL_USER}!`, config });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message, config });
  }
});

module.exports = router;
