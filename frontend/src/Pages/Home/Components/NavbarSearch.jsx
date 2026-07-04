import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { searchPages } from "../data/SearchPages";

const NavbarSearch = () => {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const results = searchPages.filter((page) =>
    page.title.toLowerCase().includes(query.toLowerCase()) ||
    page.keywords.some((k) =>
      k.toLowerCase().includes(query.toLowerCase())
    )
  );

  return (
    <div className="position-relative">
      <input
        type="text"
        className="form-control"
        placeholder="Cari halaman..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ width: "220px" }}
      />

      {query && (
        <ul className="list-group position-absolute w-100 shadow">
          {results.length ? (
            results.map((item, i) => (
              <li
                key={i}
                className="list-group-item list-group-item-action"
                onClick={() => {
                  navigate(item.path);
                  setQuery("");
                }}
                style={{ cursor: "pointer" }}
              >
                {item.title}
              </li>
            ))
          ) : (
            <li className="list-group-item text-muted">
              Tidak ditemukan
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

export default NavbarSearch;