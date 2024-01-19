const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const bycrpt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

router.post("/", (req, res, next) => {
  connection.connect();
  console.log(req.body);
  let info = req.body;
  console.log(info);
  passport.authenticate("local", (err, user, info) => {
    if (err) throw err;
    if (!user) {
      console.log("NO USER");
      res.send({ user: false });
    } else {
      req.logIn(user, (err) => {
        if (err) throw err;
        const token = jwt.sign(
          { email: user.email, name: user.name, id: user.id },
          secretKey,
          { expiresIn: "1hr" }
        );
        console.log(user.email);
        res.send({ user: token });
        console.log("SENT TOKEN!");
      });
    }
  })(req, res, next);
});

module.exports = router;
