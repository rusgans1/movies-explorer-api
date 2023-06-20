const rateLimiter = require('express-rate-limit');

const limiter = rateLimiter({
  max: 50,
  windowMS: 10000, // 10 seconds
  message: "'В данный момент вы больше не можете делать никаких запросов. Попробуйте еще раз позже",
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { limiter };
