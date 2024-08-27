const Bid = require("../models/bid.model");
const mongoose = require("mongoose");
const User = require("../models/user.model");
const WorkSlot = require("../models/workSlot.model");
const WorkSlotController = require("./workSlotController");
const workSlotController = new WorkSlotController();

class BidController {
  // Create Bid
  async createBid(req, res) {
    const { userID, workSlotID } = req.body;
    // Check if the ID is valid
    if (
      !mongoose.Types.ObjectId.isValid(userID) ||
      !mongoose.Types.ObjectId.isValid(workSlotID)
    ) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    // Check for duplicates
    const bidExists = await Bid.findOne({
      employee: userID,
      workSlot: workSlotID,
    });
    if (bidExists) {
      return res.status(400).json({ message: "Bid already exists" });
    }

    try {
      const bid = await Bid.create({
        employee: userID,
        workSlot: workSlotID,
        date: Date.now(),
      });
      await bid.save();

      return res.status(201).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Withdraw Bid
  async withdrawBid(req, res) {
    const { id } = req.params;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the bid exists
      const bid = await Bid.find({ workSlot: id });
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }

      await Bid.deleteMany({ workSlot: id });

      return res.status(200).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Delete Bid by User ID
  async deleteBidByUserId(req, res) {
    const { id } = req.params;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the bid exists
      const bid = await Bid.find({ employee: id });
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }

      await Bid.deleteMany({ employee: id });

      return res.status(200).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get All Bids
  async getAllBids(req, res) {
    try {
      const bids = await Bid.find();
      return res.status(200).json(bids);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get Bid
  async getBid(req, res) {
    const { id } = req.params;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the bid exists
      const bid = await Bid.findById(id);
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }

      return res.status(200).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get Bid by User ID
  async getBidByUserId(req, res) {
    const { id } = req.params;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the bid exists
      const bid = await Bid.find({ employee: id });
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }

      return res.status(200).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Get Bid by WorkSlot ID
  async getBidByWorkSlotId(req, res) {
    const { id } = req.params;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the bid exists
      const bid = await Bid.find({ workSlot: id })
        .populate({
          path: "employee",
          model: "User",
          populate: {
            path: "role",
            model: "Role",
          },
        })
        .populate("workSlot")
        .exec();
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }

      return res.status(200).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }

  // Approve or Reject Bid
  async approveRejectBid(req, res) {
    const { id } = req.params;
    const { status } = req.body;

    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the bid exists
      const bid = await Bid.findById(id).populate("workSlot");
      if (!bid) {
        return res.status(404).json({ message: "Bid not found" });
      }

      bid.status = status;

      // If status of bid is "Approved", push userID to workSlot.employees
      if (status === "Approved") {
        const workSlotId = bid.workSlot;
        const employee = bid.employee;

        // Find the Work Slot
        const workSlot = await WorkSlot.findById(workSlotId);
        if (!workSlot) {
          return res.status(404).json({ error: "Work slot not found." });
        }

        // Find the Employee
        const employeeData = await User.findById(employee);
        if (!employeeData) {
          return res.status(404).json({ error: "Employee not found." });
        }

        // Push the employee id and role into the employees array
        workSlot.employees.push({ employee: employeeData });
        await workSlot.save();
      }

      await bid.save();

      return res.status(200).json(bid);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = BidController;
