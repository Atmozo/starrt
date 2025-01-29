const passport = require("passport");
const CustomStrategy = require("./CustomStrategy");

// Dummy function to verify token
const verifyFunction = (token, done) => {
    // Replace this with actual verification logic
    if (token === "valid-token") {
        return done(null, { id: 1, username: "testUser" });
    } else {
        return done(null, false, { message: "Invalid token" });
    }
};

// Use the custom strategy
passport.use(new CustomStrategy(verifyFunction));

module.exports = passport;
