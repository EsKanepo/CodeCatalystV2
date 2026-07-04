const FAQFilter = ({ active, setActive, categories }) => (
  <div className="faq-filter">
    {categories.map((cat) => (
      <button
        key={cat}
        className={active === cat ? "active" : ""}
        onClick={() => setActive(cat)}
      >
        {cat}
      </button>
    ))}
  </div>
);

export default FAQFilter;
