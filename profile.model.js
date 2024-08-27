const mongoose = require("mongoose");

class Profile {
  constructor() {
    this.schema = new mongoose.Schema({
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },

      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
      },
    });

    this.model = mongoose.model("Profile", this.schema);
  }
}

module.exports = new Profile().model;
