const express = require("express");
const passport = require("./auth");

const app = express();

app.use(passport.initialize());

// Protected route using the custom authentication strategy
app.get(
    "/protected",
    passport.authenticate("custom", { session: false }),
    (req, res) => {
        res.json({ message: "Access granted", user: req.user });
    }
);

app.listen(3000, () => console.log("Server running on port 3000"));
