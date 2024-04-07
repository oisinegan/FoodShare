const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  try {
    let info = req.body;
    console.log(info);
    console.log(info.AdId);

    const { error } = await supabase
      .from("applicants")
      .delete()
      .eq("adId", info.AdId);

    if (error) throw error;

    const { err } = await supabase.from("ads").delete().eq("id", info.AdId);

    if (err) throw err;

    console.log("Detleted ad from ads and applicants");
    res.send(true);
  } catch (e) {
    console.log("e: " + e);
  }
});

module.exports = router;
