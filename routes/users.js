const router = require('express').Router();

const { getUser, patchMe, deleteCookie } = require('../controllers/users');
const { validateUserUpdate } = require('../middlewares/validate');

router.get('/me', getUser);
router.patch('/me', validateUserUpdate, patchMe);
router.get('/me/exit', deleteCookie);

module.exports = router;
