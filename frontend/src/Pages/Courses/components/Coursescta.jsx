import { Link } from "react-router-dom";

const CoursesCTA = () => {
  return (
    <div className="cta-box text-center">
      <h4>
        <i className="fa-solid fa-rocket me-2"></i>
        Siap Memulai Belajar?
      </h4>
      <p>Daftar untuk membuka semua kursus</p>

      <Link to="/register" className="btn btn-light btn-lg">
        <i className="fa-solid fa-user-plus me-1"></i>
        Daftar Sekarang
      </Link>
    </div>
  );
};

export default CoursesCTA;
