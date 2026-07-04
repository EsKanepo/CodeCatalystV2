import { Link } from "react-router-dom";

const FeatureCard = ({ item }) => {
  return (
    <Link to={item.link} className="feature-link-item">
      <div className="feature-card h-100 animate-fadeInUp">
        <div className="feature-icon-wrapper">
          <i className={`fas ${item.icon} fa-2x`}></i>
        </div>
        <div className="feature-content">
          <h5>{item.title}</h5>
          <p className="feature-desc">{item.desc}</p>
          <div className="feature-arrow">
            <i className="fas fa-arrow-right"></i>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default FeatureCard;
