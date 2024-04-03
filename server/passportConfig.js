const bycrpt = require("bcrypt");
const passportLocal = require("passport-local").Strategy;

const supabase = require("./config/dbConfig");


module.exports = function (passport) {
  console.log("PASSPORT CONFIG FILE");
  passport.use(
    new passportLocal((email, pass, done) => {
      console.log(email.toLowerCase())
      supabase.from('User').select('*').eq('email',email.toLowerCase()).single().then(({data,error}) =>{
        if(error){
          console.log("Supabase error"+ error.message)
          return done(error);
        }
        if(!data){
          return done(null,false)
        }
        console.log("Data from Supabase:", data); // Log the data
        bycrpt.compare(pass, data.pass, (err, result) => {
          if (err) throw done(err);
          if (result === true) {
            return done(null, data);
          } else {
            return done(null, false);
          }
        });
      }).catch(error=>done(error));
        
      })
    
     
    
  );

  passport.serializeUser((user, cb) => {
    console.log("SERIALIZE USER (PP config): " + user.id);
    cb(null, user.id);
  });

  passport.deserializeUser((id, done) => {
    console.log("DESERIALIZING");
    supabase.from('User').select('*').eq('id',id).single().then(({data,error}) =>{
      if (error) {
        console.log("Error fetching user data:", error);
        return done(error); // Pass the error to the done callback
      }
      if (data.length === 0) {
        console.error("User not found in database");
        return done(null, false); // User not found
      }
      const userInfo = {
        id: data.id,
        name: data.name,
        email: data.email,
      };
      console.log("User info (PP config):", JSON.stringify(userInfo));
      done(null, userInfo);
    }).catch(error => done(error));
    
    
  });
};
