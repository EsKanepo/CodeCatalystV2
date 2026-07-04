import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';
import './Html_Fundamental.css';
import { useHtmlProgress } from './hooks/useHtmlProgress';

const HtmlFundamental = () => {
  const { user } = useAuth();
  const { completedWeeks, toggleWeek, resetProgress } = useHtmlProgress();

  return (
    <>
      {/* header */}
      <section className="page-header">
        <div className="container">
          <h1>
            <i className="fa-brands fa-html5 me-2"></i>
            HTML Fundamentals
          </h1>
          <p className="lead">Pelajari dasar-dasar pembuatan struktur halaman web</p>
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
                  Kursus <strong>HTML Fundamentals</strong> dirancang untuk memberikan pemahaman menyeluruh tentang
                  struktur halaman web. Mulai dari tag dasar, semantic elements, hingga best practices dalam
                  penulisan HTML yang baik dan SEO-friendly.
                </p>
                <p className="course-description">
                  Kursus ini cocok untuk pemula yang baru memulai perjalanan web development. Dengan pendekatan
                  hands-on, Anda akan belajar membuat struktur web yang solid dan semantik.
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
                      <p>Pemula</p>
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
                      <span className="week-badge">Minggu 1</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        Pengenalan HTML
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Struktur dasar HTML dan anatomy tag</li>
                      <li>Heading, paragraph, dan text formatting</li>
                      <li>Lists (ordered dan unordered)</li>
                      <li>Attributes dan special characters</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[0] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(0)}
                    >
                      {completedWeeks[0] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 2</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        Semantic HTML &amp; Media
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Semantic elements (header, nav, main, footer)</li>
                      <li>Images dan image optimization</li>
                      <li>Audio dan video embedding</li>
                      <li>Iframe dan external content</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[1] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(1)}
                    >
                      {completedWeeks[1] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 3</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        Forms &amp; Tables
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Form elements dan input types</li>
                      <li>Form validation dan attributes</li>
                      <li>Table structure dan styling basics</li>
                      <li>Accessibility dalam forms</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[2] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(2)}
                    >
                      {completedWeeks[2] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 4</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        Best Practices &amp; Project
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>HTML5 best practices</li>
                      <li>SEO basics untuk HTML</li>
                      <li>Accessibility standards (ARIA)</li>
                      <li>Project: Membuat halaman portfolio</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[3] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(3)}
                    >
                      {completedWeeks[3] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 5</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        Struktur Layout Lanjutan
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Struktur layout multi-halaman</li>
                      <li>Pattern layout umum (header, sidebar, content)</li>
                      <li>Breadcrumbs dan navigasi tambahan</li>
                      <li>Integrasi HTML dengan CSS layout (overview)</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[4] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(4)}
                    >
                      {completedWeeks[4] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 6</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        HTML untuk Formulir Kompleks
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Multi-step forms (konsep dan struktur HTML)</li>
                      <li>Grouping input dengan fieldset dan legend</li>
                      <li>Input khusus (date, range, file, dll.)</li>
                      <li>Pesan error yang semantik dan aksesibel</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[5] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(5)}
                    >
                      {completedWeeks[5] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 7</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        HTML &amp; Integrasi dengan CSS/JS
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Menautkan stylesheet eksternal dan internal</li>
                      <li>Tag script dan placement yang tepat</li>
                      <li>Struktur HTML yang ramah komponen</li>
                      <li>Best practice pemisahan struktur dan styling</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[6] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(6)}
                    >
                      {completedWeeks[6] ? 'Selesai' : 'Tandai selesai'}
                    </button>
                  </li>

                  <li className="topic-item">
                    <div className="topic-header">
                      <span className="week-badge">Minggu 8</span>
                      <h5>
                        <i className="fa-brands fa-html5 text-danger me-2"></i>
                        Final Project HTML
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Perencanaan struktur halaman website lengkap</li>
                      <li>Membuat beberapa halaman terhubung (multi-page)</li>
                      <li>Review semantic HTML, aksesibilitas, dan SEO</li>
                      <li>Presentasi dan evaluasi project HTML</li>
                    </ul>
                    <button
                      type="button"
                      className={`btn btn-sm mt-2 ${
                        completedWeeks[7] ? 'btn-success' : 'btn-outline-success'
                      }`}
                      onClick={() => toggleWeek(7)}
                    >
                      {completedWeeks[7] ? 'Selesai' : 'Tandai selesai'}
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
                    style={{ width: `${Math.round((completedWeeks.filter(Boolean).length / completedWeeks.length) * 100)}%` }}
                    aria-valuenow={Math.round((completedWeeks.filter(Boolean).length / completedWeeks.length) * 100)}
                    aria-valuemin="0"
                    aria-valuemax="100"
                  >
                    {Math.round((completedWeeks.filter(Boolean).length / completedWeeks.length) * 100)}%
                  </div>
                </div>
                <p className="text-muted small">
                  <i className="fa-solid fa-check-circle text-success me-1"></i>
                  {completedWeeks.filter(Boolean).length} dari {completedWeeks.length} minggu selesai
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
                    src="https://www.youtube.com/embed/qz0aGYrrlhU"
                    title="HTML Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial lengkap HTML untuk pemula
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
                  <p>Daftar sekarang dan mulai belajar HTML!</p>
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

export default HtmlFundamental;

