import { NavLink, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import "../App.css";
import logo from "../Assets/Logo_Code.png";
import NavbarSearch from "../Pages/Home/Components/NavbarSearch";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const navClass = ({ isActive }) =>
    isActive ? "nav-link active" : "nav-link";

  const handleSignOut = () => {
    const confirmed = window.confirm(
      "Apakah Anda yakin ingin keluar dari akun?"
    );

    if (!confirmed) return;

    signOut();
    navigate("/");
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleProfileClick = () => {
    navigate("/profile");
    setIsDropdownOpen(false);
  };

  const handleTopupClick = () => {
    navigate("/topup");
    setIsDropdownOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <nav className="navbar navbar-expand-lg">
      <div className="container d-flex align-items-center">

        {/* LOGO */}
        <NavLink to="/" className="navbar-brand d-flex align-items-center me-3">
          <img
            src={logo}
            width="40"
            height="40"
            className="me-2"
            style={{ borderRadius: "6px" }}
            alt="Logo CodeCatalyst"
          />
          <div className="typewriter">
            <span></span>
          </div>
        </NavLink>

        {/* SEARCH BAR (TENGAH) */}
        <div className="flex-grow-1 mx-5 d-none d-lg-block">
          <NavbarSearch />
        </div>

        {/* MENU */}
        <ul className="navbar-nav ms-auto d-flex flex-row gap-2 align-items-center">
          <li className="nav-item">
            <NavLink to="/" end className={navClass}>
              <i className="fa-solid fa-house me-1"></i> Home
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/about" className={navClass}>
              <i className="fa-solid fa-circle-info me-1"></i> About
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/courses" className={navClass}>
              <i className="fa-solid fa-book-open-reader me-1"></i> Courses
            </NavLink>
          </li>

          <li className="nav-item">
            <NavLink to="/schedule" className={navClass}>
              <i className="fa-solid fa-calendar-days me-1"></i> Schedule
            </NavLink>
          </li>

          {!user && (
            <li className="nav-item">
              <NavLink to="/register" className="btn btn-accent">
                <i className="fa-solid fa-user-plus me-1"></i>
                Register
              </NavLink>
            </li>
          )}

          {user && (
            <li className="nav-item" ref={dropdownRef}>
              <div className="navbar-user-dropdown">
                <button
                  type="button"
                  className="btn btn-outline-light btn-sm navbar-user-btn"
                  onClick={toggleDropdown}
                >
                  <i className="fa-solid fa-user-circle me-2"></i>
                  {user.name || user.email}
                  <i className={`fa-solid fa-chevron-${isDropdownOpen ? 'up' : 'down'} ms-2`}></i>
                </button>
                
                {isDropdownOpen && (
                  <div className="navbar-dropdown-menu">
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={handleProfileClick}
                    >
                      <i className="fa-solid fa-user me-2"></i>
                      Profile
                    </button>
                    {user?.role === 'admin' && (
                      <button
                        type="button"
                        className="dropdown-item"
                        onClick={() => { navigate("/admin"); setIsDropdownOpen(false); }}
                      >
                        <i className="fa-solid fa-screwdriver-wrench me-2"></i>
                        Admin Panel
                      </button>
                    )}
                    <button
                      type="button"
                      className="dropdown-item"
                      onClick={handleTopupClick}
                    >
                      <i className="fa-solid fa-wallet me-2"></i>
                      Topup
                    </button>
                    <div className="dropdown-divider"></div>
                    <button
                      type="button"
                      className="dropdown-item text-danger"
                      onClick={handleSignOut}
                    >
                      <i className="fa-solid fa-sign-out-alt me-2"></i>
                      Keluar
                    </button>
                  </div>
                )}
              </div>
            </li>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;