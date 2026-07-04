import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";
import { useNavigate, Link } from 'react-router-dom';
import { useTypeScriptProgress } from './hooks/useTypeScriptProgress';
import './TypeScript.css';

const TypeScript = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isEnrolledInCourse } = usePoints();
  const { completedSections, toggleSection, resetProgress } = useTypeScriptProgress();

  // Course ID for TypeScript Essentials is 8 according to schema.sql
  const courseId = 8;
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
            <i className="fa-brands fa-js me-2"></i>
            TypeScript Masterclass
          </h1>
          <p className="lead">Bahasa dengan type safety untuk JavaScript development</p>
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
                  Kursus <strong>TypeScript Masterclass</strong> mengajarkan cara menggunakan TypeScript untuk membuat kode JavaScript
                  yang lebih aman dan maintainable. Dari basic types hingga advanced generics dan decorators.
                </p>
                <p className="course-description">
                  TypeScript menambahkan type safety ke JavaScript, mencegah banyak bugs sejak development time.
                  Master type system, interfaces, classes, dan patterns yang digunakan di project production.
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
                      <p>Lanjutan</p>
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
                    { week: 1, title: "TypeScript Basics", topics: ["Setup TypeScript project", "Basic types (string, number, boolean)", "Union dan intersection types", "Type aliases"] },
                    { week: 2, title: "Interfaces & Types", topics: ["Interface definition", "Extending interfaces", "Type vs Interface", "Readonly dan optionals"] },
                    { week: 3, title: "Classes & OOP", topics: ["Class syntax dan constructors", "Access modifiers", "Static members", "Inheritance dan polymorphism"] },
                    { week: 4, title: "Generics", topics: ["Generic functions dan types", "Generic constraints", "Conditional types", "Mapped types"] },
                    { week: 5, title: "Advanced Types", topics: ["Utility types (Partial, Pick, Omit)", "Type guards dan type predicates", "Discriminated unions", "Never type"] },
                    { week: 6, title: "Decorators & Metadata", topics: ["Decorator syntax", "Class decorators", "Method decorators", "Metadata reflection"] },
                    { week: 7, title: "Async & Modules", topics: ["Promises dan async/await", "Module system", "Namespaces", "Declaration files"] },
                    { week: 8, title: "Project & Best Practices", topics: ["Build project dengan TypeScript", "Testing TypeScript code", "Performance optimization", "Production deployment"] }
                  ].map((item, idx) => (
                    <li key={idx} className="topic-item">
                      <div className="topic-header">
                        <span className="week-badge">Minggu {item.week}</span>
                        <h5>
                          <i className="fa-brands fa-js me-2"></i>
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
                    src="https://www.youtube.com/embed/d56mG7DezGs"
                    title="TypeScript Tutorial"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-muted small mb-0">
                  <i className="fa-solid fa-circle-play me-1"></i>
                  Tutorial TypeScript dari dasar hingga advanced
                </p>
              </div>

              {!user && (
                <div className="cta-sidebar mt-4">
                  <h4>
                    <i className="fa-solid fa-rocket me-2"></i>
                    Siap Bergabung?
                  </h4>
                  <p>Daftar sekarang dan kuasai TypeScript!</p>
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

export default TypeScript;
