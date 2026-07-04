import React from 'react';
import './StatsSection.css';

const StatsSection = () => {
  const stats = [
    {
      number: '50+',
      label: 'Kursus Interaktif',
      description: 'Dari dasar hingga advanced',
      icon: 'fa-book'
    },
    {
      number: '1000+',
      label: 'Siswa Aktif',
      description: 'Bergabung setiap bulan',
      icon: 'fa-users'
    },
    {
      number: '95%',
      label: 'Tingkat Kepuasan',
      description: 'Dari ulasan siswa',
      icon: 'fa-star'
    },
    {
      number: '24/7',
      label: 'Akses Kursus',
      description: 'Belajar kapan saja',
      icon: 'fa-clock'
    }
  ];

  return (
    <section className="stats-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Statistik Kami</h2>
          <p className="section-subtitle">
            Angka-angka yang menunjukkan komitmen kami terhadap kualitas pembelajaran
          </p>
        </div>
        
        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div className="stat-card" key={index}>
              <div className="stat-icon-wrapper">
                <i className={`fas ${stat.icon}`}></i>
              </div>
              <div className="stat-content">
                <div className="stat-number">{stat.number}</div>
                <div className="stat-label">{stat.label}</div>
                <div className="stat-description">{stat.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
