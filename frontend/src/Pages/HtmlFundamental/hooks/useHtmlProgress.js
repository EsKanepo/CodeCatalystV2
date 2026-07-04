import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';

const TOTAL_WEEKS = 8;
const COURSE_ID = 1;

export const useHtmlProgress = () => {
  const [completedWeeks, setCompletedWeeks] = useState(Array(TOTAL_WEEKS).fill(false));
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  // 🔥 FETCH dari DB
  useEffect(() => {
    const fetchProgress = async () => {
      // Immediately reset progress when user changes (login/logout/switch user)
      setCompletedWeeks(Array(TOTAL_WEEKS).fill(false));
      setIsLoaded(false);

      // If no user is logged in, just stay reset
      if (!user) {
        setIsLoaded(true);
        return;
      }

      try {
        const response = await api.get(`/courses/${COURSE_ID}/progress`);

        if (response.data.success && response.data.data) {
          const progressData = response.data.data;

          if (progressData.completed_lessons_data) {
            const completedInfo =
              typeof progressData.completed_lessons_data === 'string'
                ? JSON.parse(progressData.completed_lessons_data)
                : progressData.completed_lessons_data;

            const normalized = Array(TOTAL_WEEKS).fill(false);

            completedInfo.forEach((info) => {
              if (info.lessonId >= 0 && info.lessonId < TOTAL_WEEKS) {
                normalized[info.lessonId] = true;
              }
            });

            setCompletedWeeks(normalized);
          } else {
            // No progress data for this user, keep reset
            setCompletedWeeks(Array(TOTAL_WEEKS).fill(false));
          }
        }
      } catch (error) {
        console.log('User might not be logged in or API error:', error);
        // Keep reset on error
        setCompletedWeeks(Array(TOTAL_WEEKS).fill(false));
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProgress();
  }, [user]); // Re-fetch when user changes (login/logout/switch user)

  // 🔥 SAVE ke DB
  const saveProgressToDb = async (newCompletedWeeks) => {
    // Only save if user is logged in
    if (!user) {
      console.log('No user logged in, skipping progress save');
      return;
    }
    
    try {
      const completedCount = newCompletedWeeks.filter(Boolean).length;

      const completedLessonsArray = newCompletedWeeks
        .map((val, index) => (val ? index : null))
        .filter((v) => v !== null);

      await api.put(`/courses/${COURSE_ID}/progress`, {
        completedLessons: Number(completedCount),
        completedLessonsArray,
        moduleId: 1
      });
    } catch (error) {
      console.error('Failed to save progress to DB:', error);
    }
  };

  // 🔥 toggle checkbox
  const toggleWeek = (index) => {
    setCompletedWeeks((prev) => {
      const next = [...prev];
      next[index] = !next[index];

      if (isLoaded) {
        saveProgressToDb(next);
      }

      return next;
    });
  };

  // 🔥 reset
  const resetProgress = () => {
    const emptyWeeks = Array(TOTAL_WEEKS).fill(false);
    setCompletedWeeks(emptyWeeks);

    if (isLoaded) {
      saveProgressToDb(emptyWeeks);
    }
  };

  return { completedWeeks, toggleWeek, resetProgress };
};