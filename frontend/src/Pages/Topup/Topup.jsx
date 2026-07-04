import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { usePoints } from "../../context/PointsContext";
import { paymentAPI } from "../../api/client";
import "./Topup.css";

const Topup = () => {
  const { user, setUser } = useAuth();
  const { userPoints, topupPoints, upgradeToPremium, syncPointsFromServer } = usePoints();
  const [selectedAmount, setSelectedAmount] = useState("");
  const [customAmount, setCustomAmount] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [premiumInfo, setPremiumInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        await syncPointsFromServer();
        const res = await paymentAPI.getPremiumInfo();
        if (res.data.success) setPremiumInfo(res.data.data);
      } catch (err) {
        console.error('Error loading topup data:', err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [user, syncPointsFromServer]);

  const presetAmounts = [
    { amount: 100, bonus: 0, label: "100" },
    { amount: 250, bonus: 25, label: "250" },
    { amount: 500, bonus: 50, label: "500" },
    { amount: 1000, bonus: 100, label: "1.000" },
    { amount: 2500, bonus: 250, label: "2.500" },
    { amount: 5000, bonus: 500, label: "5.000" }
  ];

  const topupMethods = [
    { id: "free", name: "Free Topup", icon: "fa-gift", description: "Topup demo untuk testing" },
    { id: "promo", name: "Promo Code", icon: "fa-ticket", description: "Gunakan kode promo (demo)" }
  ];

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (value === "" || (parseInt(value) >= 100 && parseInt(value) <= 10000)) {
      setCustomAmount(value);
      setSelectedAmount("");
    }
  };

  const getTopupAmount = () => {
    if (selectedAmount) return selectedAmount;
    if (customAmount) return parseInt(customAmount);
    return 0;
  };

  const calculateBonus = (amount) => {
    if (amount >= 5000) return Math.floor(amount * 0.1);
    if (amount >= 2500) return Math.floor(amount * 0.05);
    if (amount >= 1000) return Math.floor(amount * 0.025);
    if (amount >= 500) return 50;
    if (amount >= 250) return 25;
    return 0;
  };

  const amount = getTopupAmount();
  const bonus = calculateBonus(amount);
  const total = amount + bonus;

  const handlePayment = async () => {
    if (!amount) {
      alert("Silakan pilih nominal topup");
      return;
    }
    if (!selectedMethod) {
      alert("Silakan pilih metode topup");
      return;
    }

    setIsProcessing(true);
    try {
      const result = await topupPoints(amount);
      alert(`Topup berhasil! +${result.amountAdded} CP (bonus ${result.bonus} CP). Saldo: ${result.userPoint.toLocaleString()} CP`);
      setSelectedAmount("");
      setCustomAmount("");
      setSelectedMethod("");
    } catch (err) {
      alert(err.response?.data?.message || "Terjadi kesalahan saat topup.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePremiumUpgrade = async () => {
    if (!window.confirm(`Upgrade ke Premium dengan ${premiumInfo?.cost} CodePoints? Semua kursus terkunci akan terbuka.`)) return;

    setIsProcessing(true);
    try {
      const result = await upgradeToPremium();
      if (result.data?.user) {
        setUser(result.data.user);
      }
      const res = await paymentAPI.getPremiumInfo();
      if (res.data.success) setPremiumInfo(res.data.data);
      alert(result.message || "Upgrade Premium berhasil!");
    } catch (err) {
      alert(err.response?.data?.message || "Gagal upgrade ke Premium.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="topup-page">
      <div className="container">
        <div className="topup-header">
          <h1>Top Up Codepoints</h1>
          <p>Tambah Codepoints untuk akses kursus premium</p>
        </div>

        <div className="topup-balance-card">
          <div className="balance-header">
            <h3>Current Balance</h3>
          </div>
          <div className="balance-display">
            {loading ? (
              <div className="loading-spinner">
                <i className="fa-solid fa-spinner fa-spin"></i>
                <span>Loading...</span>
              </div>
            ) : (
              <div className="balance-info">
                <div className="balance-amount">
                  <span className="amount">{userPoints.toLocaleString()}</span>
                  <span className="currency">CP</span>
                </div>
                <div className="balance-icon">
                  <i className="fa-solid fa-coins"></i>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Premium Upgrade Section */}
        {premiumInfo && user?.role === 'student' && (
          <div className="topup-card mb-4" style={{ border: '2px solid #ffc107' }}>
            <div className="card-header">
              <h3><i className="fa-solid fa-crown me-2 text-warning"></i>Upgrade ke Premium</h3>
              <p className="card-description">Akses semua kursus terkunci tanpa membeli satu per satu</p>
            </div>
            <div className="p-3">
              <div className="d-flex justify-content-between align-items-center flex-wrap gap-3">
                <div>
                  <p className="mb-1"><strong>Biaya:</strong> {premiumInfo.cost.toLocaleString()} CodePoints</p>
                  <p className="mb-0 text-muted small">Saldo Anda: {userPoints.toLocaleString()} CP</p>
                </div>
                <button
                  className="btn btn-warning"
                  onClick={handlePremiumUpgrade}
                  disabled={isProcessing || !premiumInfo.canUpgrade}
                >
                  {isProcessing ? (
                    <><i className="fa-solid fa-spinner fa-spin me-2"></i>Memproses...</>
                  ) : (
                    <><i className="fa-solid fa-crown me-2"></i>Upgrade Premium</>
                  )}
                </button>
              </div>
              {!premiumInfo.canUpgrade && (
                <p className="text-danger small mt-2 mb-0">
                  <i className="fa-solid fa-info-circle me-1"></i>
                  CodePoints tidak cukup. Topup terlebih dahulu.
                </p>
              )}
            </div>
          </div>
        )}

        {user?.role === 'premium' && (
          <div className="alert alert-success mb-4">
            <i className="fa-solid fa-crown me-2"></i>
            Anda sudah memiliki akun <strong>Premium</strong>. Semua kursus terkunci dapat diakses.
          </div>
        )}

        <div className="topup-content">
          <div className="topup-card">
            <div className="card-header">
              <h3>Pilih Nominal Codepoints</h3>
              <p className="card-description">Pilih nominal topup atau masukkan nominal custom</p>
            </div>

            <div className="amount-options">
              {presetAmounts.map((preset) => (
                <button
                  key={preset.amount}
                  className={`amount-btn ${selectedAmount === preset.amount ? "selected" : ""}`}
                  onClick={() => handleAmountSelect(preset.amount)}
                >
                  <div className="amount-label">{preset.label} CP</div>
                  {preset.bonus > 0 && (
                    <div className="amount-bonus">+{preset.bonus} CP Bonus</div>
                  )}
                </button>
              ))}
            </div>

            <div className="custom-amount-section">
              <label htmlFor="customAmount">Atau masukkan nominal custom (100 - 10.000 CP)</label>
              <div className="custom-amount-input">
                <input
                  type="number"
                  id="customAmount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  placeholder="Masukkan nominal"
                  min="100"
                  max="10000"
                  step="50"
                />
                <span className="currency-suffix">CP</span>
              </div>
            </div>
          </div>

          <div className="topup-card">
            <div className="card-header">
              <h3>Metode Topup</h3>
            </div>
            <div className="topup-methods">
              {topupMethods.map((method) => (
                <label key={method.id} className="topup-method-option">
                  <input
                    type="radio"
                    name="topupMethod"
                    value={method.id}
                    checked={selectedMethod === method.id}
                    onChange={(e) => setSelectedMethod(e.target.value)}
                  />
                  <div className={`topup-method-card ${selectedMethod === method.id ? "selected" : ""}`}>
                    <div className="method-icon">
                      <i className={`fa-solid ${method.icon}`}></i>
                    </div>
                    <div className="method-info">
                      <h4>{method.name}</h4>
                      <p>{method.description}</p>
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {amount > 0 && (
            <div className="topup-card">
              <div className="card-header"><h3>Ringkasan Topup</h3></div>
              <div className="order-summary">
                <div className="summary-item">
                  <span>Nominal Topup</span>
                  <span>{amount.toLocaleString()} CP</span>
                </div>
                {bonus > 0 && (
                  <div className="summary-item bonus">
                    <span>Bonus Codepoints</span>
                    <span>+{bonus.toLocaleString()} CP</span>
                  </div>
                )}
                <div className="summary-divider"></div>
                <div className="summary-item total">
                  <span>Total Codepoints</span>
                  <span>{total.toLocaleString()} CP</span>
                </div>
              </div>
              <div className="payment-actions">
                <button
                  className="btn btn-accent payment-btn"
                  onClick={handlePayment}
                  disabled={isProcessing || !selectedMethod}
                >
                  {isProcessing ? (
                    <><i className="fa-solid fa-spinner fa-spin me-2"></i>Memproses...</>
                  ) : (
                    <><i className="fa-solid fa-gift me-2"></i>Topup Sekarang</>
                  )}
                </button>
              </div>
            </div>
          )}

          <div className="info-notice">
            <div className="notice-icon"><i className="fa-solid fa-info-circle"></i></div>
            <div className="notice-content">
              <h4>Topup Demo</h4>
              <p>Ini adalah halaman topup demo. Pembayaran diproses secara aman di server dengan validasi nominal dan bonus.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Topup;
