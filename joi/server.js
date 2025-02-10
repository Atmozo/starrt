const express = require("express");
const userSchema = require("./validation");

const app = express();
app.use(express.json());

app.post("/register", (req, res) => {
  const { error } = userSchema.validate(req.body);
  if (error) return res.status(400).json({ error: error.details[0].message });

  res.json({ message: "User registered successfully!" });
});

app.listen(3000, () => console.log("Server running on port 3000"));
