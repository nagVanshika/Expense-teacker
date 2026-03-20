const express = require('express');
const authController = require('../../controllers/auth.controller');

const router = express.Router();

router.post('/login', authController.login);
router.post('/seed', authController.seedAdmins); // Should be disabled in production

module.exports = router;
