import React from "react";

const Pagination = ({ totalPages, currentPage, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="pagination">
      {[...Array(totalPages)].map((_, i) => (
        <button
          key={i}
          className={currentPage === i + 1 ? "active" : ""}
          onClick={() => onPageChange(i + 1)}
        >
          {i + 1}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
