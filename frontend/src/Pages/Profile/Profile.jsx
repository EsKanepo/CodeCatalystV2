import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

const Profile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [userCodepoints, setUserCodepoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch user codepoints from database
    const fetchUserCodepoints = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setLoading(false);
          return;
        }

        const response = await fetch('http://localhost:3003/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setUserCodepoints(data.data.userPoint || 500);
        } else {
          // Fallback to localStorage if API fails
          const storedBalance = localStorage.getItem(`userCodepoints_${user?.id}`);
          setUserCodepoints(storedBalance ? parseInt(storedBalance) : 500);
        }
      } catch (error) {
        console.error('Error fetching codepoints:', error);
        // Fallback to localStorage
        const storedBalance = localStorage.getItem(`userCodepoints_${user?.id}`);
        setUserCodepoints(storedBalance ? parseInt(storedBalance) : 500);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchUserCodepoints();
    }
  }, [user]);

  // Listen for codepoints updates from other components
  useEffect(() => {
    const handleCodepointsUpdate = (event) => {
      if (event.detail && event.detail.userId === user?.id) {
        setUserCodepoints(event.detail.newBalance);
      }
    };

    // Listen for custom event
    window.addEventListener('codepointsUpdated', handleCodepointsUpdate);
    
    // Also check localStorage periodically (fallback)
    const interval = setInterval(() => {
      const storedBalance = localStorage.getItem(`userCodepoints_${user?.id}`);
      if (storedBalance) {
        const currentBalance = parseInt(storedBalance);
        if (currentBalance !== userCodepoints) {
          setUserCodepoints(currentBalance);
        }
      }
    }, 1000);

    return () => {
      window.removeEventListener('codepointsUpdated', handleCodepointsUpdate);
      clearInterval(interval);
    };
  }, [user?.id, userCodepoints]);

  return (
    <div className="profile-page">
      <div className="container">
        <div className="profile-header">
          <h1>Profile</h1>
          <p>Kelola informasi akun Anda</p>
        </div>

        <div className="profile-content">
          {/* Codepoints Balance Card */}
          <div className="codepoints-card">
            <div className="card-header">
              <h3>Codepoints Balance</h3>
            </div>
            
            <div className="codepoints-display">
              {loading ? (
                <div className="loading-spinner">
                  <i className="fa-solid fa-spinner fa-spin"></i>
                  <span>Loading...</span>
                </div>
              ) : (
                <div className="codepoints-content">
                  <div className="codepoints-info">
                    <div className="codepoints-amount">
                      <span className="amount">{userCodepoints.toLocaleString()}</span>
                      <span className="currency">CP</span>
                    </div>
                    <div className="codepoints-icon">
                      <i className="fa-solid fa-coins"></i>
                    </div>
                  </div>
                  <button 
                    className="topup-btn"
                    onClick={() => navigate('/topup')}
                  >
                    <i className="fa-solid fa-plus-circle me-2"></i>
                    Topup
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* User Information Box */}
          <div className="profile-info-card">
            <div className="card-header">
              <h3>Informasi Pribadi</h3>
            </div>
            
            <div className="profile-display">
              <div className="info-item">
                <label>Nama Lengkap</label>
                <div className="info-value">
                  <i className="fa-solid fa-user me-2"></i>
                  <span>{user?.name || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <label>Email</label>
                <div className="info-value">
                  <i className="fa-solid fa-envelope me-2"></i>
                  <span>{user?.email || 'N/A'}</span>
                </div>
              </div>

              <div className="info-item">
                <label>Password</label>
                <div className="info-value">
                  <i className="fa-solid fa-lock me-2"></i>
                  <span>••••••••</span>
                </div>
              </div>

              <div className="info-item">
                <label>Role</label>
                <div className="info-value">
                  <i className="fa-solid fa-user-tag me-2"></i>
                  <span>{user?.role || 'student'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
