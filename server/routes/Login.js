const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");
const bycrpt = require("bcrypt");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const secretKey = process.env.SECRET_KEY;

router.post("/", (req, res, next) => {
  console.log("req.body");
  console.log(req.body);
  let info = req.body;
  console.log(info);
  passport.authenticate("local", (err, user, info) => {
    console.log("Auth.....");
    // if (err) throw err;
    if (err) {
      console.log("Error during authenticating: " + err.message);
    }
    if (!user) {
      console.log("NO USER");
      res.send({ user: false });
    } else {
      console.log("user exisrs");
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
