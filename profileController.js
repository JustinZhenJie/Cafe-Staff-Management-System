const Profile = require("../models/profile.model");
const mongoose = require("mongoose");
const Role = require("../models/role.model");

class ProfileController {
  async createProfile(req, res) {
    const newProfile = new Profile(req.body);
    const { user } = req.body;

    try {
      const existingUser = await Profile.findOne({ user });
      if (existingUser) {
        return res.status(400).json({
          error: "Profile already exists!",
          message: "Profile already exists!",
        });
      }

      const savedProfile = await newProfile.save(); // Changed variable name to savedRole
      res.json(savedProfile);
    } catch (err) {
      res.status(400).json({
        error: "Error creating profile!",
        message: "Error creating profile!",
      });
    }
  }

  async getAllProfiles(req, res) {
    try {
      const profiles = await Profile.find({})
        .populate("user")
        .populate("role")
        .exec();
      res.status(200).json(profiles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving profiles" });
    }
  }

  async getProfile(req, res) {
    try {
      const profile = await Profile.findById(req.params.id)
        .populate("role")
        .populate("user")
        .exec();
      res.status(200).json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving profile" });
    }
  }

  async deleteProfile(req, res) {
    const profileId = req.params.id;
    try {
      const profile = await Profile.findByIdAndDelete(profileId);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting profile" });
    }
  }

  async getProfileByUserId(req, res) {
    const userId = req.params.id;
    try {
      const profile = await Profile.findOne({ user: userId })
        .populate("user")
        .populate("role")
        .exec();
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.status(200).json(profile);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving profile" });
    }
  }

  async searchProfilesByRoleName(req, res) {
    const query = req.query.q;
    try {
      let profiles;
      // Check if the query is a valid ObjectId
      if (mongoose.isValidObjectId(query)) {
        // Directly search by ObjectId
        profiles = await Profile.find({ role: query }).populate("role");
      } else {
        // Find roles with matching roleDescription
        const roles = await Role.find({
          role: { $regex: query, $options: "i" },
        });

        // Extract _id of roles
        const roleIds = roles.map((role) => role._id);
        console.log("Role IDS", roleIds);

        // Find profiles with role _id in roleIds
        profiles = await Profile.find({
          role: { $in: roleIds },
        })
          .populate("role")
          .populate("user")
          .exec();
      }

      res.status(200).json(profiles);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving profiles" });
    }
  }

  // Delete Profile by User ID
  async deleteProfileByUserId(req, res) {
    const { id } = req.params;
    // Check if the ID is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid ID" });
    }

    try {
      // Check if the profile exists
      const profile = await Profile.findOneAndDelete({ user: id });
      if (!profile) {
        return res.status(404).json({ message: "Profile not found" });
      }

      return res.status(200).json(profile);
    } catch (err) {
      return res.status(500).json({ message: err.message });
    }
  }
}

module.exports = ProfileController;
