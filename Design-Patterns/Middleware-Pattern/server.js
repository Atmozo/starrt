import express from "express";

const app = express();

// Middleware
const loggerMiddleware = (req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
};

app.use(loggerMiddleware);

app.get("/", (req, res) => {
  res.send("Hello, Middleware!");
});

app.listen(3000, () => console.log("Server running on port 3000"));

