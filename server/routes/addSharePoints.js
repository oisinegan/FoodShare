const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");

router.post("/", (req, res) => {
  let info = req.body;
  console.log(info.otherUser);
  console.log(info.userN);


  connection.query(
    "UPDATE User set points=points + 5 where name IN ('" + info.userN + "','"+ info.otherUser + "');",

    (err, rows, fields) => {
      if (err) throw err;
      res.send(true);
    }
  );
});

module.exports = router;
