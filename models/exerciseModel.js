let mongoose = require("mongoose");

let exerciseSchema = new mongoose.Schema({

  userId: { type: mongoose.Types.ObjectId, ref: "userSchema" },
  description: { type: String, required: true },
  duration: { type: Number, required: true },
  date: { type: Date, required: true, default: Date.now() },
});

module.exports = mongoose.model("exerciseSchema", exerciseSchema);
