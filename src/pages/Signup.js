import { useState } from 'react';
import { useSignup } from "../hooks/useSignup";
import { FaUserCircle } from "react-icons/fa"; // profile icon

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null); // store file
  const [preview, setPreview] = useState(null); // store preview URL

  const { signup, isLoading, error } = useSignup();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // send data as FormData
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    formData.append("password", password);
    if (profilePicture) {
      formData.append("profilePicture", profilePicture);
    }

    await signup(formData); // modify signup hook to handle FormData
  };

  // handle profile pic select
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      setPreview(URL.createObjectURL(file)); // preview image
    }
  };

  return (
    <form className="signup" onSubmit={handleSubmit}>
      <h3>Sign Up</h3>

      {/* Profile Pic Upload */}
      <div className="profile-pic-wrapper" style={{ textAlign: "center", marginBottom: "1rem" }}>
        <label htmlFor="profilePicInput" style={{ cursor: "pointer" }}>
          {preview ? (
            <img
              src={preview}
              alt="Profile Preview"
              style={{
                width: "100px",
                height: "100px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid #ccc"
              }}
            />
          ) : (
            <FaUserCircle size={100} color="#888" />
          )}
        </label>
        <input
          id="profilePicInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
      </div>

      <label>Username</label>
      <input
        type="text"
        onChange={(e) => setUsername(e.target.value)}
        value={username}
      />

      <label>Email</label>
      <input
        type="email"
        onChange={(e) => setEmail(e.target.value)}
        value={email}
      />

      <label>Password</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        value={password}
      />

      <button className='signup-btn' disabled={isLoading}>Signup</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

export default Signup;
