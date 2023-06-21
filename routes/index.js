const router = require('express').Router();
const { loginUser, createUser, signOutUser } = require('../controller/users');
const { createUserValidation, loginValidation } = require('../middlewares/validation');
const auth = require('../middlewares/auth');
const userRoute = require('./users');
const movieRoute = require('./movies');
const UnfindError = require('../errors/UnfindError');
const { UNFIND_ERROR_MESSAGE } = require('../utils/constans');

router.post('/signin', loginValidation, loginUser);
router.post('/signup', createUserValidation, createUser);

router.use(auth);
router.use(userRoute);
router.use(movieRoute);

router.post('/signout', signOutUser);

router.use('/*', () => {
  throw new UnfindError(UNFIND_ERROR_MESSAGE);
});

module.exports = router;
