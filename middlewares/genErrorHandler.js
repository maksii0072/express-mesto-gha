const { ERROR_DEFAULT } = require('../utils/errors');

// eslint-disable-next-line consistent-return
function genErrorHandler(err, req, res, next) {
  if (err.statusCode) {
    res.status(err.statusCode).send({ message: err.message });
  } else {
    res.status(ERROR_DEFAULT).send({ message: `Произошла ошибка: ${err.message}` });
    return next();
  }
}

module.exports = genErrorHandler;
