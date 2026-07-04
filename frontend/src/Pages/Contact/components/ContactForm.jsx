import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../../../api/client";

const ContactForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [statusMsg, setStatusMsg] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const err = {};
    if (form.name.trim().length < 2) err.name = "Nama minimal 2 karakter";
    if (!form.email.includes("@")) err.email = "Email tidak valid";
    if (!form.message.trim()) err.message = "Pesan tidak boleh kosong";
    return err;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    setStatusMsg("");

    if (Object.keys(validationErrors).length === 0) {
      try {
        setIsSubmitting(true);
        await api.post("/contacts", form);
        setStatusMsg("Pesan berhasil dikirim. Mengarahkan ke halaman sukses...");
        setForm({ name: "", email: "", message: "" });
        setTimeout(() => navigate("/contact-success"), 700);
      } catch {
        setStatusMsg("Gagal mengirim pesan. Coba lagi.");
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form className="contact-form-premium" onSubmit={handleSubmit} noValidate>
      <div className="form-floating-custom">
        <input
          type="text"
          name="name"
          id="name"
          placeholder=" "
          value={form.name}
          onChange={handleChange}
        />
        <label htmlFor="name">Nama Lengkap</label>
        {errors.name && (
          <div className="error-text">
            <i className="fas fa-exclamation-circle"></i> {errors.name}
          </div>
        )}
      </div>

      <div className="form-floating-custom">
        <input
          type="email"
          name="email"
          id="email"
          placeholder=" "
          value={form.email}
          onChange={handleChange}
        />
        <label htmlFor="email">Alamat Email</label>
        {errors.email && (
          <div className="error-text">
            <i className="fas fa-exclamation-circle"></i> {errors.email}
          </div>
        )}
      </div>

      <div className="form-floating-custom">
        <textarea
          name="message"
          id="message"
          placeholder=" "
          value={form.message}
          onChange={handleChange}
        ></textarea>
        <label htmlFor="message">Pesan / Umpan Balik</label>
        {errors.message && (
          <div className="error-text">
            <i className="fas fa-exclamation-circle"></i> {errors.message}
          </div>
        )}
      </div>

      <button type="submit" className="btn-submit-premium" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <i className="fas fa-spinner fa-spin"></i> Mengirim...
          </>
        ) : (
          <>
            Kirim Pesan <i className="fas fa-paper-plane"></i>
          </>
        )}
      </button>
      {statusMsg && (
        <p className="mt-3 mb-0 text-center" style={{ color: "var(--brand-dark)", fontWeight: 600 }}>
          {statusMsg}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
