const express = require("express");
const router = express.Router();

const bycrpt = require("bcrypt");

const { Storage } = require("@google-cloud/storage");
const multer = require("multer");
const fs = require("fs");
const supabase = require("../config/dbConfig");

const memoryStorage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 20 * 1024 * 1024,
  },
});
let projectId = process.env.PROJECT_ID;
let keyFilename = process.env.KEY_FILENAME;

const storage = new Storage({
  projectId,
  keyFilename,
});

const bucket = storage.bucket(process.env.BUCKET);

//Get date and time posted
const date = Date();
const new_date = new Date(date);

const datePosted =
  new_date.getDate() +
  "-" +
  new_date.getMonth() +
  1 +
  "-" +
  new_date.getFullYear();

const timePosted =
  new_date.getHours() +
  ":" +
  new_date.getMinutes() +
  ":" +
  new_date.getSeconds();

router.post("/", memoryStorage.single("image"), async (req, res) => {
  try {
    console.log(req.file);
    console.log(req.body);

    const originalname = req.file.originalname;
    const fileBuffer = req.file.buffer;
    const info = req.body;

    console.log(originalname);
    console.log(fileBuffer);
    console.log(req.file.measurementType);

    const file = bucket.file(originalname);
    const stream = file.createWriteStream();

    stream.on("finish", async () => {
      console.log("SUCCESS - NOW SENDING INFO TO DB");
      const publicUrl =
        "https://storage.googleapis.com/" + bucket.name + "/" + originalname;
      console.log(publicUrl);
      try {
        let { data, error } = await supabase.from("ads").insert([
          {
            item: info.foodName,
            image_url: publicUrl,

            brand: info.brand,

            userId: info.userId,

            expiryDate: info.expiryDate,

            size: info.size,

            measurementType: info.measurementType,

            quant: info.quant,

            extraInfo: info.extraInfo,

            datePosted: datePosted,

            timePosted: timePosted,

            postTo: info.postTo,

            long: info.long,

            lat: info.lat,
          },
        ]);

        if (error) {
          console.log("Error writing to DB: " + error.message);
        } else {
          console.log("success");
          res.send(true);
        }
      } catch (e) {
        console.log("ERROR WRITING TO DB: " + e);
      }
    });
    stream.end(fileBuffer);
  } catch (error) {
    console.log("ERROR: " + err);
  }
});

module.exports = router;
