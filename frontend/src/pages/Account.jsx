import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../components/AuthContext';
import './Account.css';

const Account = () => {
  const { userRole, userEmail } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const displayRole = userRole === 'Customer' ? 'Customer' : 'Employee';

  useEffect(() => {
    const fetchProfileData = async () => {
      // Don't try to fetch if there's no email
      if (!userEmail) {
        setLoading(false);
        setErrorMessage('');
        setProfileData(null);
        return;
      }

      try {
        const response = await fetch(
          `https://coogzoobackend.vercel.app/profile?email=${encodeURIComponent(userEmail)}&type=${encodeURIComponent(displayRole)}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data) {
          throw new Error('No data received from server');
        }

        if (!data.profile) {
          setProfileData(null);
          setErrorMessage('No profile data available');
        } else {
          setProfileData(data.profile);
          setErrorMessage('');
        }
      } catch (error) {
        console.error('Profile fetch error:', error);
        setErrorMessage(error.message || 'Failed to fetch profile data');
        setProfileData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [userEmail, displayRole]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Not available';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Invalid date';
    }
  };

  const renderDashboardButtons = () => {
    const buttons = [];
    
    if (displayRole === 'Employee') {
      buttons.push(
        <Link key="employee" to="/employee-dashboard" className="dashboard-btn">
          Employee Dashboard
        </Link>
      );
    }
    
    if (userRole === 'Manager') {
      buttons.push(
        <Link key="manager" to="/manager-dashboard" className="dashboard-btn">
          Manager Dashboard
        </Link>
      );
    }
    
    return buttons.length > 0 ? <div className="account-header">{buttons}</div> : null;
  };

  if (loading) {
    return (
      <div className="account-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const renderProfileContent = () => {
    if (errorMessage) {
      return <div className="error-message">{errorMessage}</div>;
    }

    if (!profileData) {
      return <div className="no-data">No profile data available</div>;
    }

    return (
      <>
        <div className="profile-field">
          <label>ID:</label>
          <span>{profileData.ID || 'Not available'}</span>
        </div>
        <div className="profile-field">
          <label>First Name:</label>
          <span>{profileData.First_Name || 'Not available'}</span>
        </div>
        <div className="profile-field">
          <label>Last Name:</label>
          <span>{profileData.Last_Name || 'Not available'}</span>
        </div>
        <div className="profile-field">
          <label>Email:</label>
          <span>{profileData.email || 'Not available'}</span>
        </div>
        <div className="profile-field">
          <label>Phone:</label>
          <span>{profileData.phone || 'Not available'}</span>
        </div>
        <div className="profile-field">
          <label>Date of Birth:</label>
          <span>{formatDate(profileData.DateOfBirth)}</span>
        </div>
      </>
    );
  };

  return (
    <div className="account-container">
      <div className="role-display">
        <h2>User Role: {userRole || 'No role assigned'}</h2>
      </div>

      {renderDashboardButtons()}

      <div className="account-section">
        <h2>Profile Information</h2>
        {renderProfileContent()}
      </div>
    </div>
  );
};

export default Account;