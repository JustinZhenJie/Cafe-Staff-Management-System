const mongoose = require("mongoose");

class User {
  constructor() {
    this.schema = new mongoose.Schema({
      username: {
        type: String,
        required: true,
        unique: true,
      },

      firstName: {
        type: String,
        required: true,
        unique: false,
      },

      lastName: {
        type: String,
        required: true,
        unique: false,
      },

      email: {
        type: String,
        required: true,
        unique: true,
      },

      password: {
        type: String,
        required: true,
        unique: false,
      },

      role: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        default: null,
      },

      shiftsPerWeek: {
        type: Number,
        default: 0,
      },
    });

    this.model = mongoose.model("User", this.schema);
  }
}

module.exports = new User().model;
