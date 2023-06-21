require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const { limiter } = require('./middlewares/rate-limiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { DATABASE_URL, PORT, corsOptions } = require('./utils/config');
const { errorHandler } = require('./middlewares/errorHandler');
const routes = require('./routes');

const app = express();

app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(helmet());
app.use(cookieParser());

app.use(requestLogger);
app.use(limiter);
app.use(routes);

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

mongoose.set('strictQuery', false);
mongoose.connect(DATABASE_URL);

app.listen(PORT);
