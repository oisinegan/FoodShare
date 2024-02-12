const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info);
  connection.connect();
  const users = [{}];

  connection.query(
    // "SELECT * FROM applicants WHERE adId= " + info.id + ";",
    "SELECT User.email, User.name FROM applicants JOIN User ON applicants.userInterested = User.id WHERE applicants.adId = " +
      info.id +
      ";",
    (err, rows, fields) => {
      if (err) throw err;

      rows.forEach((row) => {
        const { email, name } = row;
        users.push({ email, name });
      });

      res.send(users);
    }
  );
});

module.exports = router;
