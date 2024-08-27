import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  Navigate,
} from "react-router-dom";
import React, { useState, useEffect } from "react";
// Common
import { Toastify } from "./components/Common/Toastify";
import { NavbarComponent } from "./components/Common/Navigation";
import { Home } from "./components/Home";
// User Management
import { CreateUser } from "./components/Admin/CreateUser";
import { ViewUsers } from "./components/Admin/ViewUsers";
import { EditUser } from "./components/Admin/EditUser";
import { Login } from "./components/Login";
import { ViewUser } from "./components/Admin/ViewUser";
import { ForgetPassword } from "./components/ForgetPassword";
import { Settings } from "./components/Employee/Settings";
import { UpdateWorkslotsPerWeek } from "./components/Employee/UpdateWorkslotsPerWeek";

// Profile
import { Profile } from "./components/Employee/Profile";
import { ViewProfiles } from "./components/Admin/ViewProfiles";
import { ViewProfile } from "./components/Admin/ViewProfile";
import { EditProfile } from "./components/Admin/EditProfile";
// Work Slots
import { ViewWorkslots } from "./components/WorkSlot/ViewWorkslots";
import { CreateWorkslot } from "./components/WorkSlot/CreateWorkslot";
import { EditWorkslot } from "./components/WorkSlot/EditWorkslot";
import { ViewWorkslot } from "./components/WorkSlot/ViewWorkslot";
import { StaffWorkslots } from "./components/WorkSlot/StaffWorkslots";

function App() {
  const [activeUser, setActiveUser] = useState({});
  const [activeUserRole, setActiveUserRole] = useState("");

  useEffect(() => {
    if (localStorage.getItem("user")) {
      const user = JSON.parse(localStorage.getItem("user"));
      setActiveUser(user);
      if (user.role) {
        setActiveUserRole(user.role.role);
      }
    }
  }, []);

  return (
    <Router>
      <Toastify />
      <NavbarComponent />
      <Routes>
        {Object.keys(activeUser).length > 0 ? (
          <>
            <Route path="/" element={<Home />} />
            {activeUserRole === "Admin" && (
              <>
                <Route path="/admin/register" element={<CreateUser />} />
                <Route path="/admin/users" element={<ViewUsers />} />
                <Route path="/admin/user/:id" element={<ViewUser />} />
                <Route path="/admin/user/:id/edit" element={<EditUser />} />
                <Route path="/admin/profiles" element={<ViewProfiles />} />
                <Route path="/admin/profile/:id" element={<ViewProfile />} />
                <Route
                  path="/admin/profile/:id/edit"
                  element={<EditProfile />}
                />
              </>
            )}
            {activeUserRole === "Manager" && (
              <Route path="/workslot/:id" element={<ViewWorkslot />} />
            )}
            {activeUserRole === "Owner" && (
              <>
                <Route path="/workslot/create" element={<CreateWorkslot />} />
                <Route path="/workslot/:id/edit" element={<EditWorkslot />} />
              </>
            )}
            <Route path="/workslots" element={<ViewWorkslots />} />
            <Route path="/workslot/:id" element={<StaffWorkslots />} />
            <Route
              path="/user/update-workslots"
              element={<UpdateWorkslotsPerWeek />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/login" element={<Navigate to="/" />} />
          </>
        ) : Object.keys(activeUser).length === 0 ? (
          <>
            <Route path="/login" element={<Login />} />
            <Route path="/forget-password" element={<ForgetPassword />} />
            <Route path="/*" element={<Navigate to="/login" />} />
          </>
        ) : null}
      </Routes>
    </Router>
  );
}

export default App;
