const express = require("express");
const app = express();
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
require("dotenv").config({ path: "sample.env" });
const userSchema = require("./models/userModel");
const exerciseSchema = require("./models/exerciseModel");

// Basic Configuration ----------------------------------------------
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));

// Middlewares ------------------------------------------------------

const checkUser = async (req, res, next) => {
  const { _id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    res.status(400).send({ error: "Incorrect input" });
    return;
  }

  const user = await userSchema.findById({ _id });
  if (!user) {
    res.status(400).send({ error: "User is not found" });
    return;
  }

  req.user = user;
  next();
};

// Endpoints --------------------------------------------------------

// Main
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// Create user
app.post("/api/users", async (req, res) => {
  const username = req.body.username;
  if (!username) {
    res.status(400).send({ error: "Username is required" });
    return;
  }
  //Check user in db
  const existingUser = await userSchema.findOne({ username });
  if (existingUser) {
    return res.json({ username: existingUser.username, _id: existingUser._id });
  }
  const newUser = new userSchema({ username });
  newUser.save((err, data) => {
    if (err) return console.error(err.message);
    console.log(data);
    return res.json({ username: data.username, _id: data._id });
  });
});

// Retrieve all users
app.get("/api/users", async (req, res) => {
  await userSchema
    .find({})
    .select(("_id", "username"))
    .exec((err, users) => {
      if (err) return res.status(400).send(err.message);
      res.status(200).send(users);
    });
});

// Add an exercise
app.post("/api/users/:_id/exercises", checkUser, async (req, res) => {
  const {
    user: { _id: userId, username },
    body: { description, duration, date },
  } = req;

  const exercise = new exerciseSchema({
    userId,
    description,
    duration,
    date: date || Date.now(),
  });

  exercise.save((err, data) => {
    if (err) return res.status(400).send(err.message);
    res.json({
      username,
      description: data.description,
      duration: data.duration,
      date: data.date.toDateString(),
      userId,
    });
  });
});

// User log
app.get("/api/users/:_id/logs", checkUser, async (req, res) => {
  const {
    user: { _id: userId, username },
    query: { from, to, limit },
  } = req;
  await exerciseSchema
    .find({
      userId,
      date: {
        $gte: new Date(from || 0),
        $lte: new Date(to || Date.now()),
      },
    })
    .select("-_id description duration date")
    .limit(parseInt(limit))
    .exec((err, log) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }

      // If we want to reformat dates:

      /*
      const convertedLog = log.map((exercise) => ({
        description: exercise.description,
        duration: exercise.duration,
        date: exercise.date.toDateString(),
      }));
      */

      res.json({ _id: userId, username, count: log.length, log });
    });
});

// Connect to MongoDB ------------------------------------------------
mongoose.set("strictQuery", false);
mongoose
  .connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .catch((err) => console.error(err.message));
const db = mongoose.connection;

// Check connection status
// 0 = disconnected
// 1 = connected
// 2 = connecting
// 3 = disconnecting
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log(`MongoDB connection readyState: ${db.readyState}`);
});

// Listener ----------------------------------------------------------
const listener = app.listen(process.env.PORT || 3000, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
