import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";
import { useNavigate, Link } from 'react-router-dom';
import { useVueProgress } from './hooks/useVueProgress';
import './Vue.css';

const Vue = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();
  const { completedSections, toggleSection, resetProgress } = useVueProgress();

  // Course ID for Vue.js Frontend is 7 according to schema.sql
  const courseId = 7;
  const isEnrolled = isEnrolledInCourse(courseId);
  const isPremiumOrAdmin = user?.role === "premium" || user?.role === "admin";
  const hasAccess = isEnrolled || isPremiumOrAdmin;

  useEffect(() => {
    if (!hasAccess) {
      alert("Kursus ini premium! Silakan beli kursus ini terlebih dahulu.");
      navigate("/courses");
    }
  }, [hasAccess, navigate]);

  if (!hasAccess) return null;

  return (
    <>
      <section className="page-header">
        <div className="container">
          <h1>
            <i className="fa-brands fa-vuejs me-2"></i>
            Vue.js Modern Development
          </h1>
          <p className="lead">Framework JavaScript modern untuk membangun UI yang dinamis</p>
        </div>
      </section>

      <section className="py-4">
        <div className="container text-center">
          <Link to="/courses" className="btn btn-outline-primary">
            Kembali ke Courses
          </Link>
        </div>
      </section>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-8">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-solid fa-circle-info me-2"></i>
                  Deskripsi Kursus
                </h3>
                <p className="course-description">
                  Kursus <strong>Vue.js Modern Development</strong> mengajarkan cara membangun aplikasi web frontend yang reaktif
                  menggunakan Vue.js 3. Dari dasar hingga advanced patterns dan best practices.
                </p>
                <p className="course-description">
                  Vue.js adalah framework yang mudah dipelajari namun powerful untuk membuat UI yang interaktif.
                  Pelajari component-based development, state management, dan routing untuk aplikasi production-ready.
                </p>

                <div className="course-info-grid">
                  <div className="info-item">
                    <i className="fa-solid fa-clock"></i>
                    <div>
                      <strong>Durasi</strong>
                      <p>8 Minggu</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-signal"></i>
                    <div>
                      <strong>Level</strong>
                      <p>Menengah</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-users"></i>
                    <div>
                      <strong>Peserta</strong>
                      <p>Maksimal 25 orang</p>
                    </div>
                  </div>
                  <div className="info-item">
                    <i className="fa-solid fa-certificate"></i>
                    <div>
                      <strong>Sertifikat</strong>
                      <p>Ya, tersedia</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="content-card mt-4">
                <h3 className="card-title">
                  <i className="fa-solid fa-list-check me-2"></i>
                  Topik Per Minggu
                </h3>
                <ul className="topic-list">
                  {[
                    { week: 1, title: "Vue.js Fundamentals", topics: ["Vue 3 setup dan Composition API", "Template syntax dan directives", "Reactivity system", "Lifecycle hooks"] },
                    { week: 2, title: "Components & Props", topics: ["Component structure", "Props dan emit", "Slot dan named slots", "Component composition"] },
                    { week: 3, title: "State Management", topics: ["Data dan computed properties", "Watch dan watchers", "Pinia store basics", "Global state management"] },
                    { week: 4, title: "Forms & Validation", topics: ["Form binding v-model", "Form submission handling", "Input validation", "Error handling"] },
                    { week: 5, title: "Vue Router", topics: ["Routing setup dan navigation", "Dynamic routes dan params", "Route guards", "Nested routing"] },
                    { week: 6, title: "API Integration", topics: ["Fetch dan axios setup", "Async data loading", "Error handling", "Loading states"] },
                    { week: 7, title: "Advanced Patterns", topics: ["Composables dan reusability", "Higher-order components", "Plugins creation", "Performance optimization"] },
                    { week: 8, title: "Full App Project", topics: ["Project planning dan setup", "Build complete application", "Testing dan debugging", "Deployment"] }
                  ].map((item, idx) => (
                    <li key={idx} className="topic-item">
                      <div className="topic-header">
                        <span className="week-badge">Minggu {item.week}</span>
                        <h5>
                          <i className="fa-brands fa-vuejs text-success me-2"></i>
                          {item.title}
                        </h5>
                      </div>
                      <ul className="subtopic-list">
                        {item.topics.map((topic, i) => (
                          <li key={i}>{topic}</li>
                        ))}
                      </ul>
                      <button
                        type="button"
                        className={`btn btn-sm mt-2 ${
                          completedSections[idx] ? 'btn-success' : 'btn-outline-success'
                        }`}
                        onClick={() => toggleSection(idx)}
                      >
                        {completedSections[idx] ? 'Selesai' : 'Tandai selesai'}
                      </button>
                    </li>
                  ))}
                </ul>

                <div className="mt-3 d-flex justify-content-center">
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={resetProgress}>
                    Reset progress
                  </button>
                </div>
              </div>
            </div>

            <div className="col-md-4">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-solid fa-chart-simple me-2"></i>
                  Progress Belajar
                </h3>
                <div className="progress mb-3" style={{ height: '25px' }}>
                  <div
                    className="progress-bar bg-success"
                    role="progressbar"
                    style={{ width: `${Math.round((completedSections.filter(Boolean).length / completedSections.length) * 100)}%` }}
                    aria-valuenow={Math.round((completedSections.filter(Boolean).length / completedSections.length) * 100)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {Math.round((completedSections.filter(Boolean).length / completedSections.length) * 100)}%
                  </div>
                </div>
                <p className="text-muted small">
                  <i className="fa-solid fa-check-circle text-success me-1"></i>
                  {completedSections.filter(Boolean).length} dari {completedSections.length} minggu selesai
                </p>
              </div>

              <div className="content-card mt-4">
                <h3 className="card-title">
                  <i className="fa-solid fa-video me-2"></i>
                  Preview Kursus
                </h3>
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src="https://www.youtube.com/embed/Kt2E8nblvXU"
                    title="Vue.js Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial Vue.js untuk modern development
                </p>
              </div>

              {!user && (
                <div className="cta-sidebar mt-4">
                  <h4>
                    <i className="fa-solid fa-rocket me-2"></i>
                    Siap Bergabung?
                  </h4>
                  <p>Daftar sekarang dan kuasai Vue.js!</p>
                  <Link to="/register" className="btn btn-accent btn-lg w-100">
                    <i className="fa-solid fa-user-plus me-2"></i>
                    Daftar Sekarang
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Vue;