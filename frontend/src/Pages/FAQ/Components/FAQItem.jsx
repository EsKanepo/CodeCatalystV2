import { useState } from "react";

const FAQItem = ({ category, tag, question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={`faq-item ${open ? "open" : ""}`}>
      {/* SUB INFO */}
      <div className="faq-meta">
        <span className="faq-category">{category}</span>
        {tag ? <span className="faq-tag">{tag}</span> : null}
      </div>

      <div className="faq-header">
        <button className="faq-question" onClick={() => setOpen(!open)}>
          {question}
          <i className={`fa-solid fa-chevron-${open ? "up" : "down"}`}></i>
        </button>
      </div>

      {open && <div className="faq-answer">{answer}</div>}
    </div>
  );
};

export default FAQItem;
