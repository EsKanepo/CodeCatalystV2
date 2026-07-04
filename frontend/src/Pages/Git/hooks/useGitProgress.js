import { useEffect, useState } from 'react';
import { api } from '../../../api/client';
import { useAuth } from '../../../context/AuthContext';

const TOTAL_WEEKS = 3; // Git = 3 minggu
const COURSE_ID = 9; // Git & GitHub Mastery

export const useGitProgress = () => {
  const [completedSections, setCompletedSections] = useState(Array(TOTAL_WEEKS).fill(false));
  const [isLoaded, setIsLoaded] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const fetchProgress = async () => {
      setCompletedSections(Array(TOTAL_WEEKS).fill(false));
      setIsLoaded(false);

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

            setCompletedSections(normalized);
          } else {
            setCompletedSections(Array(TOTAL_WEEKS).fill(false));
          }
        }
      } catch (error) {
        console.log('API error fetching Git progress:', error);
        setCompletedSections(Array(TOTAL_WEEKS).fill(false));
      } finally {
        setIsLoaded(true);
      }
    };

    fetchProgress();
  }, [user]);

  const saveProgressToDb = async (newCompletedSections) => {
    if (!user) return;

    try {
      const completedCount = newCompletedSections.filter(Boolean).length;
      const completedLessonsArray = newCompletedSections
        .map((val, index) => (val ? index : null))
        .filter((v) => v !== null);

      await api.put(`/courses/${COURSE_ID}/progress`, {
        completedLessons: Number(completedCount),
        completedLessonsArray,
        moduleId: 9
      });
    } catch (error) {
      console.error('Failed to save Git progress to DB:', error);
    }
  };

  const toggleSection = (index) => {
    setCompletedSections((prev) => {
      const next = [...prev];
      next[index] = !next[index];

      if (isLoaded) {
        saveProgressToDb(next);
      }

      return next;
    });
  };

  const resetProgress = async () => {
    const resetData = Array(TOTAL_WEEKS).fill(false);
    setCompletedSections(resetData);
    if (isLoaded) {
      await saveProgressToDb(resetData);
    }
  };

  return { completedSections, toggleSection, resetProgress };
};
