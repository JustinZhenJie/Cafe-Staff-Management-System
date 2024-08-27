const express = require("express");
const router = express.Router();
const BidController = require("../controllers/bidController");
const bidController = new BidController();

// Create Bid
router.post("/bid/create", bidController.createBid);
// Withdraw Bid
router.delete("/bid/:id", bidController.withdrawBid);
// Get All Bids
router.get("/bids", bidController.getAllBids);
// Get All Bids by WorkSlot ID
router.get("/bids/work/:id", bidController.getBidByWorkSlotId);
// Get All Bids by User ID
router.get("/bids/user/:id", bidController.getBidByUserId);
// Get Bid By ID
router.get("/bid/:id", bidController.getBid);
// Approve or Reject Bid
router.put("/bid/:id", bidController.approveRejectBid);
// Delete Bid by User ID
router.delete("/bids/user/:id", bidController.deleteBidByUserId);

module.exports  = router;