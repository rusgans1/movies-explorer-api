const { SERVER_ERROR_MESSAGE, SERVER_ERROR } = require('../utils/constans');

const errorHandler = (err, req, res, next) => {
  const { statusCode = SERVER_ERROR, message } = err;

  res
    .status(statusCode)
    .send({
      message: statusCode === SERVER_ERROR
        ? SERVER_ERROR_MESSAGE
        : message,
    });

  next();
};

module.exports = { errorHandler };
