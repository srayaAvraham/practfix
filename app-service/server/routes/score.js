const express = require('express');
const router = express.Router();
const score = require('../controllers/score');

router.get('/', async function (req, res, next) {
  try {
    res.json(await score.getScore());
  } catch (err) {
    console.error(`Error while getting score `, err.message);
    next(err);
  }
});

module.exports = router;