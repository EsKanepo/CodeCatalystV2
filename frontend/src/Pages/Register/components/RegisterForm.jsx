import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { api } from "../../../api/client";

const RegisterForm = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setErrors({
        submit: "Harap isi nama, email, dan password terlebih dahulu."
      });
      setIsSubmitting(false);
      return;
    }

    try {
      const { data } = await api.post("/auth/register", {
        name: form.name,
        email: form.email,
        password: form.password,
      });
      setUser(data.data.user);
      setToken(data.data.token);
      localStorage.setItem("isLoggedIn", "true");
      navigate("/");
    } catch (err) {
      // Parse validation errors from backend
      if (err.response?.status === 400 && err.response?.data?.error === 'Validation error') {
        // Map validation error messages to form fields
        const errorMessage = err.response?.data?.message || "";
        setErrors({
          submit: errorMessage
        });
      } else if (err.response?.status === 400) {
        setErrors({
          email: err.response?.data?.message || "Email sudah terdaftar atau data tidak valid"
        });
      } else {
        setErrors({
          submit: "Register gagal. Silakan coba lagi."
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.submit && (
        <div className="alert alert-danger" role="alert">
          <i className="fa-solid fa-circle-exclamation me-2"></i>
          {errors.submit}
        </div>
      )}

      <div className="input-group">
        <label>
          <i className="fa-solid fa-user"></i> Nama Lengkap
        </label>
        <input
          type="text"
          name="name"
          placeholder="Masukkan nama lengkap"
          value={form.name}
          onChange={handleChange}
          className={errors.name ? 'is-invalid' : ''}
        />
        {errors.name && <small className="text-danger">{errors.name}</small>}
      </div>

      <div className="input-group">
        <label>
          <i className="fa-solid fa-envelope"></i> Email
        </label>
        <input
          type="email"
          name="email"
          placeholder="Masukkan email"
          value={form.email}
          onChange={handleChange}
          className={errors.email ? 'is-invalid' : ''}
        />
        {errors.email && <small className="text-danger">{errors.email}</small>}
      </div>

      <div className="input-group">
        <label>
          <i className="fa-solid fa-lock"></i> Password
        </label>
        <input
          type="password"
          name="password"
          placeholder="Buat password (min. 6 karakter)"
          value={form.password}
          onChange={handleChange}
          className={errors.password ? 'is-invalid' : ''}
        />
        {errors.password && <small className="text-danger">{errors.password}</small>}
      </div>

      <button type="submit" className="submit-btn" disabled={isSubmitting}>
        <i className="fa-solid fa-paper-plane"></i> {isSubmitting ? 'Mendaftar...' : 'Daftar Sekarang'}
      </button>

    </form>
  );
};

export default RegisterForm;
