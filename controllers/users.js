const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { JWT_SECRET, NODE_ENV } = process.env;
const User = require('../models/user');
const NotFoundError = require('../error/NotFoundError');
const BadDataError = require('../error/BadDataError');
const ConflictError = require('../error/ConflictError');

const userDataUpdate = (req, res, updateData, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    updateData,
    {
      new: true,
      runValidators: true,
    },
  )
    .then((user) => {
      if (user) res.send({ data: user });
      else {
        next(new NotFoundError('Пользователь не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

const getUserData = (userData, req, res, next) => {
  User.findById(userData)
    .then((user) => {
      if (user) {
        res.send({ data: user });
      } else {
        next(new NotFoundError('Пользователь по указанному id не найден'));
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        next(new BadDataError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};

module.exports.getAllUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send({ data: users }))
    .catch(next);
};

module.exports.getUser = (req, res, next) => {
  getUserData(req.user._id, req, res, next);
};

module.exports.getUserById = (req, res, next) => {
  getUserData(req.params.userId, req, res, next);
};

module.exports.createUser = (req, res, next) => {
  const {
    name,
    about,
    avatar,
    email,
    password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    }))
    .then((user) => {
      const dataUser = user.toObject();
      delete dataUser.password;
      res.status(200).send(dataUser);
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        next(new BadDataError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ConflictError('Данный email уже зарегистрирован.'));
      } else {
        next(err);
      }
    });
};

module.exports.updateUser = (req, res) => {
  const { name, about } = req.body;
  userDataUpdate(req, res, { name, about });
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  userDataUpdate(req, res, { avatar });
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;
  User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
      res.cookie('jwt', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: 'Успешный вход' });
    })
    .catch(next);
};
