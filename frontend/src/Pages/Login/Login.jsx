import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginWithGoogle } from "../../auth/socialAuth";
import { api } from "../../api/client";
import "./Login.css";
import logoImg from "../../Assets/Logo_Code.png";

import LoginForm from "./components/LoginForm";
import SocialLogin from "./components/SocialLogin";

const Login = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!form.email.trim() || !form.password.trim()) {
      setErrors({
        submit: "Harap isi email dan password terlebih dahulu."
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/login", {
        email: form.email,
        password: form.password,
      });
      console.log("LOGIN RESPONSE:", data);
      setUser(data.data.user);
      setToken(data.data.token);

      localStorage.setItem("token", data.data.token);

      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } catch (err) {
      console.log("LOGIN ERROR:", err.response?.data || err);

      const errorMsg = err.response?.data?.message || "Login gagal...";
      setErrors({
        submit: errorMsg
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const user = await loginWithGoogle();

      // 🔥 KIRIM KE BACKEND
      const { data } = await api.post("/auth/google", {
        name: user.displayName,
        email: user.email,
      });

      // 🔥 SIMPAN TOKEN BACKEND (BUKAN FIREBASE)
      setUser(data.data.user);
      setToken(data.data.token);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("isLoggedIn", "true");

      navigate("/");
    } catch (error) {
      console.error("GOOGLE LOGIN ERROR:", error);
      setErrors({
        submit: "Login dengan Google gagal.",
      });
    }
  };

  return (
    <div className="auth-split-wrapper">
      <div className="auth-left-panel">
        <div className="auth-left-content">
          <img src={logoImg} alt="Logo CodeCatalyst" className="auth-logo-large" />
          <h1>Selamat Datang Kembali!</h1>
          <p>
            Akses ribuan materi, mentor profesional, dan komunitas yang siap membantu Anda berkembang dalam dunia pemrograman.
          </p>
          <div className="auth-floating-elements">
            <div className="floating-shape shape-1"><i className="fab fa-react"></i></div>
            <div className="floating-shape shape-2"><i className="fab fa-js"></i></div>
            <div className="floating-shape shape-3"><i className="fab fa-node-js"></i></div>
          </div>
        </div>
      </div>

      <div className="auth-right-panel">
        <div className="auth-form-container">
          <div className="auth-form-header">
            <h2>Masuk ke Akun</h2>
            <p>Silakan masukkan kredensial Anda untuk melanjutkan.</p>
          </div>

          <LoginForm
            form={form}
            onChange={handleChange}
            onSubmit={handleSubmit}
            errors={errors}
            isSubmitting={isSubmitting}
          />

          <div className="auth-divider">
            <span>ATAU</span>
          </div>

          <SocialLogin onGoogleLogin={handleGoogleLogin} />
          
          <div className="auth-redirect">
            Belum punya akun? <a href="/register">Daftar sekarang</a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
