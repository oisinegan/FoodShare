const express = require("express");
const router = express.Router();
const connection = require("../config/dbConfig");
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  try {
    let info = req.body;
    console.log(info);
    let { data, error } = await supabase
      .from("applicants")
      .select("*")
      .eq("adId", info.adId)
      .eq("author", info.author)
      .eq("userInterested", info.userInterested);

    if (error) {
      console.log("error : " + error);
    }

    if (data.length > 0) {
      console.log("Interest exists");
      return res.send(true);
    }

    let { err } = await supabase
      .from("applicants")
      .insert([
        {
          adId: info.adId,
          author: info.author,
          userInterested: info.userInterested,
        },
      ]);
    if (err) throw err;
    console.log("SUCCESS");
    return res.send(true);
  } catch (error) {
    console.log("Error" + error);
    res.send(false);
  }
});

module.exports = router;
