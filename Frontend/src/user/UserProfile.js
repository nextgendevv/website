import React, { useState, useEffect } from "react";
import UserSidebar from "./UserSidebar";
import "../styles/UserProfile.css";
import API_BASE_URL from "../config";

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const [profilePicturePreview, setProfilePicturePreview] = useState(null);
  const [passwordData, setPasswordData] = useState({
    current: "",
    newPass: "",
    confirmPass: "",
  });

  const token = localStorage.getItem("authToken");

  useEffect(() => {
    if (!token) {
      window.location.href = "/signin";
      return;
    }

    const fetchProfile = async () => {
      try {
        console.log("Fetching profile for token:", token.substring(0, 10) + "...");
        const resp = await fetch(`${API_BASE_URL}/api/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await resp.json();
        console.log("Profile response received:", data);

        // Resilient handler: Use data.user if wrapped, else use data directly if it looks like a user object
        if (data.success && data.user) {
          setUser(data.user);
        } else if (data._id) {
          // Fallback for cases where backend returns the user object directly
          setUser(data);
        } else {
          setError(data.message || "Invalid profile data received");
          if (resp.status === 401) window.location.href = "/signin";
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
        setError("Network error: Could not connect to backend server.");
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [token]);

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePicturePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const formData = new FormData();
      formData.append("fullname", user.fullname);
      formData.append("email", user.email);
      formData.append("phone", user.phone);
      formData.append("country", user.country || "");

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const resp = await fetch(`${API_BASE_URL}/api/user/profile`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await resp.json();
      if (data.success) {
        alert("Profile updated!");
        setIsEditing(false);
        setProfilePicture(null);
        setProfilePicturePreview(null);
        // Refresh profile data
        if (data.user) {
          setUser(data.user);
        }
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      alert("Error saving profile");
    }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPass !== passwordData.confirmPass) {
      alert("Passwords do not match");
      return;
    }

    try {
      const resp = await fetch(`${API_BASE_URL}/api/user/change-password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          current: passwordData.current,
          newPass: passwordData.newPass,
        }),
      });

      const data = await resp.json();
      if (data.success) {
        alert("Password updated!");
        setPasswordMode(false);
        setPasswordData({ current: "", newPass: "", confirmPass: "" });
      } else {
        alert(data.message || "Update failed");
      }
    } catch (err) {
      alert("Error updating password");
    }
  };

  if (loading) return (
    <div className="profile-layout">
      <UserSidebar />
      <div className="loading-screen">
        <div className="loader-box">
          <p>Loading Profile...</p>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div className="profile-layout">
      <UserSidebar />
      <div className="loading-screen error-state">
        <div className="error-box">
          <h2>Oops!</h2>
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    </div>
  );

  if (!user) return null;

  return (
    <div className="profile-layout">
      <UserSidebar />

      <div className="profile-container">
        <div className="profile-top">
          <h1>Account Settings</h1>
          <div className="profile-header-actions">
            <div className="avatar-container">
              <img
                src={profilePicturePreview || user.profilePicture || "https://i.imgur.com/FcJbM8Z.png"}
                alt="Avatar"
                className="avatar"
              />
              {isEditing && (
                <label className="avatar-upload-label">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                    className="avatar-upload-input"
                  />
                  <span className="upload-icon">📷</span>
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="profile-body">
          <div className="right-box glass-card">
            {!passwordMode ? (
              <>
                <div className="input-block">
                  <label>Full Name</label>
                  <input
                    disabled={!isEditing}
                    value={user.fullname || ""}
                    onChange={(e) => setUser({ ...user, fullname: e.target.value })}
                  />
                </div>

                <div className="input-block">
                  <label>Email Address</label>
                  <input
                    disabled={!isEditing}
                    value={user.email || ""}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                  />
                </div>

                <div className="input-block">
                  <label>Phone Number</label>
                  <input
                    disabled={!isEditing}
                    value={user.phone || ""}
                    placeholder="Enter phone number"
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                  />
                </div>

                <div className="input-block">
                  <label>User Code (Referral ID)</label>
                  <input value={user.userCode || "N/A"} readOnly className="readonly-input" />
                </div>

                <div className="profile-actions">
                  {isEditing ? (
                    <button className="save-btn" onClick={handleSaveProfile}>SAVE CHANGES</button>
                  ) : (
                    <button className="save-btn" onClick={() => setIsEditing(true)}>EDIT PROFILE</button>
                  )}
                  <button className="password-btn" onClick={() => setPasswordMode(true)}>CHANGE PASSWORD</button>
                </div>
              </>
            ) : (
              /* PASSWORD CHANGE MODE */
              <div className="password-change-form">
                <h3>Change Password</h3>
                <div className="input-block">
                  <label>Current Password</label>
                  <input
                    type="password"
                    value={passwordData.current}
                    onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })}
                  />
                </div>
                <div className="input-block">
                  <label>New Password</label>
                  <input
                    type="password"
                    value={passwordData.newPass}
                    onChange={(e) => setPasswordData({ ...passwordData, newPass: e.target.value })}
                  />
                </div>
                <div className="input-block">
                  <label>Confirm New Password</label>
                  <input
                    type="password"
                    value={passwordData.confirmPass}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPass: e.target.value })}
                  />
                </div>
                <div className="profile-actions">
                  <button className="save-btn" onClick={handlePasswordChange}>UPDATE PASSWORD</button>
                  <button className="password-btn" onClick={() => setPasswordMode(false)}>CANCEL</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
