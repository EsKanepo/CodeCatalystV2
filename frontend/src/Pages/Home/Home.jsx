import { Link } from "react-router-dom";
import gif from "../../Assets/learn_gif.gif";
import "./Home.css";

import FeatureCard from "./Components/FeatureCard";
import PopularCourses from "./Components/PopularCourses";
import { features } from "./data/Features";
import StatsSection from "./Components/StatsSection";
import TestimonialPreview from "./Components/TestimonialPreview";
import AboutSection from "./Components/AboutSection";


const Home = () => {
  return (
    <>
      {/* HERO */}
      <section className="hero">
        <div className="hero-background">
          <div className="hero-particles"></div>
          <div className="hero-gradient"></div>
        </div>
        <div className="container">
          <div className="row align-items-center gy-4">
            <div className="col-lg-7">
              <div className="hero-content">
                <div className="hero-badge">
                  <i className="fa-solid fa-code me-2"></i>
                  Platform Pembelajaran Modern
                </div>
                <h1 className="hero-title">
                  CodeCatalyst — <br />
                  <span className="typewriter">Accelerate Your Learning Journey</span>
                </h1>

                <p className="hero-description">
                  Platform edukasi premium untuk mata kuliah{" "}
                  <strong>Pengembangan Pemrograman</strong>. 
                  Menyediakan kursus interaktif, mentor profesional, dan jadwal belajar fleksibel 
                  berbasis teknologi React terkini.
                </p>

                <div className="hero-stats">
                  <div className="stat-item">
                    <div className="stat-number">50+</div>
                    <div className="stat-label">Kursus</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">1000+</div>
                    <div className="stat-label">Siswa</div>
                  </div>
                  <div className="stat-item">
                    <div className="stat-number">95%</div>
                    <div className="stat-label">Kepuasan</div>
                  </div>
                </div>

                <div className="hero-buttons">
                  <Link to="/courses" className="btn btn-primary btn-lg hero-btn-primary">
                    <i className="fa-solid fa-rocket me-2"></i>
                    Mulai Belajar Gratis
                  </Link>

                  <Link to="/tutor" className="btn btn-outline-light btn-lg hero-btn-secondary">
                    <i className="fa-solid fa-users me-2"></i>
                    Tim Pengajar
                  </Link>
                </div>
              </div>
            </div>

            <div className="col-lg-5 text-center text-lg-end">
              <div className="hero-figure-container">
                <div className="hero-figure-bg"></div>
                <figure className="hero-figure mb-0">
                  <img
                    src={gif}
                    alt="Ilustrasi pendidikan dan coding"
                    className="img-fluid hero-image"
                  />
                </figure>
                <div className="floating-cards">
                  <div className="floating-card card-1">
                    <i className="fa-brands fa-html5"></i>
                    <span>HTML</span>
                  </div>
                  <div className="floating-card card-2">
                    <i className="fa-brands fa-css3-alt"></i>
                    <span>CSS</span>
                  </div>
                  <div className="floating-card card-3">
                    <i className="fa-brands fa-js"></i>
                    <span>JavaScript</span>
                  </div>
                  <div className="floating-card card-4">
                    <i className="fa-brands fa-react"></i>
                    <span>React</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <StatsSection />

      {/* ABOUT SECTION */}
      <AboutSection />

      {/* FEATURES */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Fitur Unggulan Kami</h2>
            <p className="section-subtitle">
              Platform pembelajaran komprehensif dengan berbagai fitur untuk mendukung perjalanan belajar Anda
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {features.map((item, i) => (
              <div className="col-md-6 col-lg-3" key={i}>
                <FeatureCard item={item} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* POPULAR COURSES */}
      <section className="popular-courses-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Kursus Populer</h2>
            <p className="section-subtitle">
              Kursus-kursus terbaik yang paling diminati oleh siswa kami
            </p>
          </div>
          <PopularCourses />
          <div className="text-center mt-4">
            <Link to="/courses" className="btn btn-outline-primary">
              <i className="fa-solid fa-th-large me-2"></i>
              Lihat Semua Kursus
            </Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIAL PREVIEW */}
      <TestimonialPreview />

      {/* TEAM INFO */}
      <section className="team-info-section">
        <div className="container">
          <div className="team-info-card">
            <div className="team-info-header">
              <h3 className="team-info-title">Tentang CodeCatalyst</h3>
              <p className="team-info-subtitle">
                Proyek pengembangan aplikasi web untuk mata kuliah Pengembangan Pemrograman
              </p>
            </div>
            
            <div className="team-info-content">
              <div className="team-info-item">
                <div className="team-info-icon">
                  <i className="fa-solid fa-users"></i>
                </div>
                <div className="team-info-text">
                  <strong>Kelompok:</strong> Nicolain
                </div>
              </div>
              
              <div className="team-info-item">
                <div className="team-info-icon">
                  <i className="fa-solid fa-chalkboard-teacher"></i>
                </div>
                <div className="team-info-text">
                  <strong>Dosen:</strong> Gilbert Fernando Situmorang
                </div>
              </div>
              
              <div className="team-info-item">
                <div className="team-info-icon">
                  <i className="fa-solid fa-book"></i>
                </div>
                <div className="team-info-text">
                  <strong>Mata Kuliah:</strong> Pengembangan Web Back-End
                </div>
              </div>
            </div>
            
            <div className="team-members">
              <h4 className="team-members-title">Anggota Kelompok</h4>
              <div className="team-members-grid">
                <div className="member-card">
                  <div className="member-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="member-info">
                    <div className="member-name">Ethan Wilbert</div>
                    <div className="member-nim">241110939</div>
                  </div>
                </div>
                <div className="member-card">
                  <div className="member-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="member-info">
                    <div className="member-name">Devin Owen Sanusi</div>
                    <div className="member-nim">241111093</div>
                  </div>
                </div>
                <div className="member-card">
                  <div className="member-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="member-info">
                    <div className="member-name">Anggara Adelee</div>
                    <div className="member-nim">241112271</div>
                  </div>
                </div>
                <div className="member-card">
                  <div className="member-avatar">
                    <i className="fa-solid fa-user"></i>
                  </div>
                  <div className="member-info">
                    <div className="member-name">Nicholian Tjuarsa</div>
                    <div className="member-nim">241110066</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOCIAL */}
      <section className="social-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Ikuti Kami</h2>
            <p className="section-subtitle">
              Stay connected dengan kami untuk update terbaru
            </p>
          </div>
          <div className="social-icons">
            <a href="https://www.instagram.com" className="instagram" target="_blank" rel="noreferrer">
              <i className="fab fa-instagram"></i>
              <span>Instagram</span>
            </a>
            <a href="https://www.facebook.com" className="facebook" target="_blank" rel="noreferrer">
              <i className="fab fa-facebook-f"></i>
              <span>Facebook</span>
            </a>
            <a href="https://twitter.com" className="twitter" target="_blank" rel="noreferrer">
              <i className="fab fa-twitter"></i>
              <span>Twitter</span>
            </a>
            <a href="https://www.youtube.com" className="youtube" target="_blank" rel="noreferrer">
              <i className="fab fa-youtube"></i>
              <span>YouTube</span>
            </a>
            <a href="https://www.linkedin.com" className="linkedin" target="_blank" rel="noreferrer">
              <i className="fab fa-linkedin-in"></i>
              <span>LinkedIn</span>
            </a>
            <a href="https://www.tiktok.com" className="tiktok" target="_blank" rel="noreferrer">
              <i className="fab fa-tiktok"></i>
              <span>TikTok</span>
            </a>
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <div className="cta-content">
              <h2 className="cta-title">Siap Memulai Perjalanan Belajar Anda?</h2>
              <p className="cta-description">
                Bergabunglah dengan ribuan siswa yang telah meningkatkan skill programming mereka bersama CodeCatalyst
              </p>
              <div className="cta-buttons">
                <Link to="/register" className="btn btn-primary btn-lg">
                  <i className="fa-solid fa-user-plus me-2"></i>
                  Daftar Gratis
                </Link>
                <Link to="/courses" className="btn btn-outline-light btn-lg">
                  <i className="fa-solid fa-eye me-2"></i>
                  Lihat Kursus
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Home;
