import React from 'react';
import { Link } from 'react-router-dom';
import './TestimonialPreview.css';
import { testimonialData } from '../../Testimonial/testimonialData';

const TestimonialPreview = () => {
  // Get first 3 testimonials for preview
  const previewTestimonials = testimonialData.slice(0, 3);

  return (
    <section className="testimonial-preview-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Apa Kata Siswa Kami</h2>
          <p className="section-subtitle">
            Testimoni nyata dari siswa yang telah bergabung dengan CodeCatalyst
          </p>
        </div>

        <div className="testimonials-grid">
          {previewTestimonials.map((testimonial) => (
            <div className="testimonial-card" key={testimonial.id}>
              <div className="testimonial-header">
                <div className="testimonial-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="testimonial-info">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.occupation} at {testimonial.company}</p>
                </div>
                <div className="testimonial-rating">
                  {"★".repeat(testimonial.rating)}
                </div>
              </div>

              <div className="testimonial-content">
                <p>{testimonial.message}</p>
              </div>

              <div className="testimonial-footer">
                <span className="course-badge">{testimonial.course}</span>
                <span className="location-badge">{testimonial.location}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5">
          <Link to="/testimonial" className="btn btn-primary btn-lg">
            <i className="fas fa-comments me-2"></i>
            Lihat Semua Testimoni
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TestimonialPreview;
