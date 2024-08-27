const express = require("express");
const router = express.Router();
const RoleController = require("../controllers/roleController");
const roleController = new RoleController();

// Create Role
router.post("/role/create", roleController.createRole);
// Get All Roles
router.get("/roles", roleController.getAllRoles);
// Get Role by ID
router.get("/role/:id", roleController.getRoleById);
// Delete Role
router.delete("/role/:id", roleController.deleteRole);
// Update Role
router.put("/role/:id", roleController.updateRole);
// Search by Role Name
router.get("/roles/search", roleController.searchRoles);

module.exports = router;
