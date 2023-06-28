const User = require('../models/user');
const { ERROR_BAD_DATA, ERROR_NOT_FOUND, ERROR_DEFAULT } = require('../utils/errors');

module.exports.getAllUsers = (req, res) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(() => res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' }));
};

module.exports.getUserById = (req, res) => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  const userId = req.user._id;
  User.findByIdAndUpdate(
    userId,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: true,
    },
  )
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) res.send({ data: user });
      else res.status(ERROR_NOT_FOUND).send({ message: 'Пользователь не найден' });
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        res.status(ERROR_BAD_DATA).send({ message: 'Переданы некорректные данные пользователя.' });
      } else {
        res.status(ERROR_DEFAULT).send({ message: 'Произошла ошибка' });
      }
    });
};