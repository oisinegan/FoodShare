const express = require("express");
const router = express.Router();
const supabase = require("../config/dbConfig");

router.post("/", async (req, res) => {
  let info = req.body;
  console.log(info.user);
  console.log(info.item);

  let ids = [];

  try {
    const { data, error } = await supabase
      .from("applicants")
      .select("adId")
      .eq("userInterested", info.user.id);
    if (error) {
      console.log("ERROR: " + error);
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
      .ilike("item", "%" + info.item + "%")
      .neq("userId", info.user.id);
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
});

module.exports = router;
