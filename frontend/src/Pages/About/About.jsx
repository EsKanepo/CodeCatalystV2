import "./About.css";
import { NavLink } from "react-router-dom";

const About = () => {
  return (
    <>
      {/* HERO */}
      <header className="brand-hero py-5">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-12 text-center">
              <div className="hero-icon mb-4">
                <i className="fa-solid fa-code"></i>
              </div>
              <h1 className="mb-3">
                <i className="fa-solid fa-circle-info me-2"></i>
                Tentang CodeCatalyst
              </h1>
              <p className="lead mx-auto">
                CodeCatalyst adalah platform pembelajaran yang dirancang untuk
                mendukung mahasiswa dalam memahami berbagai bahasa coding secara
                praktis. Proyek ini dibuat sebagai tugas UTS mata kuliah{" "}
                <strong>Pengembangan Pemrograman</strong>, dengan pendekatan
                proyek dan tampilan responsif.
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className="py-5">
        <div className="container">
          <div className="row g-4">
            {/* LEFT */}
            <div className="col-lg-7">
              <h3>Latar Belakang</h3>
              <p>
                Di era digital, keterampilan pemrograman menjadi kunci bagi
                mahasiswa yang ingin mengembangkan solusi berbasis web.
                CodeCatalyst hadir untuk menyediakan materi terstruktur, fokus
                praktik, dan mudah dipahami pemula.
              </p>

              <h4 className="mt-4">Manfaat Menggunakan CodeCatalyst</h4>
              <ul className="ms-3">
                <li>
                  <strong>Materi Terstruktur</strong> — Modul disusun per topik.
                </li>
                <li>
                  <strong>Praktik Langsung</strong> — Tugas mini dan contoh kode.
                </li>
                <li>
                  <strong>Responsif</strong> — Nyaman di desktop dan mobile.
                </li>
                <li>
                  <strong>Dokumentasi Proyek</strong> — Mendukung penilaian dosen.
                </li>
              </ul>

              <h4 className="mt-4">Target Pengguna</h4>
              <p>
                Mahasiswa semester awal hingga menengah yang mengambil mata
                kuliah pengembangan perangkat lunak atau ingin belajar front-end
                development berbasis proyek.
              </p>

              {/* FAQ */}
              <h5 className="mt-4">Pertanyaan Singkat</h5>
              <div className="accordion" id="aboutFaq">
                <div className="accordion-item">
                  <h2 className="accordion-header" id="faqOne">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#collapseOne"
                      aria-expanded="false"
                      aria-controls="collapseOne"
                    >
                      Apakah materi ini disertai sertifikat?
                    </button>
                  </h2>

                  <div
                    id="collapseOne"
                    className="accordion-collapse collapse"
                    aria-labelledby="faqOne"
                    data-bs-parent="#aboutFaq"
                  >
                    <div className="accordion-body">
                      Saat ini modul dilengkapi tugas dan panduan — penerbitan
                      sertifikat akan dipertimbangkan sesuai kebijakan dosen.
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* RIGHT */}
            <div className="col-lg-5">
              <aside className="feature-card p-4">
                <h5 className="mb-2">
                  <i className="fa-solid fa-lightbulb me-2 text-warning"></i>
                  Visi
                </h5>
                <p className="mb-3">
                  Menjadi alat bantu pembelajaran yang memudahkan mahasiswa
                  memahami dasar-dasar pemrograman secara praktis dan sistematis.
                </p>

                <h5 className="mb-2">
                  <i className="fa-solid fa-bullseye me-2 text-primary"></i>
                  Misi
                </h5>
                <ul className="ms-3 mb-3">
                  <li>Kurikulum singkat dan jelas.</li>
                  <li>Teori digabung praktik.</li>
                  <li>Dokumentasi lengkap untuk evaluasi.</li>
                </ul>

                <div className="mt-3">
                  <h6 className="mb-1">Kontak Tim</h6>
                  <p className="mb-1 muted-small">
                    Email:{" "}
                    <a href="mailto:support@codecatalyst.ac.id">
                      support@codecatalyst.ac.id
                    </a>
                  </p>
                  <p className="mb-0 muted-small">
                    Untuk saran atau kerja sama, hubungi via email.
                  </p>
                </div>
              </aside>
            </div>
          </div>

          {/* SOURCES */}
          <div className="row mt-5">
            <div className="col-12">
              <h5 className="mb-3">Sumber & Referensi</h5>
              <p className="muted-small">
                Beberapa sumber yang dijadikan referensi dalam pengembangan
                modul:
              </p>

              <div className="d-flex gap-3 flex-wrap">
                <NavLink
                  to="/resource#Dokumentasi"
                  className="course-link-item text-decoration-none"
                >
                  <div className="feature-card p-3 source-card">
                    <i className="fa-solid fa-book-open-reader fa-2x mb-2 text-primary"></i>
                    <h6>Dokumentasi</h6>
                    <p className="muted-small mb-0">
                      Panduan resmi dan dokumentasi web.
                    </p>
                  </div>
                </NavLink>

                <NavLink
                  to="/resource#video"
                  className="course-link-item text-decoration-none"
                >
                  <div className="feature-card p-3 source-card">
                    <i className="fa-solid fa-video fa-2x mb-2 text-danger"></i>
                    <h6>Video</h6>
                    <p className="muted-small mb-0">
                      Cuplikan materi dan demo praktik.
                    </p>
                  </div>
                </NavLink>

                <NavLink
                  to="/resource#buku"
                  className="course-link-item text-decoration-none"
                >
                  <div className="feature-card p-3 source-card">
                    <i className="fa-solid fa-book-bookmark fa-2x mb-2 text-success"></i>
                    <h6>Buku</h6>
                    <p className="muted-small mb-0">
                      Referensi buku pemrograman dasar.
                    </p>
                  </div>
                </NavLink>
              </div>
            </div>
          </div>

          {/* SOCIAL */}
          <div className="container mt-5">
            <h4 className="mb-4">
              <b>Ikuti Kami</b>
            </h4>
            <div className="social-icons">
              <a
                href="https://www.instagram.com"
                className="instagram"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-instagram"></i>
              </a>
              <a
                href="https://www.facebook.com"
                className="facebook"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://twitter.com"
                className="twitter"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-twitter"></i>
              </a>
              <a
                href="https://www.youtube.com"
                className="youtube"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-youtube"></i>
              </a>
              <a
                href="https://www.linkedin.com"
                className="linkedin"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-linkedin-in"></i>
              </a>
              <a
                href="https://www.tiktok.com"
                className="tiktok"
                target="_blank"
                rel="noreferrer"
              >
                <i className="fab fa-tiktok"></i>
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default About;
