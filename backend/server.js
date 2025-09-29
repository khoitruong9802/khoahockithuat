const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri);
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});

const usersRouter = require("./routes/users");
const questionsRouter = require("./routes/questions");
const testsRouter = require("./routes/tests");

app.use("/users", usersRouter);
app.use("/questions", questionsRouter);
app.use("/tests", testsRouter);

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
