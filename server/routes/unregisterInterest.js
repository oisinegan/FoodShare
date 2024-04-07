const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  try {
    let info = req.body;

    console.log(info.adId);
    console.log(info.userId);

    const { data, error } = await supabase
      .from("applicants")
      .delete()
      .eq("adId", info.adId)
      .eq("userInterested", info.userId);

    if (error) {
      console.log("ERROR + " + error);
    }
    console.log("Unregister interest success");
    res.send(true);
  } catch (e) {
    console.log("ERR: " + e);
  }
});

module.exports = router;
