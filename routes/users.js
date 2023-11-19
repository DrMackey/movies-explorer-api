const router = require('express').Router();

const { getUser, patchMe, deleteCookie } = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validate');

router.get('/users/me', getUser);
router.patch('/users/me', validateUserUpdate, patchMe);
router.get('/signout', deleteCookie);

module.exports = router;
