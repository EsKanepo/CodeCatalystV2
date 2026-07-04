import React, { useState } from 'react';
import { usePoints } from '../context/PointsContext';
import './PointsDisplay.css';

const PointsDisplay = () => {
  const { userPoints, claimDailyBonus, addDemoPoints, referFriend, watchTutorial } = usePoints();
  const [showDemoMenu, setShowDemoMenu] = useState(false);

  const handleClaimBonus = () => {
    const claimed = claimDailyBonus();
    if (claimed) {
      alert('🎉 Daily bonus claimed! +50 points');
    } else {
      alert('⏰ You already claimed your daily bonus today!');
    }
  };

  const handleAddDemoPoints = (amount, reason) => {
    addDemoPoints(amount, reason);
    setShowDemoMenu(false);
    alert(`🎉 Added ${amount} CodePoints for demo: ${reason}`);
  };

  const handleReferFriend = () => {
    referFriend();
    alert('👥 Referred a friend! +200 points');
  };

  const handleWatchTutorial = () => {
    watchTutorial();
    alert('📺 Watched tutorial! +25 points');
  };

  return (
    <div className="points-display">
      <div className="points-info">
        <div className="points-icon">
          <i className="fa-solid fa-coins"></i>
        </div>
        <div className="points-details">
          <div className="points-label">CodePoints Balance</div>
          <div className="points-amount">{userPoints.toLocaleString()}</div>
          <div className="points-status">
            {userPoints >= 1000 ? '✅ Rich!' : userPoints >= 500 ? '💰 Good' : '💸 Need more'}
          </div>
        </div>
      </div>
      
      <div className="points-actions">
        <button className="daily-bonus-btn" onClick={handleClaimBonus}>
          <i className="fa-solid fa-gift"></i>
          Daily Bonus (+50)
        </button>
        
        <div className="demo-dropdown">
          <button className="demo-btn" onClick={() => setShowDemoMenu(!showDemoMenu)}>
            <i className="fa-solid fa-magic"></i>
            Demo Points
          </button>
          
          {showDemoMenu && (
            <div className="demo-menu">
              <div className="demo-menu-title">🎮 Get Points Fast (Demo)</div>
              <button className="demo-option" onClick={() => handleAddDemoPoints(100, 'Small boost')}>
                <i className="fa-solid fa-plus-circle"></i>
                +100 Points
              </button>
              <button className="demo-option" onClick={() => handleAddDemoPoints(250, 'Medium boost')}>
                <i className="fa-solid fa-plus-circle"></i>
                +250 Points
              </button>
              <button className="demo-option" onClick={() => handleAddDemoPoints(500, 'Large boost')}>
                <i className="fa-solid fa-plus-circle"></i>
                +500 Points
              </button>
              <button className="demo-option" onClick={handleReferFriend}>
                <i className="fa-solid fa-user-plus"></i>
                Refer Friend (+200)
              </button>
              <button className="demo-option" onClick={handleWatchTutorial}>
                <i className="fa-solid fa-play-circle"></i>
                Watch Tutorial (+25)
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PointsDisplay;
