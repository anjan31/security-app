import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fbase from "../config/Firebase";
import './settings.css';

function Settings() {
  const navigate = useNavigate();
  const currentUser = fbase.auth.currentUser;
  const [newPassword, setNewPassword] = useState('');


  const handleSubmit = (e) => {
    e.preventDefault();
    currentUser.updatePassword(newPassword)
      .then(() => {
        alert('Password updated successfully!');
        navigate('/pastvideos');
      })
      .catch((error) => {
        console.error(error);
        alert('Error updating password');
      });
  };

  return (
    <div className="container">
      <form className="settings-form" onSubmit={handleSubmit}>
        <h2>Account Settings</h2>
        <div className="form-group">
          <label>Email:</label>
          <p>{currentUser.email}</p>
        </div>
        <div className="form-group">
          <label>New Password:</label>
          <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
}

export default Settings;
