import { useState, useEffect } from "react";
import "./Profile.css";
import { FaEdit, FaCamera } from "react-icons/fa";

const Profile = ({ profile, setProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    bio: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState(""); // ✅ Success/error message

  // ✅ Keep formData in sync with profile data
  useEffect(() => {
    if (profile) {
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  // Toggle edit mode
  const handleEdit = () => {
    if (!isEditing) {
      // entering edit mode → reset fields to current profile
      setFormData({
        username: profile.username || "",
        email: profile.email || "",
        bio: profile.bio || "",
      });
    }
    setIsEditing(!isEditing);
    setMessage(""); // clear message when toggling
  };

  // Handle text changes
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle picture selection
  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  // Save profile (fields + optional picture)
  const handleSave = async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const data = new FormData();

    if (formData.username) data.append("username", formData.username);
    if (formData.email) data.append("email", formData.email);
    if (formData.bio) data.append("bio", formData.bio);
    if (selectedFile) data.append("profilePicture", selectedFile);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
        body: data, // FormData allows file + text
      });

      const updated = await res.json();
      if (res.ok) {
        setProfile(updated);
        setMessage("✅ Profile updated successfully!");
        setTimeout(() => {
          setIsEditing(false); // exit edit mode after 2s
          setMessage("");
        }, 2000);
        setSelectedFile(null);
      } else {
        setMessage(updated.error || "❌ Failed to update profile");
      }
    } catch (err) {
      console.error("Profile update failed:", err);
      setMessage("❌ Something went wrong");
    }
  };

  if (!profile) return null;

  return (
    <div className="user-info" style={{ marginBottom: "20px", textAlign: "center" }}>
      {/* Profile Picture */}
      {profile.profilePicture ? (
        <img
          src={`http://localhost:5000${profile.profilePicture}`}
          alt={`${profile.username}'s profile`}
          className="profile-picture"
          onError={(e) => (e.target.style.display = "none")}
        />
      ) : (
        <div className="profile-picture placeholder">
          {profile.username?.charAt(0).toUpperCase()}
        </div>
      )}

      {isEditing ? (
        <div className="edit-form">
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Username"
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
          />
          <textarea
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            placeholder="Bio"
          />
          <label className="new_profilepic">
            <FaCamera /> Choose Picture
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleFileChange} />
          </label>
          <div className="edit-buttons">
            <button className="save-btn" onClick={handleSave}>Save</button>
            <button className="cancel-btn" onClick={handleEdit}>Cancel</button>
          </div>
          {/* ✅ Success/Error message */}
          {message && <p className="status-msg">{message}</p>}
        </div>
      ) : (
        <>
          <h2>{profile.username}'s Profile</h2>
          <p><strong>Email:</strong> {profile.email}</p>
          {profile.bio && <p><strong>Bio:</strong> {profile.bio}</p>}

          {/* ✅ Success message after save */}
          {message && <p className="status-msg">{message}</p>}
        </>
      )}

      {/* Action buttons */}
      {!isEditing && (
        <div className="action-btns">
          <button className="edit_profile" onClick={handleEdit}>
            <FaEdit /> Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};

export default Profile;
