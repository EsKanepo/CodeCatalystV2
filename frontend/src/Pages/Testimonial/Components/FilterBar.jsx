import { courseOptions, timeOptions } from "../testimonialData";

const FilterBar = ({ filters, setFilters, resetPage }) => {
  const update = (key, value) => {
    resetPage();
    setFilters({ ...filters, [key]: value });
  };

  return (
    <div className="filter-wrapper">
      <div className="filter-group">
        <span>Kursus Utama</span>
        {courseOptions.map((v) => (
          <button
            key={v}
            className={filters.course === v ? "active" : ""}
            onClick={() => update("course", v)}
          >
            {v}
          </button>
        ))}
      </div>

      <div className="filter-group">
        <span>Waktu</span>
        {timeOptions.map((v) => (
          <button
            key={v}
            className={filters.time === v ? "active" : ""}
            onClick={() => update("time", v)}
          >
            {v}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FilterBar;
