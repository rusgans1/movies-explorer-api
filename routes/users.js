const router = require('express').Router();
const { changeInfoValidation } = require('../middlewares/validation');
const { changeInfo, getInfo } = require('../controller/users');

router.get('/users/me', getInfo);

router.patch('/users/me', changeInfoValidation, changeInfo);

module.exports = router;
