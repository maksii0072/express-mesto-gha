// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
// eslint-disable-next-line import/no-extraneous-dependencies
const cookieParser = require('cookie-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
const rootRoute = require('./routes/index');
const genErrorHandler = require('./middlewares/genErrorHandler');
const limiter = require('./middlewares/limiter');

const { PORT = 3000 } = process.env;
const app = express();

// console.log(process.env.NODE_ENV);

// подключаемся к серверу mongo
mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(helmet());
app.use(limiter);
app.use('/', rootRoute);
app.use(errors());
app.use(genErrorHandler);

app.listen(PORT);
