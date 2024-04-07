const express = require("express");
const router = express.Router();

const supabase = require("../config/dbConfig");

router.get("/", async (req, res) => {
  console.log("GETTING PENDING CHARITIES");
  try {
    const { data, error } = await supabase.from("PendingCharity").select("*");

    if (error) {
      console.log("ERROR: " + error);
    }
    if (!data) {
      console.log("No Charities found");
    }
    console.log("charity: ");
    console.log(data);
    res.send(data);
  } catch (e) {
    console.log("ERR: " + e);
  }
});

module.exports = router;
