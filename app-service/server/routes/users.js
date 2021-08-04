const express = require('express');
const router = express.Router();
const config = require('../config');
const mongoService = require('../services/mongoService');

router.post("/register", async (req, res) => {

  //TODO check if email is taken
  const user = {
    name: req.body.name,
    userName: req.body.userName || req.body.name,
    email: req.body.email,
    password: req.body.password,
  };

  try {
    await mongoService.addUser(user);
    res.status(200).send({ message: "User was registered successfully!" });
  } catch (err) {
    res.status(500).send({ message: err });
  }

});

router.post("/login", async (req, res) => {

  let { email, password } = req.body;

  const user = {
    email: req.body.email,
    password: req.body.password,
  };

  try {

    const userLogin = await mongoService.login(user);
    console.log(userLogin)
    res.status(200).send(userLogin);

  } catch (e) {
    console.log(e)
    res.status(500).send({ message: err });
  }

})

module.exports = router;