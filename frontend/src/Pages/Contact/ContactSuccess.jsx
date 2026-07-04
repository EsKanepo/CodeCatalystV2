import React from "react";
import { NavLink } from "react-router-dom";
import "./ContactSuccess.css";

const ContactSuccess = () => {
  return (
    <div className="contact-success-page">
      <header className="hero">
        <div className="container">
          <h2 className="fw-bold">
            <i className="fa-solid fa-paper-plane"></i> Pesan Anda Telah Dikirim
          </h2>
          <p className="mb-0">
            Terima kasih atas pesan Anda. Tim <strong>CodeCatalyst</strong> akan
            meninjau dan menanggapi jika diperlukan.
          </p>
        </div>
      </header>

      <main>
        <div className="container">
          <div className="card card-result text-center">
            <h4 className="mb-3">
              <i className="fa-solid fa-circle-check text-success"></i>{" "}
              Konfirmasi Pengiriman
            </h4>

            <p className="mb-2">
              Pesan Anda telah dikirim dengan sukses. Ini adalah halaman
              konfirmasi statis (tanpa menampilkan data yang dikirim).
            </p>

            <div className="d-flex gap-2 justify-content-center mt-3 flex-wrap">
              <NavLink to="/contact" className="btn btn-outline-secondary">
                <i className="fa-solid fa-arrow-left"></i> Kembali ke Form
              </NavLink>
              <NavLink to="/" className="btn btn-primary">
                <i className="fa-solid fa-house"></i> Kembali ke Home
              </NavLink>
            </div>

            <p className="mt-3 note">
              <i className="fa-solid fa-circle-info"></i>{" "}
              Halaman ini dibuat untuk memenuhi alur navigasi front-end tanpa
              backend. Jika ingin menyimpan data, gunakan layanan backend
              seperti PHP, Node.js, atau Formspree.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ContactSuccess;

