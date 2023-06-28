const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { PORT = 3000 } = process.env;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '643e55f1be77c29a704154c4', //  _id созданного пользователя
  };
  next();
});
app.use(userRouter);
app.use(cardRouter);

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.listen(PORT);