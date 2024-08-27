const Role = require("../models/role.model");

class RoleController {
  async createRole(req, res) {
    const newRole = new Role(req.body);
    const { role } = req.body;

    try {
      const existingRole = await Role.findOne({ role });
      if (existingRole) {
        return res.status(400).json({
          error: "Role already exists!",
          message: "Role already exists!",
        });
      }

      const savedRole = await newRole.save(); // Changed variable name to savedRole
      res.json(savedRole);
    } catch (err) {
      res.status(400).json({
        error: "Error creating role",
        message: "Error creating role!",
      });
    }
  }

  async getAllRoles(req, res) {
    try {
      const roles = await Role.find({});
      res.status(200).json(roles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving roles" });
    }
  }

  async getRoleById(req, res) {
    const roleId = req.params.id;
    try {
      const role = await Role.findById(roleId);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.status(200).json(role);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving role" });
    }
  }

  async deleteRole(req, res) {
    const roleId = req.params.id;
    try {
      const role = await Role.findByIdAndDelete(roleId);
      if (!role) {
        return res.status(404).json({ error: "Role not found" });
      }
      res.status(200).json(role);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting role" });
    }
  }

  async updateRole(req, res) {
    const roleId = req.params.id;
    const newRoleData = req.body;

    try {
      const role = await Role.findByIdAndUpdate(roleId, newRoleData, {
        new: true,
      });

      if (!role) {
        return res.status(400).json({ error: "Role not found!" });
      }

      res.status(200).json(role);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating role" });
    }
  }

  // Search for roles by role name query
  async searchRoles(req, res) {
    const query = req.query.role;
    try {
      const roles = await Role.find({
        role: { $regex: query, $options: "i" },
      });
      res.status(200).json(roles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving roles" });
    }
  }
}

module.exports = RoleController;
