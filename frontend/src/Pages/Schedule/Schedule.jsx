import React, { useState, useEffect } from "react";
import "./Schedule.css";
import { useAuth } from "../../context/AuthContext";
import { api } from "../../api/client";

const Schedule = () => {
  const { user } = useAuth();
  const [expandedDay, setExpandedDay] = useState("monday"); // Default open Monday
  const [scheduleData, setScheduleData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const response = await api.get('/schedules');
        if (response.data.success) {
          setScheduleData(response.data.data);
          // Set expanded day to the first day that has classes, or default to monday
          const firstActiveDay = response.data.data.find(d => d.classes && d.classes.length > 0);
          if (firstActiveDay) {
            setExpandedDay(firstActiveDay.id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch schedules:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSchedules();
  }, []);

  return (
    <main className="schedule-wrapper">
      <div className="schedule-container">
        
        {/* HERO SECTION */}
        <header className="schedule-hero">
          <div className="hero-content">
            <span className="premium-badge">
              <i className="fas fa-star me-2"></i> Update Terbaru
            </span>
            <h1 className="hero-title">Jadwal Kelas Master</h1>
            <p className="hero-subtitle">
              Pilih hari untuk melihat kelas yang tersedia. Persiapkan diri Anda untuk pengalaman belajar terbaik bersama mentor profesional kami.
            </p>
          </div>
          
          {!user && (
            <div className="hero-promo">
              <div className="promo-glass">
                <div className="promo-icon">
                  <i className="fas fa-gift"></i>
                </div>
                <div className="promo-text">
                  <h3>Promo Akhir Tahun!</h3>
                  <p>Diskon <strong>30%</strong> khusus pendaftaran minggu ini.</p>
                </div>
                <a href="/register" className="btn-promo-action">Ambil Promo</a>
              </div>
            </div>
          )}
        </header>

        {/* MAIN SCHEDULE UI (TABS + CONTENT) */}
        <section className="schedule-interactive">
          {/* Day Selector (Horizontal Tabs) */}
          <div className="day-selector">
            {isLoading ? (
              <div className="text-center w-100 py-3"><i className="fas fa-spinner fa-spin"></i> Memuat Jadwal...</div>
            ) : scheduleData.length === 0 ? (
              <div className="text-center w-100 py-3">Tidak ada jadwal tersedia saat ini.</div>
            ) : (
              scheduleData.map((day) => (
                <button
                  key={day.id}
                  className={`day-tab ${expandedDay === day.id ? 'active' : ''}`}
                  onClick={() => setExpandedDay(day.id)}
                  style={{ '--tab-color': day.color }}
                >
                  <div className="tab-icon">
                    <i className={`fas ${day.icon}`}></i>
                  </div>
                  <span className="tab-name">{day.day}</span>
                  {expandedDay === day.id && <div className="tab-indicator"></div>}
                </button>
              ))
            )}
          </div>

          {/* Active Day Content */}
          <div className="active-day-content">
            {scheduleData.map((day) => (
              <div 
                key={`content-${day.id}`} 
                className={`day-panel ${expandedDay === day.id ? 'active-panel' : ''}`}
              >
                {expandedDay === day.id && (
                  <div className="class-cards-container">
                    <h2 className="panel-title" style={{ color: day.color }}>
                      Kelas Hari {day.day}
                    </h2>
                    
                    {day.classes && day.classes.length > 0 ? (
                      day.classes.map((classItem, index) => (
                        <div className="premium-class-card" key={index}>
                          <div className="card-left" style={{ borderColor: day.color }}>
                            <div className="time-block" style={{ backgroundColor: `${day.color}15`, color: day.color }}>
                              <i className="fas fa-clock"></i>
                              <span>{classItem.time}</span>
                            </div>
                            <h3 className="class-name">{classItem.name}</h3>
                            
                            <div className="class-pills">
                              <span className="pill pill-level">
                                <i className="fas fa-layer-group"></i> {classItem.level}
                              </span>
                              <span className="pill pill-room">
                                <i className="fas fa-door-open"></i> {classItem.room}
                              </span>
                              <span className="pill pill-duration">
                                <i className="fas fa-hourglass-half"></i> {classItem.duration}
                              </span>
                            </div>
                          </div>

                          <div className="card-divider"></div>

                          <div className="card-right tutor-section">
                            <p className="tutor-label">Dibimbing oleh:</p>
                            <div className="tutor-profile">
                              <div className="tutor-avatar-lg" style={{ backgroundColor: day.color }}>
                                <i className="fas fa-user-tie"></i>
                              </div>
                              <div className="tutor-info">
                                <h4>{classItem.tutor}</h4>
                                <a href={`/tutor#${classItem.tutorId}`} className="tutor-link-btn" style={{ color: day.color }}>
                                  Lihat Profil <i className="fas fa-arrow-right"></i>
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-5 text-muted">
                        <i className="fas fa-calendar-times fs-1 mb-3 opacity-50"></i>
                        <p>Tidak ada kelas yang dijadwalkan untuk hari ini.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM RESOURCES (Replacing Sidebar) */}
        <section className="schedule-resources">
          <div className="resource-grid">
            <div className="resource-card">
              <div className="rc-icon"><i className="fas fa-link"></i></div>
              <h3>Navigasi Cepat</h3>
              <div className="rc-links">
                <a href="/"><i className="fas fa-home"></i> Beranda</a>
                <a href="/tutor"><i className="fas fa-chalkboard-teacher"></i> Tutor</a>
                <a href="/courses"><i className="fas fa-book"></i> Semua Kursus</a>
              </div>
            </div>

            <div className="resource-card">
              <div className="rc-icon"><i className="fas fa-graduation-cap"></i></div>
              <h3>Sumber Belajar</h3>
              <div className="rc-links">
                <a href="https://developer.mozilla.org" target="_blank" rel="noreferrer"><i className="fab fa-firefox"></i> MDN Web Docs</a>
                <a href="https://www.w3schools.com" target="_blank" rel="noreferrer"><i className="fas fa-code"></i> W3Schools</a>
                <a href="https://github.com" target="_blank" rel="noreferrer"><i className="fab fa-github"></i> GitHub</a>
              </div>
            </div>

            <div className="resource-card highlight-card">
              <div className="rc-icon"><i className="fas fa-headset"></i></div>
              <h3>Butuh Bantuan?</h3>
              <p>Tim support kami siap membantu Anda 24/7 untuk masalah pendaftaran dan jadwal.</p>
              <div className="rc-contact">
                <span><i className="fas fa-envelope"></i> support@codecatalyst.com</span>
                <span><i className="fas fa-phone"></i> +62 812-3456-7890</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
};

export default Schedule;
