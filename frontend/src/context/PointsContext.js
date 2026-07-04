import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { api, paymentAPI } from '../api/client';

const PointsContext = createContext();

export const usePoints = () => {
  const context = useContext(PointsContext);
  if (!context) {
    throw new Error('usePoints must be used within a PointsProvider');
  }
  return context;
};

export const PointsProvider = ({ children }) => {
  const { user, setUser } = useAuth();
  const userId = user?.id || null;
  const [userPoints, setUserPoints] = useState(0);
  const [pointsHistory, setPointsHistory] = useState([]);
  const [isProcessingPurchase, setIsProcessingPurchase] = useState(false);

  const getCoursePrice = (coursePrice, isFree) => {
    if (isFree) return 0;
    if (coursePrice <= 299000) return 100;
    if (coursePrice <= 499000) return 200;
    if (coursePrice <= 699000) return 300;
    if (coursePrice <= 899000) return 400;
    return 500;
  };

  const syncPointsFromServer = useCallback(async () => {
    if (!userId) return;
    try {
      const response = await api.get('/auth/profile');
      const serverPoints = response.data.data.userPoint ?? 0;
      setUserPoints(serverPoints);
      localStorage.setItem(`userPoints_${userId}`, serverPoints.toString());
      localStorage.setItem(`userCodepoints_${userId}`, serverPoints.toString());
    } catch (err) {
      console.error('[POINTS] Failed to sync from server:', err);
    }
  }, [userId]);

  useEffect(() => {
    if (!userId) {
      setUserPoints(0);
      return;
    }

    syncPointsFromServer();

    const savedHistory = localStorage.getItem(`pointsHistory_${userId}`);
    if (savedHistory) {
      setPointsHistory(JSON.parse(savedHistory));
    }

    const handleCodepointsUpdate = (e) => {
      if (e.detail?.userId === userId) {
        setUserPoints(e.detail.newBalance);
      }
    };
    window.addEventListener('codepointsUpdated', handleCodepointsUpdate);
    return () => window.removeEventListener('codepointsUpdated', handleCodepointsUpdate);
  }, [userId, syncPointsFromServer]);

  const saveHistory = (newHistory, newPoints) => {
    setPointsHistory(newHistory);
    setUserPoints(newPoints);
    if (userId) {
      localStorage.setItem(`userPoints_${userId}`, newPoints.toString());
      localStorage.setItem(`userCodepoints_${userId}`, newPoints.toString());
      localStorage.setItem(`pointsHistory_${userId}`, JSON.stringify(newHistory));
    }
  };

  const addPoints = (amount, reason) => {
    const newHistory = [
      ...pointsHistory,
      { id: Date.now(), amount, reason, timestamp: new Date().toISOString(), type: 'earned' }
    ];
    saveHistory(newHistory, userPoints + amount);
  };

  const spendPoints = (amount, reason) => {
    if (userPoints >= amount) {
      const newHistory = [
        ...pointsHistory,
        { id: Date.now(), amount: -amount, reason, timestamp: new Date().toISOString(), type: 'spent' }
      ];
      saveHistory(newHistory, userPoints - amount);
      return true;
    }
    return false;
  };

  const canAffordCourse = (coursePrice, isFree) => {
    const price = getCoursePrice(coursePrice, isFree);
    return userPoints >= price;
  };

  const purchaseCourse = async (courseId, courseTitle, coursePrice = 0, isFree = false) => {
    if (isProcessingPurchase) return false;

    setIsProcessingPurchase(true);
    const price = getCoursePrice(coursePrice, isFree);

    try {
      const response = await paymentAPI.purchaseCourse(courseId);
      const { userPoint, enrolled_courses } = response.data.data;

      setUserPoints(userPoint);
      if (userId) {
        localStorage.setItem(`userPoints_${userId}`, userPoint.toString());
        localStorage.setItem(`userCodepoints_${userId}`, userPoint.toString());
      }

      const newHistory = [
        ...pointsHistory,
        { id: Date.now(), amount: -price, reason: `Pembelian course: ${courseTitle}`, timestamp: new Date().toISOString(), type: 'spent' }
      ];
      setPointsHistory(newHistory);
      if (userId) localStorage.setItem(`pointsHistory_${userId}`, JSON.stringify(newHistory));

      const userStr = localStorage.getItem('cc_user');
      if (userStr) {
        const userData = JSON.parse(userStr);
        userData.enrolled_courses = enrolled_courses || userData.enrolled_courses || [];
        if (!userData.enrolled_courses.includes(courseId)) {
          userData.enrolled_courses.push(courseId);
        }
        localStorage.setItem('cc_user', JSON.stringify(userData));
        setUser(userData);
      }

      const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
      if (!enrolledCourses.includes(courseId)) {
        enrolledCourses.push(courseId);
        localStorage.setItem('enrolledCourses', JSON.stringify(enrolledCourses));
      }

      return true;
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data?.error?.includes('Already enrolled')) {
        return true;
      }
      console.error('[PURCHASE] Failed:', error.response?.data || error.message);
      return false;
    } finally {
      setIsProcessingPurchase(false);
    }
  };

  const topupPoints = async (amount) => {
    const response = await paymentAPI.topup(amount);
    const { userPoint } = response.data.data;
    setUserPoints(userPoint);
    if (userId) {
      localStorage.setItem(`userPoints_${userId}`, userPoint.toString());
      localStorage.setItem(`userCodepoints_${userId}`, userPoint.toString());
    }
    window.dispatchEvent(new CustomEvent('codepointsUpdated', {
      detail: { userId, newBalance: userPoint }
    }));
    return response.data.data;
  };

  const upgradeToPremium = async () => {
    const response = await paymentAPI.upgradePremium();
    const { userPoint, user: updatedUser } = response.data.data;

    setUserPoints(userPoint);
    const userData = updatedUser || { ...user, role: 'premium', userPoint };
    localStorage.setItem('cc_user', JSON.stringify(userData));
    setUser(userData);

    if (userId) {
      localStorage.setItem(`userPoints_${userId}`, userPoint.toString());
    }

    return response.data;
  };

  const claimDailyBonus = () => {
    const lastClaim = localStorage.getItem('lastDailyClaim');
    const today = new Date().toDateString();
    if (lastClaim !== today) {
      addPoints(50, 'Daily login bonus');
      localStorage.setItem('lastDailyClaim', today);
      return true;
    }
    return false;
  };

  const isEnrolledInCourse = (courseId) => {
    if (user?.enrolled_courses?.includes(courseId)) return true;
    const userStr = localStorage.getItem('cc_user');
    if (userStr) {
      const userData = JSON.parse(userStr);
      return userData.enrolled_courses?.includes(courseId);
    }
    const enrolledCourses = JSON.parse(localStorage.getItem('enrolledCourses') || '[]');
    return enrolledCourses.includes(courseId);
  };

  const value = {
    userPoints,
    pointsHistory,
    addPoints,
    spendPoints,
    canAffordCourse,
    getCoursePrice,
    purchaseCourse,
    topupPoints,
    upgradeToPremium,
    syncPointsFromServer,
    claimDailyBonus,
    isEnrolledInCourse,
    isProcessingPurchase
  };

  return (
    <PointsContext.Provider value={value}>
      {children}
    </PointsContext.Provider>
  );
};
