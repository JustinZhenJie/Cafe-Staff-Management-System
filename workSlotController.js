const WorkSlot = require("../models/workSlot.model");
const User = require("../models/user.model");
const mongoose = require("mongoose");
class WorkSlotController {
  async createWorkSlot(req, res) {
    const workSlotData = req.body;
    const newWorkSlot = new WorkSlot(workSlotData);

    try {
      const existingWorkSlot = await WorkSlot.findOne({
        date: workSlotData.date,
      });
      if (existingWorkSlot) {
        return res.status(400).json({
          error: "Work slot already exists.",
          message: "Work slot has already been created on this date!",
        });
      }
      const workSlot = await newWorkSlot.save();
      res.json(workSlot);
    } catch (err) {
      res.status(400).json({ error: "Error creating work slot!" });
    }
  }

  async getAllWorkSlots(req, res) {
    try {
      const workSlots = await WorkSlot.find({})
        .sort({ date: 1 })
        .populate({
          path: "employees.employee",
          model: "User",
          populate: {
            path: "role",
            model: "Role",
          },
        })
        .exec();
      res.status(200).json(workSlots);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving work slots." });
    }
  }

  async getWorkSlotById(req, res) {
    const workSlotId = req.params.id;

    // Check if workSlotId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(workSlotId)) {
      return res.status(400).json({ error: "Invalid work slot id." });
    }

    try {
      const workSlot = await WorkSlot.findById(workSlotId)
        .populate({
          path: "employees.employee",
          model: "User",
          populate: {
            path: "role",
            model: "Role",
          },
        })
        .exec();
      if (!workSlot) {
        return res.status(404).json({ error: "Work slot not found." });
      }
      res.status(200).json(workSlot);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving work slot." });
    }
  }

  async updateWorkSlot(req, res) {
    const workSlotId = req.params.id;
    const newWorkSlotData = req.body;
    try {
      // Check if the date is already taken, ignoring the hours and minutes
      const existingWorkSlot = await WorkSlot.findOne({
        date: newWorkSlotData.date,
      });

      if (existingWorkSlot) {
        return res.status(400).json({
          error: "Work slot already exists.",
          message: "Work slot has already been created on this date!",
        });
      }

      const workSlot = await WorkSlot.findByIdAndUpdate(
        workSlotId,
        newWorkSlotData,
        {
          new: true,
        }
      );

      if (!workSlot) {
        return res.status(404).json({ error: "Work slot not found." });
      }

      res.status(200).json(workSlot);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating work slot." });
    }
  }

  async deleteWorkSlot(req, res) {
    const workSlotId = req.params.id;
    try {
      const workSlot = await WorkSlot.findByIdAndDelete(workSlotId);
      if (!workSlot) {
        return res.status(404).json({ error: "Work slot not found." });
      }
      res.status(200).json({ message: "Work slot deleted successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting work slot." });
    }
  }

  async assignEmployeeToWorkSlot(req, res) {
    const workSlotId = req.params.id;
    const employee = req.body.employee;

    try {
      // Find the Work SLot
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

      res.status(200).json({ message: "Employee assigned successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error assigning employee." });
    }
  }

  async getApprovedWorkSlotsByUserId(req, res) {
    const employeeId = req.params.id;

    try {
      // Find work slots where the user is assigned as an employee
      const workSlotsFromEmployees = await WorkSlot.find({
        "employees.employee": employeeId,
      });

      // Combine and remove duplicates
      const workSlots = [...workSlotsFromEmployees].filter(
        (value, index, self) =>
          self.findIndex((s) => s._id.toString() === value._id.toString()) ===
          index
      );

      res.status(200).json(workSlots);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Error retrieving work slots for the user." });
    }
  }

  async toggleWorkSlotAvailability(req, res) {
    const workSlotId = req.params.id;
    try {
      // Find the work slot
      const workSlot = await WorkSlot.findById(workSlotId);
      if (!workSlot) {
        return res.status(404).json({ error: "Work slot not found." });
      }
      // Toggle the isAvailable property
      workSlot.isAvailable = !workSlot.isAvailable;
      await workSlot.save();
      res
        .status(200)
        .json({ message: "Work slot availability toggled successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error toggling work slot availability." });
    }
  }

  // Search by Date
  async searchByDate(req, res) {
    try {
      const workSlots = await WorkSlot.find();
      const filteredWorkSlots = workSlots.filter((workSlot) =>
        workSlot.date.toISOString().includes(req.query.date)
      );
      res.json(filteredWorkSlots);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  // Remove Employee from Employees array in All WorkSlots
  async deleteEmployeeFromWorkSlot(req, res) {
    const userId = req.params.userId;
    console.log("User ID", userId);
    try {
      // Find all Work Slots
      const workSlots = await WorkSlot.find({});

      // For each work slot, remove the employee from the employees array
      workSlots.forEach(async (workSlot) => {
        await WorkSlot.findByIdAndUpdate(workSlot._id, {
          $pull: { employees: { employee: userId } },
        });
      });

      res.status(200).json({ message: "Employee removed successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error removing employee." });
    }
  }

  // Get Workslots Where Employees Array Length < 3
  async getUnfulfilledWorkSlots(req, res) {
    try {
      const workSlots = await WorkSlot.find({
        $expr: { $lt: [{ $size: "$employees" }, 3] },
      });
      res.status(200).json(workSlots);
    } catch (err) {
      console.error(err);
      res
        .status(500)
        .json({ error: "Error retrieving unfulfilled work slots." });
    }
  }
}

module.exports = WorkSlotController;
