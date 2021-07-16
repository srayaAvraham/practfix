const express = require('express');
const app = express();
const cors = require("cors");
const mongoose = require('mongoose');
const logger = require('morgan');
const port = process.env.PORT || 5000;
const uploadRouter = require('./routes/upload');
const usersRouter = require('./routes/users');
const videosRouter = require('./routes/videos');

require('./services/db');
let corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));
app.use(logger('dev'));
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.get('/', (req, res) => {
  res.json({ 'message': 'ok' });
})

app.use('/api/users', usersRouter);
app.use('/api/media', videosRouter);
app.use('/upload', uploadRouter);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ 'message': err.message });
  return;
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
});