import React from 'react';
import './AboutSection.css';

const AboutSection = () => {
  const features = [
    {
      icon: 'fa-graduation-cap',
      title: 'Pembelajaran Interaktif',
      description: 'Metode pembelajaran modern dengan hands-on practice dan real-world projects'
    },
    {
      icon: 'fa-users',
      title: 'Mentor Berpengalaman',
      description: 'Tim pengajar profesional dengan pengalaman industri dan akademik yang mumpuni'
    },
    {
      icon: 'fa-certificate',
      title: 'Sertifikat Terpercaya',
      description: 'Sertifikat completion yang diakui industri dan dapat meningkatkan karir Anda'
    },
    {
      icon: 'fa-mobile-alt',
      title: 'Akses Mobile Friendly',
      description: 'Belajar kapan saja dan di mana saja melalui platform yang responsif dan user-friendly'
    }
  ];

  return (
    <section className="about-section">
      <div className="container">
        <div className="about-content">
          <div className="about-text">
            <div className="section-header text-left">
              <h2 className="section-title">Tentang CodeCatalyst</h2>
              <p className="section-subtitle">
                Platform pembelajaran programming yang dirancang khusus untuk membantu mahasiswa 
                menguasai pengembangan web modern dengan pendekatan praktis dan komprehensif.
              </p>
            </div>
            
            <div className="about-description">
              <p>
                CodeCatalyst adalah solusi pembelajaran yang inovatif untuk mata kuliah 
                <strong>Pengembangan Pemrograman</strong>. Kami menghadirkan pengalaman belajar 
                yang interaktif, engaging, dan efektif dengan kombinasi teori praktis, 
                project-based learning, dan mentorship dari para ahli.
              </p>
              
              <p>
                Dengan kurikulum yang dirancang oleh para profesional industri dan akademisi, 
                kami memastikan setiap siswa mendapatkan pemahaman mendalam tentang konsep 
                pemrograman web modern, dari HTML/CSS dasar hingga framework JavaScript 
                yang kompleks seperti React dan Node.js.
              </p>
            </div>

            <div className="about-highlights">
              <div className="highlight-item">
                <div className="highlight-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="highlight-text">
                  <strong>Kurikulum Terkini</strong>
                  <span>Materi selalu update dengan teknologi terbaru</span>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="highlight-text">
                  <strong>Project-Based</strong>
                  <span>Belajar melalui proyek nyata yang relevan</span>
                </div>
              </div>
              
              <div className="highlight-item">
                <div className="highlight-icon">
                  <i className="fas fa-check-circle"></i>
                </div>
                <div className="highlight-text">
                  <strong>Community Support</strong>
                  <span>Forum diskusi dan kolaborasi antar siswa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="about-features">
            {features.map((feature, index) => (
              <div className="feature-card" key={index}>
                <div className="feature-icon">
                  <i className={`fas ${feature.icon}`}></i>
                </div>
                <div className="feature-content">
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
