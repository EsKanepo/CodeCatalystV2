import React, { useState, useEffect } from 'react';
import './ProgressTracker.css';

const ProgressTracker = ({ courseId, courseTitle, totalLessons, completedLessons = 0 }) => {
  const [progress, setProgress] = useState(0);
  const [animatedProgress, setAnimatedProgress] = useState(0);

  useEffect(() => {
    const calculatedProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
    setProgress(calculatedProgress);
    
    // Animate progress bar
    const timer = setTimeout(() => {
      setAnimatedProgress(calculatedProgress);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [completedLessons, totalLessons]);

  const getProgressColor = (progress) => {
    if (progress < 30) return '#ef4444'; // red
    if (progress < 60) return '#f59e0b'; // yellow
    if (progress < 90) return '#3b82f6'; // blue
    return '#10b981'; // green
  };

  const getProgressLabel = (progress) => {
    if (progress === 0) return 'Belum Dimulai';
    if (progress < 30) return 'Sedang Berjalan';
    if (progress < 60) return 'Sedang Berjalan';
    if (progress < 90) return 'Hampir Selesai';
    if (progress < 100) return 'Hampir Selesai';
    return 'Selesai';
  };

  const progressColor = getProgressColor(progress);
  const progressLabel = getProgressLabel(progress);

  return (
    <div className="progress-tracker">
      <div className="progress-header">
        <h4 className="progress-title">Progress Kursus</h4>
        <div className="progress-stats">
          <span className="progress-percentage">{progress}%</span>
          <span className="progress-lessons">{completedLessons} / {totalLessons} minggu</span>
        </div>
      </div>
      
      <div className="progress-bar-container">
        <div className="progress-bar-bg">
          <div 
            className="progress-bar-fill"
            style={{ 
              width: `${animatedProgress}%`,
              backgroundColor: progressColor
            }}
          ></div>
        </div>
        <div className="progress-markers">
          <div className="marker" style={{ left: '0%' }}>0%</div>
          <div className="marker" style={{ left: '25%' }}>25%</div>
          <div className="marker" style={{ left: '50%' }}>50%</div>
          <div className="marker" style={{ left: '75%' }}>75%</div>
          <div className="marker" style={{ left: '100%' }}>100%</div>
        </div>
      </div>
      
      <div className="progress-info">
        <div className="progress-label" style={{ color: progressColor }}>
          {progressLabel}
        </div>
        <div className="progress-details">
          <div className="progress-milestone">
            <div className={`milestone-icon ${progress >= 25 ? 'completed' : ''}`}>
              <i className="fas fa-play"></i>
            </div>
            <span>Mulai</span>
          </div>
          <div className="progress-milestone">
            <div className={`milestone-icon ${progress >= 50 ? 'completed' : ''}`}>
              <i className="fas fa-half"></i>
            </div>
            <span>50%</span>
          </div>
          <div className="progress-milestone">
            <div className={`milestone-icon ${progress >= 75 ? 'completed' : ''}`}>
              <i className="fas fa-three-quarters"></i>
            </div>
            <span>75%</span>
          </div>
          <div className="progress-milestone">
            <div className={`milestone-icon ${progress >= 100 ? 'completed' : ''}`}>
              <i className="fas fa-check"></i>
            </div>
            <span>Selesai</span>
          </div>
        </div>
      </div>

      {progress > 0 && progress < 100 && (
        <div className="progress-encouragement">
          <p>
            <i className="fas fa-fire me-2"></i>
            Tetap semangat! Anda sudah menyelesaikan {progress}% kursus.
          </p>
        </div>
      )}

      {progress === 100 && (
        <div className="progress-congratulations">
          <div className="congratulations-icon">
            <i className="fas fa-trophy"></i>
          </div>
          <div className="congratulations-text">
            <h5>Selamat! 🎉</h5>
            <p>Anda telah menyelesaikan kursus "{courseTitle}"</p>
            <button className="btn btn-primary btn-sm">
              <i className="fas fa-download me-2"></i>
              Download Sertifikat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProgressTracker;
