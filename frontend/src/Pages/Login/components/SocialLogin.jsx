const SocialLogin = ({ onGoogleLogin }) => {
  return (
    <div className="social-login">
      <p>Atau masuk dengan</p>

      <button
        type="button"
        className="social-btn google"
        onClick={() => {
          console.log("GOOGLE BUTTON CLICKED"); // 🔥 debug
          onGoogleLogin();
        }}
      >
        <i className="fa-brands fa-google"></i> Google
      </button>
    </div>
  );
};

export default SocialLogin;