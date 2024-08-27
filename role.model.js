const mongoose = require("mongoose");

class Role {
  constructor() {
    this.schema = new mongoose.Schema({
      role: {
        type: String,
        required: true,
        unique: true,
      },

      roleDescription: {
        type: String,
        required: true,
        unique: false,
      },
    });

    this.model = mongoose.model("Role", this.schema);
  }
}

module.exports = new Role().model;
