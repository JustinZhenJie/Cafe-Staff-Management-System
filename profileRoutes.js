const express = require("express");
const router = express.Router();
const ProfileController = require("../controllers/profileController");
const profileController = new ProfileController();

// Create Profile
router.post("/profile/create", profileController.createProfile);
// Get All Profiles
router.get("/profiles", profileController.getAllProfiles);
// Get Profile by Id
router.get("/profile/:id", profileController.getProfile);
// Delete Profile by Id
router.delete("/profile/:id", profileController.deleteProfile);
// Get Profile by User Id
router.get("/profile/user/:id", profileController.getProfileByUserId);
// Search by Role Name
router.get("/search", profileController.searchProfilesByRoleName);
// Delete Profile by User Id
router.delete("/profile/user/:id", profileController.deleteProfileByUserId);

module.exports = router;
