import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { usePoints } from "../../../context/PointsContext";
import { useState, useEffect } from "react";
import { api } from "../../../api/client";

const CourseItem = ({
  course,
  progress = 0,
  onLocked,
}) => {
  const { user } = useAuth();
  const { isEnrolledInCourse, purchaseCourse, userPoints } = usePoints();
  const navigate = useNavigate();
  const [isPurchasing, setIsPurchasing] = useState(false);

  const {
    id,
    category,
    title,
    description,
    duration,
    level,
    modules,
    lessons,
    projects,
    price,
    originalPrice,
    rating,
    students,
    instructor,
    topics,
    isLocked,
    isFree
  } = course;

  const getCoinPrice = (price) => {
    if (isFree) return 0;
    if (price <= 299000) return 100;
    if (price <= 499000) return 200;
    if (price <= 699000) return 300;
    if (price <= 899000) return 400;
    return 500;
  };

  const coinPrice = getCoinPrice(price);

  // Check if user has access: free courses always accessible, locked courses need enrollment or purchase
  const isEnrolled = isEnrolledInCourse(id);
  const isPremiumOrAdmin = user?.role === "premium" || user?.role === "admin";
  const hasAccess = isFree || !isLocked || isEnrolled || isPremiumOrAdmin;
  const canAfford = userPoints >= coinPrice;

  const handlePurchase = async () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk membeli kursus.");
      navigate("/login");
      return;
    }

    // Check if user has enough coins
    if (!canAfford) {
      alert("Coin anda tidak cukup, silahkan topup dahulu.");
      navigate("/topup");
      return;
    }

    // Show confirmation dialog
    const confirmed = window.confirm(`Apakah kamu ingin membeli kursus "${title}" dengan ${coinPrice} coin?`);
    if (!confirmed) {
      return;
    }

    setIsPurchasing(true);

    try {
      const success = await purchaseCourse(id, title, price, isFree);
      if (success) {
        alert(`🎉 Berhasil membeli kursus ${title}! Kamu telah menghabiskan ${coinPrice} coin.`);
      } else {
        alert("❌ Gagal membeli kursus. Silakan coba lagi.");
      }
    } catch (error) {
      console.error('Purchase error:', error);
      alert(`❌ Terjadi kesalahan: ${error.response?.data?.message || error.message}`);
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleClick = () => {
    if (!user) {
      alert("Silakan login terlebih dahulu untuk mengakses kursus.");
      navigate("/login");
      return;
    }
    if (!hasAccess) {
      // Show purchase modal or redirect to purchase
      handlePurchase();
      return;
    }
    navigate(`/${category === 'js' ? 'javascript' : category}`);
  };
  
  const discountPercentage = originalPrice > price && price > 0 ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

  const courseContent = (
    <div className="course-card">
      <div className="course-header">
        <div className="course-icon">
          <i className={`fa-brands ${getCategoryIcon(category)} ${getCategoryColor(category)}`}></i>
        </div>
        <div className="course-badges">
          <span className="level-badge">{level}</span>
          {isFree && <span className="free-badge">FREE</span>}
          {isLocked && !hasAccess && <span className="locked-badge">🔒 LOCKED</span>}
        </div>
      </div>

      <div className="course-body">
        <h4 className="course-title">{title}</h4>
        <p className="course-description">{description}</p>
        
        <div className="course-instructor">
          <i className="fa-solid fa-user-tie me-1"></i>
          {instructor}
        </div>

        <div className="course-stats">
          <div className="stat-item">
            <i className="fa-solid fa-clock me-1"></i>
            <span>{duration}</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-book me-1"></i>
            <span>{modules} modul</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-video me-1"></i>
            <span>{lessons} video</span>
          </div>
          <div className="stat-item">
            <i className="fa-solid fa-project-diagram me-1"></i>
            <span>{projects} project</span>
          </div>
        </div>

        <div className="course-rating">
          <div className="stars">
            {"★".repeat(Math.floor(rating))}
            {"☆".repeat(5 - Math.floor(rating))}
          </div>
          <span className="rating-number">{rating}</span>
          <span className="students-count">({students} siswa)</span>
        </div>

        <div className="course-topics">
          <h6>Topik Utama:</h6>
          <div className="topics-list">
            {topics.slice(0, 3).map((topic, index) => (
              <span key={index} className="topic-tag">{topic}</span>
            ))}
            {topics.length > 3 && <span className="topic-more">+{topics.length - 3} lagi</span>}
          </div>
        </div>

        <div className="course-footer">
          <div className="course-price">
            {isFree ? (
              <span className="free-price">GRATIS</span>
            ) : (
              <>
                {isLocked ? (
                  <>
                    {isEnrolled ? (
                      <span className="owned-price">
                        <i className="fa-solid fa-check-circle me-1"></i>
                        Sudah Dibeli
                      </span>
                    ) : isPremiumOrAdmin ? (
                      <span className="owned-price">
                        <i className="fa-solid fa-star me-1"></i>
                        Included with Premium
                      </span>
                    ) : (
                      <span className="coin-price">
                        <i className="fa-solid fa-coins me-1"></i>
                        {coinPrice} Coin
                      </span>
                    )}
                  </>
                ) : (
                  <>
                    {discountPercentage > 0 && (
                      <span className="original-price">Rp {originalPrice.toLocaleString('id-ID')}</span>
                    )}
                    <span className="current-price">Rp {price.toLocaleString('id-ID')}</span>
                    {discountPercentage > 0 && (
                      <span className="discount-badge">-{discountPercentage}%</span>
                    )}
                  </>
                )}
              </>
            )}
          </div>
          
          {progress > 0 && (
            <div className="course-progress">
              <div className="progress-label">Progress: {progress}%</div>
              <div className="progress-bar-container">
                <div className="progress-bar-fill" style={{ width: `${progress}%` }}></div>
              </div>
            </div>
          )}
        </div>
      </div>

      {!hasAccess && isLocked && (
        <div className="course-overlay">
          <div className="overlay-content">
            <i className="fas fa-lock"></i>
            <h5>Kursus Terkunci</h5>
            <p>Bel kursus ini dengan {coinPrice} Coin!</p>
            <div className="coin-info">
              <span className="coin-amount">
                <i className="fa-solid fa-coins me-1"></i>
                {coinPrice} Coin
              </span>
              <span className={`your-coins ${canAfford ? 'can-afford' : 'cannot-afford'}`}>
                <i className="fa-solid fa-wallet me-1"></i>
                Kamu punya: {userPoints} Coin
              </span>
            </div>
            <button 
              className={`btn ${canAfford ? 'btn-primary' : 'btn-disabled'}`} 
              onClick={handlePurchase}
              disabled={!canAfford || isPurchasing}
            >
              {isPurchasing ? (
                <>
                  <i className="fas fa-spinner fa-spin me-2"></i>
                  Memproses...
                </>
              ) : canAfford ? (
                <>
                  <i className="fas fa-shopping-cart me-2"></i>
                  Beli Sekarang
                </>
              ) : (
                <>
                  <i className="fas fa-plus-circle me-2"></i>
                  Topup Dulu
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  return (
    <div className="course-item-wrapper">
      {hasAccess ? (
        <Link to={`/${category === 'js' ? 'javascript' : category}`} className="course-link-item">
          {courseContent}
        </Link>
      ) : (
        <div className="course-link-item locked" onClick={onLocked}>
          {courseContent}
        </div>
      )}
    </div>
  );
};

// Helper functions to get icon and color based on category
const getCategoryIcon = (category) => {
  const icons = {
    html: 'fa-html5',
    css: 'fa-css3-alt',
    js: 'fa-js',
    bootstrap: 'fa-bootstrap',
    react: 'fa-react',
    nodejs: 'fa-node-js',
    vue: 'fa-vuejs',
    typescript: 'fa-code',
    git: 'fa-git-alt',
    docker: 'fa-docker'
  };
  return icons[category] || 'fa-code';
};

const getCategoryColor = (category) => {
  const colors = {
    html: 'text-warning',
    css: 'text-info',
    js: 'text-warning',
    bootstrap: 'text-purple',
    react: 'text-primary',
    nodejs: 'text-success',
    vue: 'text-success',
    typescript: 'text-info',
    git: 'text-danger',
    docker: 'text-info'
  };
  return colors[category] || 'text-primary';
};

export default CourseItem;
