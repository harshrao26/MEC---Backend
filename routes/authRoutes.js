const router = require('express').Router();
const authControllers = require('../controllers/authControllers.js');
const { authMiddleware } = require('../middlewares/authMiddleware.js');

router.post('/admin-login', authControllers.admin_login);
router.get('/get-user', authMiddleware, authControllers.getUser);

module.exports =  router; 
