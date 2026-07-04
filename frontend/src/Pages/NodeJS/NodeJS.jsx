import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";
import { useNavigate, Link } from 'react-router-dom';
import './NodeJS.css';
import { useNodeJSProgress } from './hooks/useNodeJSProgress';

const NodeJS = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();
  const { completedSections, toggleSection, resetProgress } = useNodeJSProgress();

  // Course ID for Node.js Backend is 6 according to schema.sql
  const courseId = 6;
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
      {/* header */}
      <section className="page-header">
        <div className="container">
          <h1>
            <i className="fa-brands fa-node-js me-2"></i>
            Node.js Backend Development
          </h1>
          <p className="lead">Membangun server dan aplikasi backend dengan Node.js</p>
        </div>
      </section>

      {/* tombol kembali ke courses */}
      <section className="py-4">
        <div className="container text-center">
          <Link to="/courses" className="btn btn-outline-primary">
            Kembali ke Courses
          </Link>
        </div>
      </section>

      {/* main */}
      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* deskripsi */}
            <div className="col-md-8">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-solid fa-circle-info me-2"></i>
                  Deskripsi Kursus
                </h3>
                <p className="course-description">
                  Kursus <strong>Node.js Backend Development</strong> mengajarkan cara membangun server dan aplikasi backend
                  yang scalable menggunakan Node.js dan Express.js. Dari basic server hingga REST API dengan database integration.
                </p>
                <p className="course-description">
                  Kuasai teknik backend development profesional dengan Node.js. Belajar menangani HTTP requests, manage database,
                  authentication, dan deployment aplikasi backend yang production-ready.
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

              {/* topik */}
              <div className="content-card mt-4">
                <h3 className="card-title">
                  <i className="fa-solid fa-list-check me-2"></i>
                  Topik Per Minggu
                </h3>
                <ul className="topic-list">
                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 1</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Node.js Fundamentals
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Node.js architecture dan event loop</li>
                      <li>CommonJS vs ES Modules</li>
                      <li>NPM dan package management</li>
                      <li>File system dan streams</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[0] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(0)}
                    >
                      {completedSections[0] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 2</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Express.js Framework
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Express.js setup dan routing</li>
                      <li>Request dan response handling</li>
                      <li>Middleware development</li>
                      <li>Error handling best practices</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[1] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(1)}
                    >
                      {completedSections[1] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 3</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Database Integration
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>SQL vs NoSQL databases</li>
                      <li>MySQL dan MongoDB dengan Node.js</li>
                      <li>ORM/ODM (Sequelize, Mongoose)</li>
                      <li>Database migrations dan seeding</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[2] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(2)}
                    >
                      {completedSections[2] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 4</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        REST API Design
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>RESTful API principles dan conventions</li>
                      <li>HTTP methods dan status codes</li>
                      <li>API versioning dan pagination</li>
                      <li>API documentation dengan Swagger</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[3] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(3)}
                    >
                      {completedSections[3] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 5</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Authentication & Authorization
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>JWT (JSON Web Tokens)</li>
                      <li>Password hashing dengan bcrypt</li>
                      <li>Session management</li>
                      <li>OAuth2 integration</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[4] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(4)}
                    >
                      {completedSections[4] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 6</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Async & Caching
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Promises dan async/await patterns</li>
                      <li>Error handling advanced</li>
                      <li>Redis caching implementation</li>
                      <li>Queue dan job processing</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[5] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(5)}
                    >
                      {completedSections[5] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 7</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Testing & Security
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Unit testing dengan Jest dan Mocha</li>
                      <li>Integration testing</li>
                      <li>CORS dan security headers</li>
                      <li>Input validation dan sanitization</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[6] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(6)}
                    >
                      {completedSections[6] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 8</span>
                      <h5>
                        <i className="fa-brands fa-node-js text-success me-2"></i>
                        Deployment & Monitoring
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Environment configuration</li>
                      <li>Docker containerization</li>
                      <li>Deployment ke cloud (Heroku, AWS, etc)</li>
                      <li>Monitoring dan logging</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedSections[7] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleSection(7)}
                    >
                      {completedSections[7] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>
                </ul>

                <div className="mt-3 d-flex justify-content-center">
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={resetProgress}>
                    Reset progress
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <a href="/schedule" className="btn btn-primary btn-lg">
                    <i className="fa-solid fa-calendar-days me-2"></i>
                    Lihat Jadwal Lengkap
                  </a>
                </div>
              </div>
            </div>

            {/* sidebar */}
            <div className="col-md-4">
              {/* Progress Bar */}
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

              {/* video */}
              <div className="content-card mt-4">
                <h3 className="card-title">
                  <i className="fa-solid fa-video me-2"></i>
                  Preview Kursus
                </h3>
                <div className="ratio ratio-16x9 mb-3">
                  <iframe
                    src="https://www.youtube.com/embed/TlB_eWDSMt4"
                    title="Node.js Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial Node.js untuk backend development
                </p>
              </div>

              {/* link */}
              <div className="content-card mt-4">
                <h3 className="card-title">
                  <i className="fa-solid fa-link me-2"></i>
                  Link Terkait
                </h3>
                <div className="quick-links">
                  <a href="/schedule" className="quick-link-item">
                    <i className="fa-solid fa-calendar-check"></i>
                    <span>Lihat Jadwal</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </a>
                  <a href="/resource" className="quick-link-item">
                    <i className="fa-solid fa-book"></i>
                    <span>Sumber Belajar</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </a>
                  <a href="/faq" className="quick-link-item">
                    <i className="fa-solid fa-question-circle"></i>
                    <span>FAQ</span>
                    <i className="fa-solid fa-chevron-right"></i>
                  </a>
                </div>
              </div>

              {/* daftar */}
              {!user && (
                <div className="cta-sidebar">
                  <h4>
                    <i className="fa-solid fa-rocket me-2"></i>
                    Siap Bergabung?
                  </h4>
                  <p>Daftar sekarang dan kuasai Node.js Backend Development!</p>
                  <Link to="/register" className="btn btn-accent btn-lg w-100">
                    <i className="fa-solid fa-user-plus me-2"></i>
                    Daftar Sekarang
                  </Link>
                  <a href="/contact" className="btn btn-outline-primary w-100 mt-2">
                    <i className="fa-solid fa-envelope me-2"></i>
                    Hubungi Kami
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default NodeJS;