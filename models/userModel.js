let mongoose = require("mongoose");

mongoose.set("useCreateIndex", true);

let userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
});

module.exports = mongoose.model("userSchema", userSchema);
