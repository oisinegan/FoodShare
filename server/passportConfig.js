const bycrpt = require("bcrypt");
const passportLocal = require("passport-local").Strategy;
const connection = require("./config/dbConfig");

module.exports = function (passport) {
  passport.use(
    new passportLocal((email, pass, done) => {
      const sql = "SELECT * FROM User WHERE email = '" + email + "'";
      console.log("HERE");
      connection.query(sql, (err, rows, fields) => {
        if (err) throw done(err);
        if (rows.length === 0) return done(null, false);
        console.log("ROWS:::::" + rows[0].pass);
        bycrpt.compare(pass, rows[0].pass, (err, result) => {
          if (err) throw done(err);
          if (result === true) {
            return done(null, rows[0]);
          } else {
            return done(null, false);
          }
        });
      });
    })
  );

  passport.serializeUser((user, cb) => {
    console.log("SERIALIZE USER (PP config): " + user.id);
    cb(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("DESERIALIZING");
    const sql = "SELECT * FROM User WHERE id = '" + id + "'";
    connection.query(sql, (err, rows, fields) => {
      if (err) {
        console.log("Error fetching user data:", err);
        return done(err); // Pass the error to the done callback
      }
      if (rows.length === 0) {
        console.error("User not found in database");
        return done(null, false); // User not found
      }
      const userInfo = {
        id: rows[0].id,
        name: rows[0].name,
        email: rows[0].email,
      };
      console.log("User info (PP config):", JSON.stringify(userInfo));
      done(null, userInfo);
    });
  });
};
