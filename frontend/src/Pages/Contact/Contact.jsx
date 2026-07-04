import React from "react";
import ContactForm from "./components/ContactForm";
import "./Contact.css";

const Contact = () => {
  return (
    <main className="contact-wrapper">
      <div className="contact-container">
        <div className="contact-card">
          {/* Left Column: Contact Info (Dark Gradient) */}
          <div className="contact-info-panel">
            <h2 className="info-title">Hubungi Kami</h2>
            <p className="info-desc">
              Punya pertanyaan atau butuh bantuan dengan platform CodeCatalyst? Tim kami siap membantu Anda 24/7.
            </p>

            <div className="info-items">
              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-location-dot"></i>
                </div>
                <div className="info-text">
                  <h4>Alamat Kantor</h4>
                  <p>Medan — Jalan Iskandar Muda</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-envelope"></i>
                </div>
                <div className="info-text">
                  <h4>Email Support</h4>
                  <p>support@codecatalyst.ac.id</p>
                </div>
              </div>

              <div className="info-item">
                <div className="info-icon">
                  <i className="fas fa-phone"></i>
                </div>
                <div className="info-text">
                  <h4>Layanan Telepon</h4>
                  <p>+62 812-3456-7890</p>
                </div>
              </div>
            </div>

            <div className="contact-socials">
              <a href="https://instagram.com"><i className="fab fa-instagram"></i></a>
              <a href="https://twitter.com"><i className="fab fa-twitter"></i></a>
              <a href="https://linkedin.com"><i className="fab fa-linkedin-in"></i></a>
            </div>
            
            <div className="info-pattern"></div>
          </div>

          {/* Right Column: Contact Form */}
          <div className="contact-form-panel">
            <h3 className="form-panel-title">Kirim Pesan</h3>
            <p className="form-panel-subtitle">Isi formulir di bawah ini dan kami akan segera membalasnya.</p>
            <ContactForm />
          </div>
        </div>
      </div>
    </main>
  );
};

export default Contact;
