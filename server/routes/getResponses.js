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
    "SELECT User.id, User.email, User.name, User.Url, User.points, User.long, User.lat FROM applicants JOIN User ON applicants.userInterested = User.id WHERE applicants.adId = " +
      info.id +
      ";",
    (err, rows, fields) => {
      if (err) throw err;

      rows.forEach((row) => {
        const { id,email, name, Url, points, long, lat } = row;
        users.push({ id,email, name, Url, points, long, lat });
      });

      res.send(users);
    }
  );
});

module.exports = router;
