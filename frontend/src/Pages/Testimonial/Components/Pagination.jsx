const Pagination = ({ currentPage, totalPages, setPage }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {Array.from({ length: totalPages }, (_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => setPage(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
