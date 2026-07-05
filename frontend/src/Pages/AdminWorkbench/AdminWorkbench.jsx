import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { adminAPI, faqAPI, testimonialAPI } from '../../api/client';
import './AdminWorkbench.css';

const TABS = [
  { id: 'dashboard', label: 'Dashboard', icon: 'fa-chart-line' },
  { id: 'users', label: 'Pengguna', icon: 'fa-users' },
  { id: 'faq', label: 'FAQ', icon: 'fa-circle-question' },
  { id: 'testimonials', label: 'Testimonial', icon: 'fa-star' },
];

const EMPTY_FAQ = { question: '', answer: '', category: 'general' };
const EMPTY_TESTIMONIAL = { name: '', email: '', role_title: 'Student', course_category: 'General', rating: 5, testimonial: '' };

const getCoinPrice = (price, isFree) => {
  if (isFree) return 0;
  const coursePrice = parseFloat(price) || 0;
  if (coursePrice <= 299000) return 100;
  if (coursePrice <= 499000) return 200;
  if (coursePrice <= 699000) return 300;
  if (coursePrice <= 899000) return 400;
  return 500;
};

const AdminWorkbench = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [stats, setStats] = useState(null);
  const [sales, setSales] = useState([]);
  const [users, setUsers] = useState([]);
  const [usersProgress, setUsersProgress] = useState([]);
  const [expandedUser, setExpandedUser] = useState(null);

  const [faqs, setFaqs] = useState([]);
  const [faqForm, setFaqForm] = useState(EMPTY_FAQ);
  const [editingFaqId, setEditingFaqId] = useState(null);

  const [testimonials, setTestimonials] = useState([]);
  const [testimonialForm, setTestimonialForm] = useState(EMPTY_TESTIMONIAL);
  const [editingTestimonialId, setEditingTestimonialId] = useState(null);

  const maxSales = Math.max(...sales.map(s => s.purchase_count || 0), 1);

  const loadDashboard = useCallback(async () => {
    const [statsRes, salesRes] = await Promise.all([
      adminAPI.getStats(),
      adminAPI.getCourseSales()
    ]);
    if (statsRes.data.success) setStats(statsRes.data.data);
    if (salesRes.data.success) setSales(salesRes.data.data);
  }, []);

  const loadUsers = useCallback(async () => {
    const [usersRes, progressRes] = await Promise.all([
      adminAPI.getUsers(),
      adminAPI.getUsersProgress()
    ]);
    if (usersRes.data.success) setUsers(usersRes.data.data);
    if (progressRes.data.success) setUsersProgress(progressRes.data.data);
  }, []);

  const loadFaqs = useCallback(async () => {
    const res = await faqAPI.getAll(1, 100);
    if (res.data.success) setFaqs(res.data.data);
  }, []);

  const loadTestimonials = useCallback(async () => {
    const res = await testimonialAPI.getAll(1, 100);
    if (res.data.success) setTestimonials(res.data.data);
  }, []);

  useEffect(() => {
    if (!user || user.role !== 'admin') {
      navigate('/');
      return;
    }

    const loadAll = async () => {
      setLoading(true);
      setError('');
      try {
        await Promise.all([loadDashboard(), loadUsers(), loadFaqs(), loadTestimonials()]);
      } catch (err) {
        setError('Gagal memuat data admin. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, [user, navigate, loadDashboard, loadUsers, loadFaqs, loadTestimonials]);

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus user ini?')) return;
    try {
      const res = await adminAPI.deleteUser(userId);
      if (res.data.success) {
        setUsers(users.filter(u => u.id !== userId));
        setUsersProgress(usersProgress.filter(u => u.id !== userId));
      } else {
        alert(res.data.message || 'Gagal menghapus user.');
      }
    } catch {
      alert('Terjadi kesalahan.');
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      const res = await adminAPI.updateUserRole(userId, newRole);
      if (res.data.success) {
        setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u));
        setUsersProgress(usersProgress.map(u => u.id === userId ? { ...u, role: newRole } : u));
      } else {
        alert(res.data.message || 'Gagal mengubah role.');
      }
    } catch {
      alert('Terjadi kesalahan.');
    }
  };

  const handleFaqSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingFaqId) {
        const res = await faqAPI.update(editingFaqId, faqForm);
        if (res.data.success) {
          setFaqs(faqs.map(f => f.id === editingFaqId ? res.data.data : f));
          setEditingFaqId(null);
          setFaqForm(EMPTY_FAQ);
          // Broadcast update ke tab lain
          const channel = new BroadcastChannel('faq_updates');
          channel.postMessage({ type: 'faq_updated' });
          channel.close();
        }
      } else {
        const res = await faqAPI.create(faqForm);
        if (res.data.success) {
          setFaqs([res.data.data, ...faqs]);
          setFaqForm(EMPTY_FAQ);
          // Broadcast update ke tab lain
          const channel = new BroadcastChannel('faq_updates');
          channel.postMessage({ type: 'faq_updated' });
          channel.close();
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan FAQ.');
    }
  };

  const handleFaqEdit = (faq) => {
    setEditingFaqId(faq.id);
    setFaqForm({ question: faq.question, answer: faq.answer, category: faq.category });
  };

  const handleFaqDelete = async (id) => {
    if (!window.confirm('Hapus FAQ ini?')) return;
    try {
      await faqAPI.delete(id);
      setFaqs(faqs.filter(f => f.id !== id));
      // Broadcast update ke tab lain
      const channel = new BroadcastChannel('faq_updates');
      channel.postMessage({ type: 'faq_updated' });
      channel.close();
    } catch {
      alert('Gagal menghapus FAQ.');
    }
  };

  const handleTestimonialSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingTestimonialId) {
        const res = await testimonialAPI.update(editingTestimonialId, testimonialForm);
        if (res.data.success) {
          setTestimonials(testimonials.map(t => t.id === editingTestimonialId ? res.data.data : t));
          setEditingTestimonialId(null);
          setTestimonialForm(EMPTY_TESTIMONIAL);
          // Broadcast update ke tab lain
          const channel = new BroadcastChannel('testimonial_updates');
          channel.postMessage({ type: 'testimonial_updated' });
          channel.close();
        }
      } else {
        const res = await testimonialAPI.create(testimonialForm);
        if (res.data.success) {
          setTestimonials([res.data.data, ...testimonials]);
          setTestimonialForm(EMPTY_TESTIMONIAL);
          // Broadcast update ke tab lain
          const channel = new BroadcastChannel('testimonial_updates');
          channel.postMessage({ type: 'testimonial_updated' });
          channel.close();
        }
      }
    } catch (err) {
      alert(err.response?.data?.error || 'Gagal menyimpan testimonial.');
    }
  };

  const handleTestimonialEdit = (t) => {
    setEditingTestimonialId(t.id);
    setTestimonialForm({
      name: t.name || '',
      email: t.email || '',
      role_title: t.role_title || 'Student',
      course_category: t.course_category || 'General',
      rating: t.rating || 5,
      testimonial: t.testimonial || ''
    });
  };

  const handleTestimonialDelete = async (id) => {
    if (!window.confirm('Hapus testimonial ini?')) return;
    try {
      await testimonialAPI.delete(id);
      setTestimonials(testimonials.filter(t => t.id !== id));
      // Broadcast update ke tab lain
      const channel = new BroadcastChannel('testimonial_updates');
      channel.postMessage({ type: 'testimonial_updated' });
      channel.close();
    } catch {
      alert('Gagal menghapus testimonial.');
    }
  };

  const getUserProgressData = (userId) => usersProgress.find(u => u.id === userId);

  if (loading) {
    return (
      <div className="admin-workbench">
        <div className="container mt-5 pt-5 text-center py-5">
          <i className="fa-solid fa-spinner fa-spin fa-2x text-primary mb-3"></i>
          <p>Memuat Admin Panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-workbench">
      <div className="admin-header">
        <div className="container">
          <h2 className="mb-1"><i className="fa-solid fa-shield-halved me-2"></i>Admin Panel</h2>
          <p className="mb-0 opacity-75">Kelola platform CodeCatalyst</p>
        </div>
      </div>

      <div className="container pb-5">
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="admin-tabs">
          {TABS.map(tab => (
            <button
              key={tab.id}
              className={`admin-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <i className={`fa-solid ${tab.icon} me-2`}></i>{tab.label}
            </button>
          ))}
        </div>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <>
            <div className="row mb-4 g-3">
              {[
                { label: 'Total Users', value: stats?.totalUsers, color: 'primary', icon: 'fa-users' },
                { label: 'Premium Users', value: stats?.premiumUsers, color: 'warning', icon: 'fa-crown' },
                { label: 'Total Courses', value: stats?.totalCourses, color: 'info', icon: 'fa-book' },
                { label: 'Total Enrollments', value: stats?.totalEnrollments, color: 'success', icon: 'fa-graduation-cap' },
              ].map((card, i) => (
                <div className="col-md-3 col-6" key={i}>
                  <div className={`card stat-card text-white bg-${card.color}`}>
                    <div className="card-body">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <h6 className="card-title mb-1 opacity-75">{card.label}</h6>
                          <p className="display-6 mb-0">{card.value ?? 0}</p>
                        </div>
                        <i className={`fa-solid ${card.icon} fa-2x opacity-50`}></i>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="admin-table-card">
              <div className="card-header bg-dark text-white py-3">
                <h5 className="mb-0"><i className="fa-solid fa-chart-bar me-2"></i>Penjualan Course</h5>
              </div>
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="table-light">
                    <tr>
                      <th>Course</th>
                      <th>Kategori</th>
                      <th>Harga</th>
                      <th>Tipe</th>
                      <th style={{ minWidth: 200 }}>Pembelian</th>
                      <th className="text-center">Jumlah</th>
                      <th className="text-center">Aktif</th>
                      <th className="text-center">Selesai</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sales.map(course => (
                      <tr key={course.id}>
                        <td><strong>{course.title}</strong></td>
                        <td><span className="badge bg-secondary">{course.category}</span></td>
                        <td>{course.is_free ? 'Gratis' : `${getCoinPrice(course.price, course.is_free)} Coin`}</td>
                        <td>
                          {course.is_free ? <span className="badge bg-success">Free</span>
                            : course.is_locked ? <span className="badge bg-warning text-dark">Premium</span>
                            : <span className="badge bg-info">Paid</span>}
                        </td>
                        <td>
                          <div className="d-flex align-items-center gap-2">
                            <div className="sales-bar-container flex-grow-1">
                              <div
                                className="sales-bar-fill"
                                style={{ width: `${((course.purchase_count || 0) / maxSales) * 100}%` }}
                              />
                            </div>
                          </div>
                        </td>
                        <td className="text-center fw-bold text-primary">{course.purchase_count || 0}</td>
                        <td className="text-center">{course.active_enrollments || 0}</td>
                        <td className="text-center">{course.completed_enrollments || 0}</td>
                      </tr>
                    ))}
                    {sales.length === 0 && (
                      <tr><td colSpan="8" className="text-center py-4 text-muted">Belum ada data penjualan.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-table-card">
            <div className="card-header bg-dark text-white py-3">
              <h5 className="mb-0"><i className="fa-solid fa-users me-2"></i>Manajemen Pengguna & Progress</h5>
            </div>
            <div className="table-responsive">
              <table className="table table-hover mb-0 align-middle">
                <thead className="table-light">
                  <tr>
                    <th></th>
                    <th>ID</th>
                    <th>Nama</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>CodePoints</th>
                    <th>Course Diambil</th>
                    <th>Bergabung</th>
                    <th>Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => {
                    const progressData = getUserProgressData(u.id);
                    const isExpanded = expandedUser === u.id;
                    return (
                      <React.Fragment key={u.id}>
                        <tr>
                          <td>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => setExpandedUser(isExpanded ? null : u.id)}
                              title="Lihat progress"
                            >
                              <i className={`fa-solid fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
                            </button>
                          </td>
                          <td>{u.id}</td>
                          <td>{u.name}</td>
                          <td>{u.email}</td>
                          <td>
                            <select
                              className="form-select form-select-sm"
                              value={u.role}
                              onChange={(e) => handleRoleChange(u.id, e.target.value)}
                              disabled={u.id === user.id}
                              style={{ minWidth: 100 }}
                            >
                              <option value="student">Student</option>
                              <option value="premium">Premium</option>
                              <option value="admin">Admin</option>
                            </select>
                          </td>
                          <td>{progressData?.userPoint ?? '-'}</td>
                          <td>
                            <span className="badge bg-primary">{progressData?.courses?.length || 0} course</span>
                          </td>
                          <td>{new Date(u.created_at).toLocaleDateString('id-ID')}</td>
                          <td>
                            <button
                              className="btn btn-sm btn-danger"
                              onClick={() => handleDeleteUser(u.id)}
                              disabled={u.id === user.id}
                            >
                              <i className="fa-solid fa-trash"></i>
                            </button>
                          </td>
                        </tr>
                        {isExpanded && (
                          <tr className="user-progress-row">
                            <td colSpan="9" className="p-3">
                              <h6 className="mb-3"><i className="fa-solid fa-chart-pie me-2"></i>Progress {u.name}</h6>
                              {progressData?.courses?.length > 0 ? (
                                <div className="row g-2">
                                  {progressData.courses.map((c, idx) => (
                                    <div className="col-md-6 col-lg-4" key={idx}>
                                      <div className="card h-100">
                                        <div className="card-body py-2 px-3">
                                          <div className="d-flex justify-content-between align-items-start mb-1">
                                            <strong className="small">{c.courseTitle}</strong>
                                            <span className={`badge ${c.percentage >= 100 ? 'bg-success' : c.percentage > 0 ? 'bg-primary' : 'bg-secondary'}`}>
                                              {c.percentage}%
                                            </span>
                                          </div>
                                          <div className="progress-mini mb-1">
                                            <div className="progress-mini-fill" style={{ width: `${c.percentage}%` }} />
                                          </div>
                                          <small className="text-muted">
                                            {c.weeksCompleted}/{c.totalWeeks} minggu ·
                                            <span className={`ms-1 badge badge-sm ${c.enrollmentStatus === 'completed' ? 'bg-success' : 'bg-info'}`}>
                                              {c.enrollmentStatus}
                                            </span>
                                          </small>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-muted mb-0 small">Belum mengambil course apapun.</p>
                              )}
                              {progressData?.enrolledCourseIds?.length > 0 && (
                                <div className="mt-2">
                                  <small className="text-muted">Course dibeli (ID): {progressData.enrolledCourseIds.join(', ')}</small>
                                </div>
                              )}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                  {users.length === 0 && (
                    <tr><td colSpan="9" className="text-center py-4">Tidak ada data pengguna.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* FAQ Tab */}
        {activeTab === 'faq' && (
          <>
            <div className="admin-form-card">
              <h5 className="mb-3">
                <i className={`fa-solid ${editingFaqId ? 'fa-pen' : 'fa-plus'} me-2`}></i>
                {editingFaqId ? 'Edit FAQ' : 'Tambah FAQ Baru'}
              </h5>
              <form onSubmit={handleFaqSubmit}>
                <div className="row g-3">
                  <div className="col-md-8">
                    <label className="form-label">Pertanyaan</label>
                    <input className="form-control" value={faqForm.question} onChange={e => setFaqForm({ ...faqForm, question: e.target.value })} required minLength={5} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Kategori</label>
                    <input className="form-control" value={faqForm.category} onChange={e => setFaqForm({ ...faqForm, category: e.target.value })} placeholder="general" />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Jawaban</label>
                    <textarea className="form-control" rows={3} value={faqForm.answer} onChange={e => setFaqForm({ ...faqForm, answer: e.target.value })} required minLength={10} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      <i className="fa-solid fa-save me-1"></i>{editingFaqId ? 'Update' : 'Simpan'}
                    </button>
                    {editingFaqId && (
                      <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingFaqId(null); setFaqForm(EMPTY_FAQ); }}>
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Pertanyaan</th>
                      <th>Kategori</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {faqs.map(faq => (
                      <tr key={faq.id}>
                        <td>{faq.id}</td>
                        <td>
                          <strong>{faq.question}</strong>
                          <br /><small className="text-muted">{faq.answer?.substring(0, 80)}...</small>
                        </td>
                        <td><span className="badge bg-secondary">{faq.category}</span></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleFaqEdit(faq)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleFaqDelete(faq.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {faqs.length === 0 && (
                      <tr><td colSpan="4" className="empty-state"><i className="fa-solid fa-circle-question d-block"></i>Belum ada FAQ.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <>
            <div className="admin-form-card">
              <h5 className="mb-3">
                <i className={`fa-solid ${editingTestimonialId ? 'fa-pen' : 'fa-plus'} me-2`}></i>
                {editingTestimonialId ? 'Edit Testimonial' : 'Tambah Testimonial Baru'}
              </h5>
              <form onSubmit={handleTestimonialSubmit}>
                <div className="row g-3">
                  <div className="col-md-4">
                    <label className="form-label">Nama</label>
                    <input className="form-control" value={testimonialForm.name} onChange={e => setTestimonialForm({ ...testimonialForm, name: e.target.value })} required />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Email</label>
                    <input type="email" className="form-control" value={testimonialForm.email} onChange={e => setTestimonialForm({ ...testimonialForm, email: e.target.value })} />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Rating (1-5)</label>
                    <input type="number" className="form-control" min={1} max={5} value={testimonialForm.rating} onChange={e => setTestimonialForm({ ...testimonialForm, rating: parseInt(e.target.value) })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role / Jabatan</label>
                    <input className="form-control" value={testimonialForm.role_title} onChange={e => setTestimonialForm({ ...testimonialForm, role_title: e.target.value })} />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Kategori Course</label>
                    <input className="form-control" value={testimonialForm.course_category} onChange={e => setTestimonialForm({ ...testimonialForm, course_category: e.target.value })} />
                  </div>
                  <div className="col-12">
                    <label className="form-label">Testimonial</label>
                    <textarea className="form-control" rows={3} value={testimonialForm.testimonial} onChange={e => setTestimonialForm({ ...testimonialForm, testimonial: e.target.value })} required minLength={10} />
                  </div>
                  <div className="col-12">
                    <button type="submit" className="btn btn-primary me-2">
                      <i className="fa-solid fa-save me-1"></i>{editingTestimonialId ? 'Update' : 'Simpan'}
                    </button>
                    {editingTestimonialId && (
                      <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditingTestimonialId(null); setTestimonialForm(EMPTY_TESTIMONIAL); }}>
                        Batal
                      </button>
                    )}
                  </div>
                </div>
              </form>
            </div>

            <div className="admin-table-card">
              <div className="table-responsive">
                <table className="table table-hover mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>ID</th>
                      <th>Nama</th>
                      <th>Rating</th>
                      <th>Testimonial</th>
                      <th>Aksi</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testimonials.map(t => (
                      <tr key={t.id}>
                        <td>{t.id}</td>
                        <td>
                          <strong>{t.name}</strong>
                          <br /><small className="text-muted">{t.role_title} · {t.course_category}</small>
                        </td>
                        <td>{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</td>
                        <td><small>{t.testimonial?.substring(0, 100)}...</small></td>
                        <td>
                          <button className="btn btn-sm btn-outline-primary me-1" onClick={() => handleTestimonialEdit(t)}>
                            <i className="fa-solid fa-pen"></i>
                          </button>
                          <button className="btn btn-sm btn-outline-danger" onClick={() => handleTestimonialDelete(t.id)}>
                            <i className="fa-solid fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    ))}
                    {testimonials.length === 0 && (
                      <tr><td colSpan="5" className="empty-state"><i className="fa-solid fa-star d-block"></i>Belum ada testimonial.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AdminWorkbench;
