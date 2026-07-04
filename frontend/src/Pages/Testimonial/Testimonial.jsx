import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import "./Testimonial.css";

import FilterBar from "./Components/FilterBar";
import Pagination from "./Components/Pagination";
import { api } from "../../api/client";

import user1 from "../../Assets/user1.jpg";
import user2 from "../../Assets/user2.jpg";
import user3 from "../../Assets/user3.jpg";
import user4 from "../../Assets/user4.jpg";
import user5 from "../../Assets/user5.avif";
import user6 from "../../Assets/user6.jpg";

const ITEMS_PER_PAGE = 3;

// 🔥 pindahkan ke luar component biar tidak re-create setiap render
const images = [user1, user2, user3, user4, user5, user6];

const Testimonial = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    course: "Semua",
    time: "Semua",
  });

  const [page, setPage] = useState(1);

  // ✅ gunakan useCallback biar stabil
  const fetchTestimonials = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get("/testimonials?limit=100");

      const mappedTestimonials = response.data.data.map((t, idx) => ({
        id: t.id,
        name: t.name,
        email: t.email,
        course: t.course_category || "General",
        time: "Pagi",
        rating: t.rating,
        message: t.message || t.testimonial,
        role_title: t.role_title || "Student",
        occupation: t.role_title || "Student",
        company: "CodeCatalyst",
        location: "Indonesia",
        image: images[idx % images.length],
      }));

      setTestimonials(mappedTestimonials);
    } catch (err) {
      setError("Gagal memuat testimoni");
      console.error("Testimonial Error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ✅ fetch pertama
  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  // ✅ auto refresh tiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchTestimonials();
    }, 30000);

    return () => clearInterval(interval);
  }, [fetchTestimonials]);

  const filteredData = testimonials.filter(
    (t) =>
      (filters.course === "Semua" || t.course === filters.course) &&
      (filters.time === "Semua" || t.time === filters.time)
  );

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const currentItems = filteredData.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <section className="testimonial-page">
      <header>
        <h2>Testimoni Siswa</h2>
        <p>Pengalaman nyata dari siswa CodeCatalyst</p>
      </header>

      <FilterBar
        filters={filters}
        setFilters={setFilters}
        resetPage={() => setPage(1)}
      />

      <div className="testimonial-list">
        {isLoading ? (
          <p className="empty-state">Memuat testimoni...</p>
        ) : error ? (
          <p className="empty-state error">{error}</p>
        ) : !currentItems.length ? (
          <p className="empty-state">Belum ada testimoni tersedia.</p>
        ) : (
          currentItems.map((t) => (
            <motion.article
              key={t.id}
              className="testimonial-card"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="card-header">
                <div className="profile">
                  <img src={t.image} alt={t.name} />
                  <div className="profile-info">
                    <h4>{t.name}</h4>
                    <p className="occupation">{t.occupation}</p>
                    <p className="company">
                      {t.company} • {t.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="rating">
                {"★".repeat(t.rating)}
                {"☆".repeat(5 - t.rating)}
              </div>

              <p className="message">{t.message}</p>

              <footer>
                <span className="course-badge">{t.course}</span>
                <span className="time-badge">{t.time}</span>
              </footer>
            </motion.article>
          ))
        )}
      </div>

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        setPage={setPage}
      />
    </section>
  );
};

export default Testimonial;