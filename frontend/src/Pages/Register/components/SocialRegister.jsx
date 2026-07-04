import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { loginWithGoogle } from "../../../auth/socialAuth";
import { api } from "../../../api/client";

const SocialRegister = () => {
  const navigate = useNavigate();
  const { setUser, setToken } = useAuth();

  const handleGoogleRegister = async () => {
    try {
      const user = await loginWithGoogle();

      // 🔥 kirim ke backend
      const { data } = await api.post("/auth/google", {
        name: user.displayName,
        email: user.email,
      });

      // 🔥 simpan ke state + localStorage
      setUser(data.data.user);
      setToken(data.data.token);

      localStorage.setItem("token", data.data.token);
      localStorage.setItem("isLoggedIn", "true");

      navigate("/");
    } catch (err) {
      console.error("GOOGLE REGISTER ERROR:", err);
      alert("Pendaftaran dengan Google gagal.");
    }
  };

  return (
    <div className="social-login">
      <p>Atau daftar dengan</p>

      <button
        type="button"
        className="social-btn google"
        onClick={handleGoogleRegister}
      >
        <i className="fa-brands fa-google"></i> Google
      </button>
    </div>
  );
};

export default SocialRegister;