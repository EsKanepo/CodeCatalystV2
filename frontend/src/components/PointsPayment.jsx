import React, { useState } from 'react';
import { usePoints } from '../context/PointsContext';
import './PointsPayment.css';

const PointsPayment = ({ course, onClose, onSuccess }) => {
  const { userPoints, getCoursePrice, purchaseCourse } = usePoints();
  const [isProcessing, setIsProcessing] = useState(false);

  const coursePrice = getCoursePrice(course.price, course.is_free);
  const canAfford = userPoints >= coursePrice;

  const handlePurchase = async () => {
    if (!canAfford) return;

    setIsProcessing(true);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    const success = await purchaseCourse(course.id, course.title);

    if (success) {
      onSuccess();
      onClose();
    } else {
      alert('❌ Payment failed. Please try again.');
    }

    setIsProcessing(false);
  };

  return (
    <div className="points-payment-overlay">
      <div className="points-payment-modal">
        <div className="payment-header">
          <h3>
            <i className="fa-solid fa-coins text-warning me-2"></i>
            Purchase with CodePoints
          </h3>
          <button className="close-btn" onClick={onClose}>
            <i className="fa-solid fa-times"></i>
          </button>
        </div>

        <div className="payment-content">
          <div className="course-info">
            <h4>{course.title}</h4>
            <div className="course-meta">
              <span className="duration">
                <i className="fa-solid fa-clock me-1"></i>
                {course.duration}
              </span>
              <span className="level">
                <i className="fa-solid fa-signal me-1"></i>
                {course.level}
              </span>
            </div>
          </div>

          <div className="payment-details">
            <div className="price-row">
              <span>Course Price:</span>
              <span className="price-points">{coursePrice} CodePoints</span>
            </div>
            <div className="balance-row">
              <span>Your Balance:</span>
              <span className={`balance-amount ${canAfford ? 'positive' : 'negative'}`}>
                {userPoints.toLocaleString()} CodePoints
              </span>
            </div>
            <div className="remaining-row">
              <span>Remaining:</span>
              <span className={`remaining-amount ${canAfford ? 'positive' : 'negative'}`}>
                {(userPoints - coursePrice).toLocaleString()} CodePoints
              </span>
            </div>
          </div>

          {!canAfford && (
            <div className="insufficient-funds">
              <i className="fa-solid fa-exclamation-triangle me-2"></i>
              <span>Insufficient CodePoints! Complete more courses or claim daily bonus.</span>
            </div>
          )}

          <div className="earn-points-tips">
            <h5>How to earn more CodePoints:</h5>
            <ul>
              <li>🎁 Daily login bonus: +50 points</li>
              <li>📚 Complete free courses: +100 points</li>
              <li>🏆 Finish assignments: +20-50 points</li>
              <li>👥 Refer friends: +200 points</li>
            </ul>
          </div>
        </div>

        <div className="payment-actions">
          <button 
            className="btn btn-secondary" 
            onClick={onClose}
            disabled={isProcessing}
          >
            Cancel
          </button>
          <button 
            className={`btn ${canAfford ? 'btn-primary' : 'btn-disabled'}`}
            onClick={handlePurchase}
            disabled={!canAfford || isProcessing}
          >
            {isProcessing ? (
              <>
                <i className="fa-solid fa-spinner fa-spin me-2"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="fa-solid fa-coins me-2"></i>
                Purchase Course
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PointsPayment;
