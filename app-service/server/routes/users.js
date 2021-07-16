const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();
const config = require('../config');
const { User } = require("../models/User");
const mongoService = require('../services/mongoService');
const { auth } = require("../middleware/auth");

router.get("/auth", auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
  });
});

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

router.post("/login", (req, res) => {
  User.findOne({
    email: req.body.email,
  }).exec((err, user) => {
    if (err) {
      res.status(500).send({ message: err });
      return;
    }

    if (!user) {
      return res.status(404).send({ message: "User Not found." });
    }

    let passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) {
      return res.status(401).send({
        accessToken: null,
        message: "Invalid Password!",
      });
    }

    let token = jwt.sign({ id: user.id }, config.secret, {
      expiresIn: 86400,
    });

    res.status(200).send({
      id: user._id,
      name: user.name,
      email: user.email,
      accessToken: token,
    });
  });
})

// router.get("/logout", auth, (req, res) => {
//     User.findOneAndUpdate({ _id: req.user._id }, { token: "", tokenExp: "" }, (err, doc) => {
//         if (err) return res.json({ success: false, err });
//         return res.status(200).send({
//             success: true
//         });
//     });
// });

module.exports = router;