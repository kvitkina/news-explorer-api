const router = require('express').Router();
const { getUserInfo } = require('../controllers/users');

router.get('/users/me', getUserInfo);

module.exports = router;
