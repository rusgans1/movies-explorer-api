require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/rate-limiter');
const { loginUser, createUser, signOutUser } = require('./controller/users');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUserValidation, loginValidation } = require('./middlewares/validation');
const { DATABASE_URL, PORT, corsOptions } = require('./utils/config');
const userRoute = require('./routes/users');
const movieRoute = require('./routes/movies');
const auth = require('./middlewares/auth');
const UnfindError = require('./errors/UnfindError');

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);

app.post('/signin', loginValidation, loginUser);
app.post('/signup', createUserValidation, createUser);
app.post('/signout', signOutUser);

app.use(auth);
app.use(userRoute);
app.use(movieRoute);

app.use('*', () => {
  throw new UnfindError('Указанный путь не существует.');
});
app.use(errorLogger);

app.use(errors());
app.use(((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(err.statusCode)
    .send({
      message: statusCode === 500
        ? 'Ошибка сервера'
        : message,
    });
  next();
}));

mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL);
// eslint-disable-next-line no-console
app.listen(PORT, () => console.log('Сервер запущен'));
