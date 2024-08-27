const express = require("express");
const router = express.Router();
const UserController = require("../controllers/userController");
const userController = new UserController();

// Get All Users
router.get("/users", userController.getAllUsers);
// Search by First Name
router.get("/users/search", userController.searchByName);
// Get User By Id
router.get("/user/:id", userController.getUserById);
// Create User
router.post("/register", userController.createUser);
// Update User
router.put("/user/:id", userController.updateUser);
// Delete User
router.delete("/user/:id", userController.deleteUser);
// Search by Username
router.get("/user/search/:username", userController.searchByUsername);
// User Login
router.post("/login", userController.login);
// Change Shifts Per Week
router.put("/user/:id/shiftsPerWeek", userController.changeShiftsPerWeek);
// Forget Password
router.put("/forgot-password/:id", userController.forgotPassword);
// Get Users by Role
router.get("/users/:role", userController.getEmployeesByRole);

module.exports = router;
