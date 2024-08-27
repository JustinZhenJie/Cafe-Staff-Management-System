const mongoose = require("mongoose");

class WorkSlot {
  constructor() {
    this.schema = new mongoose.Schema({
      date: {
        type: Date,
        required: true,
      },

      employees: [
        {
          employee: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
          },
        },
      ],

      isAvailable: {
        type: Boolean,
        default: true,
      },
    });

    this.model = mongoose.model("WorkSlot", this.schema);
  }
}

module.exports = new WorkSlot().model;
