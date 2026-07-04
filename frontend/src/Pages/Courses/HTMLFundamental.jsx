import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import ProgressTracker from './components/ProgressTracker';
import { api } from '../../api/client';
import './HTMLFundamental.css';

const HTMLFundamental = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Mock course data - modules = jumlah minggu, lessons = jumlah total video
  const courseData = {
    id: 1,
    title: "HTML Fundamental",
    description: "Pelajari dasar-dasar HTML5 dari struktur dokumen hingga semantic elements",
    totalLessons: 8, // jumlah minggu/modules
    totalVideos: 48, // jumlah total video/lessons
    modules: 8, // jumlah minggu = totalLessons
    instructor: "Nicholian Tjuarsa",
    duration: "8 minggu"
  };

  const [completedLessons, setCompletedLessons] = useState(0);
  const [currentModule, setCurrentModule] = useState(1);
  const [modules, setModules] = useState([
    { id: 1, title: "Pengenalan HTML", completed: false },
    { id: 2, title: "Struktur Dokumen", completed: false },
    { id: 3, title: "Text & Formatting", completed: false },
    { id: 4, title: "Links & Navigation", completed: false },
    { id: 5, title: "Images & Media", completed: false },
    { id: 6, title: "Tables", completed: false },
    { id: 7, title: "Forms", completed: false },
    { id: 8, title: "Semantic HTML", completed: false }
  ]);

  useEffect(() => {
    const fetchProgress = async () => {
      if (!user) return;
      try {
        const response = await api.get(`/courses/${courseData.id}/progress`);
        if (response.data.success && response.data.data) {
          const progressData = response.data.data;
          setCompletedLessons(progressData.completed_lessons || 0);
          
          // Parse completed_lessons_data to mark modules as completed
          if (progressData.completed_lessons_data) {
            const completedInfo = typeof progressData.completed_lessons_data === 'string' 
              ? JSON.parse(progressData.completed_lessons_data) 
              : progressData.completed_lessons_data;
              
            setModules(prev => prev.map(m => {
              const isCompleted = completedInfo.some(info => info.moduleId === m.id);
              return { ...m, completed: isCompleted };
            }));
            
            // Set current module to the first uncompleted one
            const nextModule = modules.find(m => !completedInfo.some(info => info.moduleId === m.id));
            if (nextModule) setCurrentModule(nextModule.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch progress:", error);
      }
    };
    fetchProgress();
  }, [user]);

  const handleLessonClick = (moduleId, lessonId) => {
    // Navigate to lesson detail
    navigate(`/courses/html/module/${moduleId}/lesson/${lessonId}`);
  };

  const handleModuleComplete = async (moduleId) => {
    if (!user) {
      alert("Silakan login untuk menyimpan progress.");
      return;
    }

    const moduleObj = modules.find(m => m.id === moduleId);
    if (!moduleObj || moduleObj.completed) return;

    // Count completed weeks
    const newCompletedLessons = modules.filter(m => m.completed).length + 1;

    // Optimistic UI Update
    setModules(prev => prev.map(m =>
      m.id === moduleId ? { ...m, completed: true } : m
    ));
    setCompletedLessons(newCompletedLessons);
    setCurrentModule(moduleId + 1);

    try {
      // Send progress to database
      await api.put(`/courses/${courseData.id}/progress`, {
        completedLessons: newCompletedLessons,
        completedLessonsArray: modules.filter(m => m.completed).map((_, idx) => idx),
        moduleId: moduleId
      });
    } catch (error) {
      console.error("Failed to update progress:", error);
    }
  };

  return (
    <div className="html-fundamental-page">
      <div className="course-header">
        <div className="container">
          <div className="course-breadcrumb">
            <span onClick={() => navigate('/courses')}>Kursus</span>
            <i className="fas fa-chevron-right"></i>
            <span>HTML Fundamental</span>
          </div>
          <div className="course-title-section">
            <h1>HTML Fundamental</h1>
            <p>Pelajari dasar-dasar HTML5 dari struktur dokumen hingga semantic elements</p>
            <div className="course-meta">
              <span><i className="fas fa-user-tie me-2"></i>{courseData.instructor}</span>
              <span><i className="fas fa-clock me-2"></i>{courseData.duration}</span>
              <span><i className="fas fa-book me-2"></i>{courseData.modules} Minggu</span>
            </div>
          </div>
        </div>
      </div>

      <div className="course-content">
        <div className="container">
          <div className="course-layout">
            <div className="course-main">
              <ProgressTracker
                courseId={courseData.id}
                courseTitle={courseData.title}
                totalLessons={courseData.totalLessons}
                completedLessons={completedLessons}
              />

              <div className="course-modules">
                <h2 className="modules-title">Daftar Modul</h2>
                <div className="modules-list">
                  {modules.map((module, index) => (
                    <div 
                      key={module.id} 
                      className={`module-card ${module.completed ? 'completed' : ''} ${index + 1 === currentModule ? 'current' : ''}`}
                    >
                      <div className="module-header">
                        <div className="module-number">Modul {module.id}</div>
                        <div className="module-status">
                          {module.completed && (
                            <i className="fas fa-check-circle completed-icon"></i>
                          )}
                          {index + 1 === currentModule && !module.completed && (
                            <span className="current-badge">Sedang Dipelajari</span>
                          )}
                        </div>
                      </div>
                      <div className="module-content">
                        <h3 className="module-title">{module.title}</h3>
                        {!module.completed && (
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => {
                              handleLessonClick(module.id, 1);
                              handleModuleComplete(module.id);
                            }}
                          >
                            <i className="fas fa-play me-2"></i>
                            Mulai Belajar
                          </button>
                        )}
                        {module.completed && (
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => handleLessonClick(module.id, 1)}
                          >
                            <i className="fas fa-redo me-2"></i>
                            Ulangi Modul
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="course-sidebar">
              <div className="sidebar-card">
                <h3>Ringkasan Progress</h3>
                <div className="progress-summary">
                  <div className="summary-item">
                    <span>Minggu Selesai</span>
                    <span>{completedLessons} / {courseData.totalLessons}</span>
                  </div>
                  <div className="summary-item">
                    <span>Progress Total</span>
                    <span>{Math.round((completedLessons / courseData.totalLessons) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card">
                <h3>Sertifikat</h3>
                <div className="certificate-status">
                  <div className="certificate-icon">
                    <i className="fas fa-certificate"></i>
                  </div>
                  <p>Selesaikan semua minggu untuk mendapatkan sertifikat</p>
                  <div className="certificate-progress">
                    <div className="progress-bar">
                      <div
                        className="progress-fill"
                        style={{ width: `${(completedLessons / courseData.totalLessons) * 100}%` }}
                      ></div>
                    </div>
                    <span>{Math.round((completedLessons / courseData.totalLessons) * 100)}%</span>
                  </div>
                </div>
              </div>

              <div className="sidebar-card">
                <h3>Resources</h3>
                <div className="resources-list">
                  <a href="#" className="resource-item">
                    <i className="fas fa-file-pdf me-2"></i>
                    HTML Cheat Sheet
                  </a>
                  <a href="#" className="resource-item">
                    <i className="fas fa-file-code me-2"></i>
                    Practice Files
                  </a>
                  <a href="#" className="resource-item">
                    <i className="fas fa-link me-2"></i>
                    Useful Links
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HTMLFundamental;
