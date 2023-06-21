const {
  PORT = 3000,
  NODE_ENV,
  JWT_SECRET,
  DB_URL,
} = process.env;
const JWT_CHECK = (NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret');
const DATABASE_URL = (NODE_ENV === 'production' ? DB_URL : 'mongodb://127.0.0.1:27017/moviesdb');

const allowedCors = [
  'http://diploma.petrov.nomoredomains.work',
  'https://diploma.petrov.nomoredomains.work',
  'localhost:3000',
];

const corsOptions = {
  origin: allowedCors,
  credentials: true,
};

module.exports = {
  corsOptions,
  PORT,
  DATABASE_URL,
  JWT_CHECK,
};
