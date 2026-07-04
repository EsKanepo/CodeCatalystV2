import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";
import { useNavigate, Link } from 'react-router-dom';
import { useDockerProgress } from './hooks/useDockerProgress';
import './Docker.css';

const Docker = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();
  const { completedSections, toggleSection, resetProgress } = useDockerProgress();

  // Course ID for Docker Containerization is 10 according to schema.sql
  const courseId = 10;
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
            <i className="fa-brands fa-docker me-2"></i>
            Docker Containerization
          </h1>
          <p className="lead">Containerization untuk aplikasi modern</p>
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
                  Kursus <strong>Docker Containerization</strong> mengajarkan cara mem-build, ship, dan run aplikasi
                  dengan Docker containers. Dari basic concepts hingga production deployment.
                </p>
                <p className="course-description">
                  Docker adalah skill essential untuk DevOps dan modern development. Pelajari containerization,
                  orchestration, dan best practices untuk scalable applications.
                </p>

                <div className="course-info-grid">
                  <div className="info-item">
                    <i className="fa-solid fa-clock"></i>
                    <div>
                      <strong>Durasi</strong>
                      <p>4 Minggu</p>
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
                      <p>Maksimal 20 orang</p>
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
                    { week: 1, title: "Docker Fundamentals", topics: ["Container concepts", "Docker installation", "Basic Docker commands", "Images vs Containers"] },
                    { week: 2, title: "Building Images", topics: ["Dockerfile basics", "Multi-stage builds", "Image optimization", "Docker Hub registry"] },
                    { week: 3, title: "Container Networking", topics: ["Network types", "Port mapping", "Service discovery", "Container communication"] },
                    { week: 4, title: "Production Deployment", topics: ["Docker Compose", "Volume management", "Environment variables", "CI/CD integration"] }
                  ].map((item, idx) => (
                    <li key={idx} className="topic-item">
                      <div className="topic-header">
                        <span className="week-badge">Minggu {item.week}</span>
                        <h5>
                          <i className="fa-brands fa-docker me-2"></i>
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
                    src="https://www.youtube.com/embed/3c-iBn73dDE"
                    title="Docker Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial Docker untuk containerization
                </p>
              </div>

              {!user && (
                <div className="cta-sidebar mt-4">
                  <h4>
                    <i className="fa-solid fa-rocket me-2"></i>
                    Siap Bergabung?
                  </h4>
                  <p>Daftar sekarang dan kuasai Docker Containerization!</p>
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

export default Docker;
