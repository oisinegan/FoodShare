const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  let info = req.body;
  console.log("INFO");
  console.log(info);
  // console.log(info.id);
  let ids = [];
  if (info.id !== null) {
    console.log("ENTERTED IS NOT NULL......");
    console.log(info.id);
    try {
      const { data, error } = await supabase
        .from("applicants")
        .select("adId")
        .eq("userInterested", info.id);
      if (error) {
        console.log("ERROR11: " + error);
      }
      if (!data) {
        console.log("No ads found");
      }
      ids = data.map((id) => id.adId);
      console.log("ADS0: ");
      console.log(ids);
    } catch (err) {
      console.log("Error fetching0: " + err.message);
    }

    try {
      const { data, error } = await supabase
        .from("ads")
        .select("*")
        .neq("userId", info.id);
      console.log("DATA");
      console.log(data);
      if (error) {
        console.log("ERROR: " + error);
      }
      if (!data) {
        console.log("No ads found");
      } else {
        //Fliter out liked ads
        const updatedAds = data.filter((ad) => !ids.includes(ad.id));
        console.log("UPDATED ADS");
        console.log(updatedAds);
        res.send(updatedAds);
      }
    } catch (err) {
      console.log("Error fetching: " + err.message);
    }
  } else {
    console.log("ENTERTED IS NULL......");
    console.log(info);
    const { data, error } = await supabase.from("ads").select("*");
    console.log("DATA");
    console.log(data);
    if (error) {
      console.log("ERROR: " + error);
    }
    if (!data) {
      console.log("No ads found");
    } else {
      console.log(data);
      res.send(data);
    }
  }
});

module.exports = router;
