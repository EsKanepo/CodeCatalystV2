import React from "react";
import "./Resource.css";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Resource = () => {
  const { user } = useAuth();
  return (
    <>
      {/* Header section */}
      <section className="page-header">
        <div className="container">
          <h1>
            <i className="fa-solid fa-book me-2"></i>
            Sumber Belajar &amp; Referensi
          </h1>
          <p className="lead">
            Koleksi buku, artikel, dan tools untuk mendukung pembelajaran Anda
          </p>
        </div>
      </section>

      {/* Main content */}
      <section className="py-5 resource-section">
        <div className="container">
          <div className="row g-4">
            {/* Buku Referensi */}
            <div className="col-12" id="buku">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-solid fa-book-bookmark me-2"></i>
                  Buku Referensi
                </h3>
                <div className="row g-3">
                  <div className="col-md-6 col-lg-4">
                    <div className="resource-item">
                      <i className="fa-brands fa-html5 resource-icon text-danger"></i>
                      <h5>HTML &amp; CSS: Design and Build Websites</h5>
                      <p className="text-muted small">Jon Duckett</p>
                      <a
                        href="https://www.htmlandcssbook.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        <i className="fa-solid fa-external-link me-1"></i>
                        Lihat Buku
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="resource-item">
                      <i className="fa-brands fa-js resource-icon text-warning"></i>
                      <h5>Eloquent JavaScript</h5>
                      <p className="text-muted small">Marijn Haverbeke</p>
                      <a
                        href="https://eloquentjavascript.net/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        <i className="fa-solid fa-external-link me-1"></i>
                        Lihat Buku
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-4">
                    <div className="resource-item">
                      <i className="fa-brands fa-react resource-icon text-info"></i>
                      <h5>Learning React</h5>
                      <p className="text-muted small">Alex Banks &amp; Eve Porcello</p>
                      <a
                        href="https://www.oreilly.com/library/view/learning-react-2nd/9781492051718/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        <i className="fa-solid fa-external-link me-1"></i>
                        Lihat Buku
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Website Tutorial */}
            <div className="col-lg-6">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-solid fa-globe me-2"></i>
                  Website Tutorial
                </h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <i className="fa-solid fa-circle-check me-2 text-success"></i>
                    <strong>MDN Web Docs</strong>
                    <p className="mb-1 text-muted small">
                      Dokumentasi lengkap HTML, CSS, dan JavaScript
                    </p>
                    <a
                      href="https://developer.mozilla.org/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Web
                    </a>
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-circle-check me-2 text-success"></i>
                    <strong>W3Schools</strong>
                    <p className="mb-1 text-muted small">
                      Tutorial interaktif dan contoh code
                    </p>
                    <a
                      href="https://www.w3schools.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Web
                    </a>
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-circle-check me-2 text-success"></i>
                    <strong>freeCodeCamp</strong>
                    <p className="mb-1 text-muted small">
                      Platform belajar coding gratis
                    </p>
                    <a
                      href="https://www.freecodecamp.org/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Web
                    </a>
                  </li>
                  <li className="list-group-item">
                    <i className="fa-solid fa-circle-check me-2 text-success"></i>
                    <strong>CSS-Tricks</strong>
                    <p className="mb-1 text-muted small">
                      Tips dan trik CSS modern
                    </p>
                    <a
                      href="https://css-tricks.com/"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Web
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Channel YouTube */}
            <div className="col-lg-6" id="video">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-brands fa-youtube me-2"></i>
                  Channel YouTube
                </h3>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <i className="fa-brands fa-youtube me-2 text-danger"></i>
                    <strong>Web Programming UNPAS</strong>
                    <p className="mb-1 text-muted small">Tutorial bahasa Indonesia</p>
                    <a
                      href="https://www.youtube.com/@sandhikagalihWPU"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Channel
                    </a>
                  </li>
                  <li className="list-group-item">
                    <i className="fa-brands fa-youtube me-2 text-danger"></i>
                    <strong>Traversy Media</strong>
                    <p className="mb-1 text-muted small">
                      Tutorial web development lengkap
                    </p>
                    <a
                      href="https://www.youtube.com/@TraversyMedia"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Channel
                    </a>
                  </li>
                  <li className="list-group-item">
                    <i className="fa-brands fa-youtube me-2 text-danger"></i>
                    <strong>Net Ninja</strong>
                    <p className="mb-1 text-muted small">
                      Tutorial JavaScript dan framework
                    </p>
                    <a
                      href="https://www.youtube.com/@NetNinja"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Channel
                    </a>
                  </li>
                  <li className="list-group-item">
                    <i className="fa-brands fa-youtube me-2 text-danger"></i>
                    <strong>Fireship</strong>
                    <p className="mb-1 text-muted small">
                      Quick tips dan modern web dev
                    </p>
                    <a
                      href="https://www.youtube.com/@Fireship"
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-sm btn-primary mt-1"
                    >
                      <i className="fa-solid fa-link me-1"></i>
                      Kunjungi Channel
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Tools & Software */}
            <div className="col-12">
              <div className="content-card">
                <h3 className="card-title">
                  <i className="fa-solid fa-toolbox me-2"></i>
                  Tools &amp; Software
                </h3>
                <div className="row g-3">
                  <div className="col-md-6 col-lg-3">
                    <div className="tool-card">
                      <i className="fa-solid fa-code tool-icon"></i>
                      <h6>VS Code</h6>
                      <p className="text-muted small mb-2">Code Editor</p>
                      <a
                        href="https://code.visualstudio.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="tool-card">
                      <i className="fa-brands fa-git-alt tool-icon"></i>
                      <h6>Git</h6>
                      <p className="text-muted small mb-2">Version Control</p>
                      <a
                        href="https://git-scm.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        Download
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="tool-card">
                      <i className="fa-brands fa-figma tool-icon"></i>
                      <h6>Figma</h6>
                      <p className="text-muted small mb-2">Design Tool</p>
                      <a
                        href="https://www.figma.com/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        Buka Web
                      </a>
                    </div>
                  </div>
                  <div className="col-md-6 col-lg-3">
                    <div className="tool-card">
                      <i className="fa-brands fa-chrome tool-icon"></i>
                      <h6>Chrome DevTools</h6>
                      <p className="text-muted small mb-2">Browser Tools</p>
                      <a
                        href="https://developer.chrome.com/docs/devtools/"
                        target="_blank"
                        rel="noreferrer"
                        className="btn btn-sm btn-primary w-100"
                      >
                        Pelajari
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Dokumentasi Framework */}
            <div className="col-12">
              <div className="content-card">
                <h3 className="card-title" id="Dokumentasi">
                  <i className="fa-solid fa-file-lines me-2"></i>
                  Dokumentasi Framework
                </h3>
                <div className="row">
                  <div className="col-md-6 col-lg-3 mb-3">
                    <a
                      href="https://getbootstrap.com/docs/"
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      <i className="fa-brands fa-bootstrap"></i>
                      <span>Bootstrap Docs</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <a
                      href="https://react.dev/"
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      <i className="fa-brands fa-react"></i>
                      <span>React Docs</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <a
                      href="https://vuejs.org/guide/"
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      <i className="fa-brands fa-vuejs"></i>
                      <span>Vue.js Docs</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                  <div className="col-md-6 col-lg-3 mb-3">
                    <a
                      href="https://nodejs.org/docs/"
                      target="_blank"
                      rel="noreferrer"
                      className="doc-link"
                    >
                      <i className="fa-brands fa-node-js"></i>
                      <span>Node.js Docs</span>
                      <i className="fa-solid fa-arrow-right"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="col-12 text-center">
              <div className="cta-box">
                <h4>
                  <i className="fa-solid fa-graduation-cap me-2"></i>
                  Mulai Belajar Sekarang!
                </h4>
                <p className="mb-3">
                  Gunakan sumber-sumber di atas untuk memperdalam pemahaman Anda
                </p>
                <NavLink to="/courses" className="btn btn-accent btn-lg me-2">
                  <i className="fa-solid fa-book-open me-1"></i> Lihat Kursus
                </NavLink>
                {!user && (
                  <NavLink to="/register" className="btn btn-primary btn-lg">
                    <i className="fa-solid fa-user-plus me-1"></i> Daftar Sekarang
                  </NavLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Resource;

