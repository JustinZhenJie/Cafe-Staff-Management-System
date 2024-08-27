const express = require("express");
const router = express.Router();
const WorkSlotController = require("../controllers/workSlotController");
const workSlotController = new WorkSlotController();

// Create Work Slot
router.post("/work-slot/create", workSlotController.createWorkSlot);
// Get Work Slots
router.get("/work-slots", workSlotController.getAllWorkSlots);
// Search Work Slot by Date
router.get("/work-slot/search", workSlotController.searchByDate);
// Get Unfulfilled Work Slots
router.get(
  "/work-slot/unfulfilled",
  workSlotController.getUnfulfilledWorkSlots
);
// Get Work Slot By Id
router.get("/work-slot/:id", workSlotController.getWorkSlotById);
// Update Work Slot
router.put("/work-slot/:id", workSlotController.updateWorkSlot);
// Delete Work Slot
router.delete("/work-slot/:id", workSlotController.deleteWorkSlot);

// Assign Employee to Work Slot
router.put(
  "/work-slot/:id/assign",
  workSlotController.assignEmployeeToWorkSlot
);
// Toggle Availability of Work Slot
router.put(
  "/work-slot/:id/status",
  workSlotController.toggleWorkSlotAvailability
);
// Find Approved Work Slot by User ID
router.get(
  "/work-slot/approved/:id",
  workSlotController.getApprovedWorkSlotsByUserId
);
// Remove Employee from Employees array in All WorkSlots
router.put(
  "/work-slot/:userId/remove",
  workSlotController.deleteEmployeeFromWorkSlot
);

module.exports = router;
