import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { formatError } from '../utils/errorHandler';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');
  const [newInterest, setNewInterest] = useState('');
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userData = await getUserProfile();
        setFormData({
          name: userData.name || '',
          email: userData.email || '',
          password: '',
          confirmPassword: '',
          interests: userData.interests || [],
          skills: userData.skills || []
        });
      } catch (error) {
        setMessage({ type: 'error', content: formatError(error) });
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const addSkill = () => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData({
        ...formData,
        skills: [...formData.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData({
      ...formData,
      skills: formData.skills.filter(skill => skill !== skillToRemove)
    });
  };

  const addInterest = () => {
    if (newInterest.trim() && !formData.interests.includes(newInterest.trim())) {
      setFormData({
        ...formData,
        interests: [...formData.interests, newInterest.trim()]
      });
      setNewInterest('');
    }
  };

  const removeInterest = (interestToRemove) => {
    setFormData({
      ...formData,
      interests: formData.interests.filter(interest => interest !== interestToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', content: '' });

    // Validation
    if (formData.password && formData.password !== formData.confirmPassword) {
      setMessage({ type: 'error', content: 'Passwords do not match' });
      return;
    }

    try {
      const updateData = {
        name: formData.name,
        interests: formData.interests,
        skills: formData.skills
      };

      // Only include password if user wants to update it
      if (formData.password) {
        updateData.password = formData.password;
      }

      const updatedUser = await updateUserProfile(updateData);
      updateUser(updatedUser);
      setMessage({ type: 'success', content: 'Profile updated successfully' });
      
      // Clear password fields after successful update
      setFormData({
        ...formData,
        password: '',
        confirmPassword: ''
      });
    } catch (error) {
      setMessage({ type: 'error', content: formatError(error) });
    }
  };

  if (loading) {
    return <div className="loading">Loading profile...</div>;
  }

  return (
    <div className="profile-page">
      <h2>Your Profile</h2>
      
      {message.content && (
        <div className={`message ${message.type}`}>
          {message.content}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="form-section">
          <h3>Personal Information</h3>
          
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              disabled
            />
            <small>Email cannot be changed</small>
          </div>
        </div>
        
        <div className="form-section">
          <h3>Change Password</h3>
          
          <div className="form-group">
            <label htmlFor="password">New Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
            />
            <small>Leave blank if you don't want to change</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </div>
        
        <div className="form-section">
          <h3>Skills</h3>
          
          <div className="tag-input">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              placeholder="Add a skill"
            />
            <button 
              type="button" 
              onClick={addSkill}
              className="btn btn-small"
            >
              Add
            </button>
          </div>
          
          <div className="tags">
            {formData.skills.map((skill, index) => (
              <div key={index} className="tag">
                {skill}
                <button 
                  type="button" 
                  onClick={() => removeSkill(skill)}
                  className="tag-remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <div className="form-section">
          <h3>Interests</h3>
          
          <div className="tag-input">
            <input
              type="text"
              value={newInterest}
              onChange={(e) => setNewInterest(e.target.value)}
              placeholder="Add an interest"
            />
            <button 
              type="button" 
              onClick={addInterest}
              className="btn btn-small"
            >
              Add
            </button>
          </div>
          
          <div className="tags">
            {formData.interests.map((interest, index) => (
              <div key={index} className="tag">
                {interest}
                <button 
                  type="button" 
                  onClick={() => removeInterest(interest)}
                  className="tag-remove"
                >
                  &times;
                </button>
              </div>
            ))}
          </div>
        </div>
        
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </form>
    </div>
  );
};

export default Profile;