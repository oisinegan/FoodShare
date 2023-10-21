const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send({ message: "Connected to backend" });
});

module.exports = router;
