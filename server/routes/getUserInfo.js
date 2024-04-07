const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  let info = req.body;
  try {
    let info = req.body;
    console.log(info);
    let { data, error } = await supabase
      .from("User")
      .select("url, points")
      .eq("id", info.user.id);

    if (error) {
      console.log("Error from getUserINfo: " + error.message);
    } else {
      console.log("userInfo");

      console.log(data);
      res.send(data);
    }
  } catch (e) {
    console.log("ERROR: " + e);
  }
});

module.exports = router;
