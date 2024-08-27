const User = require("../models/user.model");
const Profile = require("../models/profile.model");
const Bid = require("../models/bid.model");
const WorkSlot = require("../models/workSlot.model");

class UserController {
  async createUser(req, res) {
    const { username, email } = req.body;
    const newUser = new User(req.body);

    try {
      // Check if username or email already exists
      const existingUser = await User.findOne({
        $or: [{ username }, { email }],
      });
      if (existingUser) {
        return res.status(400).json({
          error: "Username or email already exists!",
          message: "Username or email already exists!",
        });
      }

      const user = await newUser.save();
      res.json(user);
    } catch (err) {
      res.status(400).json({
        error: "Error creating user",
        message: "Error creating user!",
      });
    }
  }

  async getAllUsers(req, res) {
    try {
      const users = await User.find().populate("role");
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error getting users" });
    }
  }

  async getUserById(req, res) {
    const userId = req.params.id;
    try {
      // Use populate to get role details for the user
      const user = await User.findById(userId).populate("role").exec();

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving user" });
    }
  }

  async updateUser(req, res) {
    const userId = req.params.id;
    const newUserData = req.body;
    try {
      const user = await User.findByIdAndUpdate(userId, newUserData, {
        new: true,
      });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating user" });
    }
  }

  async deleteUser(req, res) {
    const userId = req.params.id;
    try {
      const user = await User.findByIdAndDelete(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Delete the user's profile
      await Profile.findOneAndDelete({ user: userId });

      // Delete the user's bids
      await Bid.deleteMany({ employee: userId });

      // Remove the user from the employees array in all WorkSlots
      await WorkSlot.updateMany({}, { $pull: { employees: userId } });

      res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error deleting user" });
    }
  }

  async searchByUsername(req, res) {
    const username = req.params.username;
    try {
      const user = await User.findOne({ username });
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error searching user" });
    }
  }

  async login(req, res) {
    const { username, password } = req.body;
    try {
      const user = await User.findOne({ username: username }).populate("role");

      if (!user) {
        return res
          .status(404)
          .json({ error: "User not found!", message: "User not found!" });
      }

      if (user.password !== password) {
        return res.status(400).json({
          error: "Incorrect password!",
          message: "Incorrect password!",
        });
      }

      // Structure the role field as an array with separate objects for each property
      const userWithRoleDetails = {
        _id: user._id,
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        password: user.password,
        role: user.role
          ? {
              _id: user.role._id,
              role: user.role.role,
              roleDescription: user.role.roleDescription,
            }
          : null,
        shiftsPerWeek: user.shiftsPerWeek,

        __v: user.__v,
      };

      res.status(200).json(userWithRoleDetails);
    } catch (err) {
      console.error(err);
      res.status(500).json({
        error: "Error logging in user!",
        message: "Error logging in user!",
      });
    }
  }

  async changeShiftsPerWeek(req, res) {
    const userId = req.params.id;
    const shiftsPerWeek = req.body.shiftsPerWeek;

    try {
      const user = await User.findByIdAndUpdate(
        userId,
        { shiftsPerWeek },
        { new: true }
      );
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.status(200).json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating shifts per week" });
    }
  }

  async forgotPassword(req, res) {
    // Get user id as the parameter
    const userId = req.params.id;
    // Get new password from request body
    const newPassword = req.body.password;

    try {
      // Check if user exists
      const user = await User.findByIdAndUpdate(
        userId,
        { password: newPassword },
        { new: true }
      );

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      res.status(200).json({ user, message: "Password updated successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error updating password" });
    }
  }

  async getEmployeesByRole(req, res) {
    const role = req.params.role;
    try {
      const users = await User.find({ role: role }).populate("role").exec();
      if (!users) {
        return res.status(404).json({ error: "Employees not found" });
      }
      res.status(200).json(users);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Error retrieving employees" });
    }
  }

  async searchByName(req, res) {
    try {
      const users = await User.find();
      const filteredUsers = users.filter((user) =>
        user.firstName.toLowerCase().includes(req.query.firstName.toLowerCase())
      );
      res.json(filteredUsers);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

module.exports = UserController;
