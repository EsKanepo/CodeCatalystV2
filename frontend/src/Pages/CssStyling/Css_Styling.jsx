import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Link } from 'react-router-dom';
import './Css_Styling.css';
import { useCssProgress } from './hooks/useCssProgress';

const CssStyling = () => {
  const { user } = useAuth();
  const { completedSections, toggleSection, resetProgress } = useCssProgress();

  return (
    <>
      {/* header */}
      <section className="page-header">
        <div className="container">
          <h1>
            <i className="fa-brands fa-css3-alt me-2"></i>
            CSS Styling &amp; Layout
          </h1>
          <p className="lead">Mempelajari styling dan tata letak modern</p>
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
                  Kursus <strong>CSS Styling &amp; Layout</strong> mengajarkan cara membuat tampilan web yang menarik dan
                  responsif. Dari dasar selectors hingga layout modern dengan Flexbox dan Grid.
                </p>
                <p className="course-description">
                  Pelajari teknik styling profesional dan cara membuat layout yang adaptif di berbagai ukuran layar.
                  Kursus ini akan membekali Anda dengan skill CSS yang dibutuhkan industri.
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        CSS Fundamentals
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Selectors, properties, dan values</li>
                      <li>Colors, units, dan typography</li>
                      <li>Box model (margin, padding, border)</li>
                      <li>Display property dan positioning</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        Flexbox Layout
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Flex container dan flex items</li>
                      <li>Justify-content dan align-items</li>
                      <li>Flex-direction dan flex-wrap</li>
                      <li>Building responsive navigation</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        CSS Grid Layout
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Grid container dan grid template</li>
                      <li>Grid areas dan positioning</li>
                      <li>Responsive grid layouts</li>
                      <li>Grid vs Flexbox use cases</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        Responsive Design
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Media queries dan breakpoints</li>
                      <li>Mobile-first design approach</li>
                      <li>Responsive images dan typography</li>
                      <li>CSS variables dan custom properties</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        Animations &amp; Project
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Transitions dan transforms</li>
                      <li>CSS animations dan keyframes</li>
                      <li>Pseudo-classes dan pseudo-elements</li>
                      <li>Project: Landing page responsif</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        Advanced Layout Patterns
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Complex grid dan flexbox kombinasi</li>
                      <li>Layout dashboard dan card-based</li>
                      <li>Sticky header, sidebar, dan footer</li>
                      <li>Layout untuk aplikasi web modern</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        Design System &amp; Utility Classes
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Membangun design token dengan CSS variables</li>
                      <li>Utility classes untuk spacing, warna, dan typography</li>
                      <li>Reusable component styles (button, card, badge)</li>
                      <li>Struktur folder CSS skala menengah</li>
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
                        <i className="fa-brands fa-css3-alt text-primary me-2"></i>
                        Final Project CSS
                      </h5>
                    </div>
                    <ul className="subtopic-list">
                      <li>Perencanaan tampilan website end-to-end</li>
                      <li>Menerapkan responsive layout di seluruh halaman</li>
                      <li>Optimasi performance dan maintainability CSS</li>
                      <li>Presentasi dan review project styling</li>
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
                    src="https://www.youtube.com/embed/1Rs2ND1ryYc"
                    title="CSS Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial CSS untuk styling modern
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
                  <p>Daftar sekarang dan kuasai CSS!</p>
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

export default CssStyling;

