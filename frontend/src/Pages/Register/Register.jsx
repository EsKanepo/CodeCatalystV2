import React from "react";
import "../Login/Login.css"; // Reuse the shared Split Auth UI
import logoImg from "../../Assets/Logo_Code.png";

import RegisterForm from "./components/RegisterForm";
import SocialRegister from "./components/SocialRegister";

const Register = () => {
  return (
    <div className="auth-split-wrapper">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <img src={logoImg} alt="Logo CodeCatalyst" className="auth-logo-large" />
          <h1>Bergabunglah dengan Kami!</h1>
          <p>
            Buat akun CodeCatalyst sekarang dan nikmati akses tak terbatas ke semua kursus, tantangan coding, dan webinar eksklusif.
          </p>
          <div className="auth-floating-elements">
            <div className="floating-shape shape-1"><i className="fas fa-code"></i></div>
            <div className="floating-shape shape-2"><i className="fas fa-laptop-code"></i></div>
            <div className="floating-shape shape-3"><i className="fas fa-rocket"></i></div>
          </div>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Daftar Akun Baru</h2>
            <p>Lengkapi data diri Anda di bawah ini.</p>
          </div>

          <RegisterForm />
          
          <div className="auth-divider">
            <span>ATAU</span>
          </div>

          <SocialRegister />
          
          <div className="auth-redirect">
            Sudah punya akun? <a href="/login">Masuk di sini</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
