import { useState, useEffect } from "react";
import "./FAQ.css";

import FAQSearch from "./Components/FAQSearch";
import FAQFilter from "./Components/FAQFilter";
import FAQItem from "./Components/FAQItem";
import { categories } from "./faqData";
import { api } from "../../api/client";

const FAQ = () => {
  const [faqs, setFaqs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Semua");

  // PAGINATION STATE
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Fetch FAQs from MySQL
  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    setError("");
    try {
      const response = await api.get('/faqs?limit=100');
      setFaqs(response.data.data);
    } catch (err) {
      setError("Gagal memuat FAQ");
      console.error('FAQ Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto refresh setiap 30 detik
  useEffect(() => {
    const interval = setInterval(() => {
      fetchFaqs();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // FILTER DATA
  const filtered = faqs.filter((f) => {
    const matchCategory =
      category === "Semua" || f.category === category;
    const matchSearch =
      f.question.toLowerCase().includes(search.toLowerCase()) ||
      f.answer.toLowerCase().includes(search.toLowerCase());

    return matchCategory && matchSearch;
  });

  // RESET PAGE JIKA FILTER / SEARCH BERUBAH
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = filtered.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  return (
    <>
      <section className="page-header">
        <h1>FAQ</h1>
        <p>Pertanyaan yang sering diajukan</p>
      </section>

      <section className="faq-container">
        <FAQSearch search={search} setSearch={setSearch} />
        <FAQFilter
          active={category}
          setActive={(cat) => {
            setCategory(cat);
            setCurrentPage(1);
          }}
          categories={categories}
        />

        <div className="faq-list">
          {isLoading ? (
            <p className="empty">Memuat FAQ...</p>
          ) : error ? (
            <p className="empty error">{error}</p>
          ) : paginatedData.length ? (
            paginatedData.map((item) => (
              <FAQItem 
                key={item.id} 
                {...item}
              />
            ))
          ) : (
            <p className="empty">Pertanyaan tidak ditemukan.</p>
          )}
        </div>

        {/* PAGINATION */}
        {totalPages > 1 && (
          <div className="faq-pagination">
            <button
              className="page-btn"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
            >
              <i className="fa-solid fa-chevron-left"></i>
            </button>
            
            {Array.from({ length: totalPages }).map((_, i) => (
              <button
                key={i}
                className={`page-btn ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              className="page-btn"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
            >
              <i className="fa-solid fa-chevron-right"></i>
            </button>
          </div>
        )}
      </section>
    </>
  );
};

export default FAQ;
