import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";
import { useNavigate, Link } from 'react-router-dom';
import './JavaScript.css';
import { useJsProgress } from './hooks/useJsProgress';

const JavaScript = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();
  const { completedSections, toggleSection, resetProgress } = useJsProgress();

  // Course ID for JavaScript Dasar is 3 according to schema.sql
  const courseId = 3;
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
            <i className="fa-brands fa-js me-2"></i>
            JavaScript Interaktif
          </h1>
          <p className="lead">Membuat halaman web yang dinamis dan interaktif</p>
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
                  Kursus <strong>JavaScript Interaktif</strong> mengajarkan dasar-dasar pemrograman JavaScript untuk
                  membuat website yang dinamis dan interaktif. Dari variables hingga DOM manipulation.
                </p>
                <p className="course-description">
                  Kuasai bahasa pemrograman paling populer untuk web development. Belajar membuat aplikasi web yang
                  interaktif dengan event handling dan asynchronous programming.
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
                      <p>Maksimal 30 orang</p>
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
                      <span className="week-badge">Minggu 1-2</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        JavaScript Basics
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Variables, data types, dan operators</li>
                      <li>Control flow (if-else, switch)</li>
                      <li>Loops (for, while, forEach)</li>
                      <li>Functions dan arrow functions</li>
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
                      <span className="week-badge">Minggu 3</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        Arrays &amp; Objects
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Array methods (map, filter, reduce)</li>
                      <li>Objects dan object methods</li>
                      <li>Destructuring dan spread operator</li>
                      <li>JSON manipulation</li>
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
                      <span className="week-badge">Minggu 4</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        DOM Manipulation
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Selecting DOM elements</li>
                      <li>Creating dan modifying elements</li>
                      <li>Event listeners dan event handling</li>
                      <li>Form validation dengan JavaScript</li>
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
                      <span className="week-badge">Minggu 5</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        Asynchronous JavaScript
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Callbacks dan callback hell</li>
                      <li>Promises dan promise chaining</li>
                      <li>Async/Await syntax</li>
                      <li>Fetch API untuk HTTP requests</li>
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
                      <span className="week-badge">Minggu 6</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        ES6+ &amp; Project
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>ES6+ features (let, const, template literals)</li>
                      <li>Modules import/export</li>
                      <li>Error handling (try-catch)</li>
                      <li>Project: Interactive web application</li>
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
                      <span className="week-badge">Minggu 7</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        Advanced Patterns &amp; Best Practices
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Modular JavaScript dan struktur folder</li>
                      <li>Clean code: naming, fungsi kecil, dan reuse</li>
                      <li>Error handling lanjutan dan debugging</li>
                      <li>Performance basics (profiling dan optimasi sederhana)</li>
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
                      <span className="week-badge">Minggu 8</span>
                      <h5>
                        <i className="fa-brands fa-js text-warning me-2"></i>
                        Final Project JavaScript
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Merancang aplikasi web interaktif end-to-end</li>
                      <li>Menggunakan DOM, event, dan async API dalam satu project</li>
                      <li>Refactor dan rapikan struktur kode</li>
                      <li>Presentasi dan evaluasi project JavaScript</li>
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
                </ul>

                <div className="mt-3 d-flex justify-content-center">
                  <button type="button" className="btn btn-outline-danger btn-sm" onClick={resetProgress}>
                    Reset progress
                  </button>
                </div>

                <div className="mt-4 text-center">
                  <Link to="/schedule" className="btn btn-primary btn-lg">
                  <i className="fa-solid fa-calendar-days me-2"></i>
                    Lihat Jadwal Lengkap
                  </Link>
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
                  {completedSections.filter(Boolean).length} dari {completedSections.length} topik selesai
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
                    src="https://www.youtube.com/embed/W6NZfCO5SIk"
                    title="JavaScript Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial JavaScript dari dasar
                </p>
              </div>

              {/* link */}
              <div className="content-card mt-4">
                <h3 className="card-title">
                  <i className="fa-solid fa-link me-2"></i>
                  Link Terkait
                </h3>
                <div className="quick-links">
                  <Link to="/schedule" className="quick-link-item">
                  <i className="fa-solid fa-calendar-check"></i>
                  <span>Lihat Jadwal</span>
                  <i className="fa-solid fa-chevron-right"></i>
                  </Link>
                  <Link to="/resource" className="quick-link-item">
                  <i className="fa-solid fa-book"></i>
                  <span>Sumber Belajar</span>
                  <i className="fa-solid fa-chevron-right"></i>
                  </Link>
                  <Link to="/faq" className="quick-link-item">
                  <i className="fa-solid fa-question-circle"></i>
                  <span>FAQ</span>
                  <i className="fa-solid fa-chevron-right"></i>
                  </Link>
                </div>
              </div>

              {/* daftar */}
              {!user && (
                <div className="cta-sidebar">
                  <h4>
                    <i className="fa-solid fa-rocket me-2"></i>
                    Siap Bergabung?
                  </h4>
                  <p>Daftar sekarang dan kuasai JavaScript!</p>
                  <Link to="/register" className="btn btn-accent btn-lg w-100">
                    <i className="fa-solid fa-user-plus me-2"></i>
                    Daftar Sekarang
                  </Link>
                  <a href="contact.html" className="btn btn-outline-primary w-100 mt-2">
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

export default JavaScript;