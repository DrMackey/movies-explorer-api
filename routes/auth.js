const router = require('express').Router();

const {
  validateCreateUser,
  validateLogin,
} = require('../middlewares/validate');
const { createUser, login } = require('../controllers/users');

router.post('/signin', validateLogin, login);
router.post('/signup', validateCreateUser, createUser);

module.exports = router;
