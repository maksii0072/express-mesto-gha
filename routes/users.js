const router = require('express').Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  updateAvatar,
} = require('../controllers/users');

router.get('/users', getAllUsers); // возвращает всех пользователей

router.get('/users/:userId', getUserById); // возвращает пользователя по _id

router.post('/users', createUser); // создаёт пользователя

router.patch('/users/me', updateUser); // обновляет профиль

router.patch('/users/me/avatar', updateAvatar); //  обновляет аватар

module.exports = router;
