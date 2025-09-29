const router = require("express").Router();
let User = require("../models/user.model");

router.route("/register").post((req, res) => {
  const { username, password, role } = req.body;

  const newUser = new User({
    username,
    password,
    role,
  });

  newUser
    .save()
    .then(() => res.json("User added!"))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/login").post((req, res) => {
  const { username, password } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (!user) {
        return res.status(404).json("User not found");
      }

      if (user.password === password) {
        res.json(user);
      } else {
        res.status(400).json("Invalid credentials");
      }
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
