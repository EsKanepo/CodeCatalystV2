const FAQSearch = ({ search, setSearch }) => (
  <input
    type="text"
    className="faq-search"
    placeholder="Cari pertanyaan..."
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />
);

export default FAQSearch;
