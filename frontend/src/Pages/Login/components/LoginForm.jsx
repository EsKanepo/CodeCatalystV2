const LoginForm = ({ form, onChange, onSubmit, errors, isSubmitting }) => (
  <form onSubmit={onSubmit} className="login-form" noValidate>
    {errors.submit && (
      <div className="alert alert-danger" role="alert">
        <i className="fa-solid fa-circle-exclamation me-2"></i>
        {errors.submit}
      </div>
    )}

    <div className="input-group">
      <label>
        <i className="fa-solid fa-envelope"></i> Email
      </label>
      <input
        type="email"
        name="email"
        placeholder="Masukkan email Anda"
        value={form.email}
        onChange={onChange}
        className={errors.email ? 'is-invalid' : ''}
      />
      {errors.email && <small className="text-danger">{errors.email}</small>}
    </div>

    <div className="input-group">
      <label>
        <i className="fa-solid fa-lock"></i> Password
      </label>
      <input
        type="password"
        name="password"
        placeholder="Masukkan password Anda"
        value={form.password}
        onChange={onChange}
        className={errors.password ? 'is-invalid' : ''}
      />
      {errors.password && <small className="text-danger">{errors.password}</small>}
    </div>

    <button type="submit" className="submit-btn" disabled={isSubmitting}>
      <i className="fa-solid fa-sign-in-alt"></i> {isSubmitting ? 'Masuk...' : 'Masuk Sekarang'}
    </button>
  </form>
);

export default LoginForm;
