const mongoose = require("mongoose");

class Bid {
  constructor() {
    this.schema = new mongoose.Schema({
      workSlot: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "WorkSlot",
      },
      employee: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      date: {
        type: Date,
        required: true,
      },
      status: {
        type: String,
        enum: ["Pending", "Approved", "Rejected"],
        default: "Pending",
      },
    });

    this.model = mongoose.model("Bid", this.schema);
  }
}

module.exports = new Bid().model;
