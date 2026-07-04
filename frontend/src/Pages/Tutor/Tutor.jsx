import React from "react";
import "./Tutor.css";

import ethanImg from "../../Assets/ethan.jpg";
import devinImg from "../../Assets/devin.jpg";
import anggaraImg from "../../Assets/anggara.jpg";

const Tutor = () => {
  const tutors = [
    {
      id: "nicholian",
      name: "Nicholian Tjuarsa",
      role: "Tutor HTML & CSS",
      desc: "Nicholian adalah tutor yang sabar dan kreatif dalam membimbing siswa membuat desain web modern dengan struktur yang rapi.",
      img: devinImg,
      color: "#f59e0b",
      social: { linkedin: "#", github: "#" },
    },
    {
      id: "ethan",
      name: "Ethan Wilbert",
      role: "Tutor JavaScript",
      desc: "Ethan dikenal dengan cara mengajar yang interaktif dan menyenangkan, membuat logika pemrograman terasa mudah dipahami.",
      img: ethanImg,
      color: "#3b82f6",
      social: { linkedin: "#", github: "https://github.com/EsKanepo" },
    },
    {
      id: "devin",
      name: "Devin Owen Sanusi",
      role: "Tutor Bootstrap",
      desc: "Dengan pengalaman luas di bidang frontend, Devin membantu siswa memahami layouting profesional menggunakan Bootstrap.",
      img: devinImg,
      color: "#8b5cf6",
      social: { linkedin: "#", github: "#" },
    },
    {
      id: "anggara",
      name: "Anggara Adelee",
      role: "Tutor Responsive Design",
      desc: "Anggara fokus pada desain web yang adaptif untuk semua perangkat agar pengalaman pengguna tetap maksimal.",
      img: anggaraImg,
      color: "#10b981",
      social: { linkedin: "#", github: "#" },
    },
  ];

  return (
    <main className="tutor-page-wrapper">
      {/* Hero Section */}
      <section className="tutors-hero">
        <div className="container tutors-hero-content">
          <span className="premium-badge">
            <i className="fas fa-star me-2"></i> Pengajar Profesional
          </span>
          <h1 className="hero-title">Temui Mentor Hebat Kami</h1>
          <p className="hero-subtitle">
            Kami memiliki tutor berpengalaman dan berdedikasi tinggi yang siap membimbing perjalanan karir Anda dari nol hingga mahir.
          </p>
        </div>
      </section>

      {/* Grid Section */}
      <section className="tutors-grid-section">
        <div className="container">
          <div className="tutor-grid">
            {tutors.map((tutor) => (
              <div className="premium-tutor-card" id={tutor.id} key={tutor.id}>
                <div className="tutor-card-bg" style={{ background: tutor.color }}></div>
                <div className="tutor-card-content">
                  <div className="tutor-avatar-wrapper" style={{ borderColor: tutor.color }}>
                    <img src={tutor.img} alt={tutor.name} className="tutor-avatar" />
                  </div>
                  <h3 className="tutor-name">{tutor.name}</h3>
                  <p className="tutor-role" style={{ color: tutor.color }}>
                    {tutor.role}
                  </p>
                  <p className="tutor-desc">{tutor.desc}</p>
                  <div className="tutor-socials">
                    <a href={tutor.social.linkedin} className="social-icon">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                    <a href={tutor.social.github} className="social-icon">
                      <i className="fab fa-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Tutor;
