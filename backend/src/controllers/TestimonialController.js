import { Testimonial } from '../models/Testimonial.js';

export class TestimonialController {
  constructor(query) {
    this.query = query;
    this.model = new Testimonial(query);
  }

  getTestimonials = async (req, res) => {
    try {
      const { page = 1, limit = 10, rating, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const filters = {};
      if (rating) filters.rating = rating;
      if (search) filters.search = search;

      const result = await this.model.getAll(filters, {
        limit: parseInt(limit),
        offset
      });

      return res.json({
        success: true,
        data: result.data,
        pagination: result.pagination
      });
    } catch (error) {
      console.error('Error fetching testimonials:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch testimonials'
      });
    }
  }

  getTestimonialById = async (req, res) => {
    try {
      const { id } = req.params;
      const testimonial = await this.model.getById(id);

      if (!testimonial) {
        return res.status(404).json({
          success: false,
          error: 'Testimonial not found'
        });
      }

      return res.json({
        success: true,
        data: testimonial
      });
    } catch (error) {
      console.error('Error fetching testimonial:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch testimonial'
      });
    }
  }

  createTestimonial = async (req, res) => {
    try {
      const { user_id, course_id, testimonial, rating, name, email, role_title, course_category } = req.body;

      if (!testimonial) {
        return res.status(400).json({
          success: false,
          error: 'Testimonial message is required'
        });
      }

      if (testimonial.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Testimonial must be at least 10 characters'
        });
      }

      const data = await this.model.create({
        user_id: user_id || null,
        course_id: course_id || null,
        testimonial: testimonial.trim(),
        rating,
        name,
        email,
        role_title,
        course_category
      });

      return res.status(201).json({
        success: true,
        message: 'Testimonial created successfully',
        data
      });
    } catch (error) {
      console.error('Error creating testimonial:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create testimonial'
      });
    }
  }

  deleteTestimonial = async (req, res) => {
    try {
      const { id } = req.params;

      await this.model.delete(id);

      return res.json({
        success: true,
        message: 'Testimonial deleted successfully',
        data: { id: parseInt(id) }
      });
    } catch (error) {
      console.error('Error deleting testimonial:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete testimonial'
      });
    }
  }

  updateTestimonial = async (req, res) => {
    try {
      const { id } = req.params;
      const { testimonial, rating, name, email, role_title, course_category, is_approved } = req.body;

      if (testimonial && testimonial.length < 10) {
        return res.status(400).json({ success: false, error: 'Testimonial must be at least 10 characters' });
      }

      const data = await this.model.update(id, {
        testimonial: testimonial?.trim(),
        rating,
        name,
        email,
        role_title,
        course_category,
        is_approved
      });

      return res.json({
        success: true,
        message: 'Testimonial updated successfully',
        data
      });
    } catch (error) {
      console.error('Error updating testimonial:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: error.message || 'Failed to update testimonial' });
    }
  }
}
