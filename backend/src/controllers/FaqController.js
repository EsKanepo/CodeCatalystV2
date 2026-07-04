import { FAQ } from '../models/FAQ.js';

export class FaqController {
  constructor(query) {
    this.query = query;
    this.model = new FAQ(query);
  }

  getFaqs = async (req, res) => {
    try {
      const { page = 1, limit = 10, category, search } = req.query;
      const offset = (parseInt(page) - 1) * parseInt(limit);

      const filters = {};
      if (category) filters.category = category;
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
      console.error('Error fetching FAQs:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch FAQs'
      });
    }
  }

  getFaqById = async (req, res) => {
    try {
      const { id } = req.params;
      const faq = await this.model.getById(id);

      if (!faq) {
        return res.status(404).json({
          success: false,
          error: 'FAQ not found'
        });
      }

      return res.json({
        success: true,
        data: faq
      });
    } catch (error) {
      console.error('Error fetching FAQ:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch FAQ'
      });
    }
  }

  getCategories = async (req, res) => {
    try {
      const categories = await this.model.getCategories();

      return res.json({
        success: true,
        data: categories
      });
    } catch (error) {
      console.error('Error fetching categories:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to fetch categories'
      });
    }
  }

  createFaq = async (req, res) => {
    try {
      const { question, answer, category } = req.body;

      if (!question || !answer) {
        return res.status(400).json({
          success: false,
          error: 'Question and answer are required'
        });
      }

      if (question.length < 5) {
        return res.status(400).json({
          success: false,
          error: 'Question must be at least 5 characters'
        });
      }

      if (answer.length < 10) {
        return res.status(400).json({
          success: false,
          error: 'Answer must be at least 10 characters'
        });
      }

      const data = await this.model.create({
        question: question.trim(),
        answer: answer.trim(),
        category: category?.trim() || 'general'
      });

      return res.status(201).json({
        success: true,
        message: 'FAQ created successfully',
        data
      });
    } catch (error) {
      console.error('Error creating FAQ:', error);
      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to create FAQ'
      });
    }
  }

  deleteFaq = async (req, res) => {
    try {
      const { id } = req.params;

      await this.model.delete(id);

      return res.json({
        success: true,
        message: 'FAQ deleted successfully',
        data: { id: parseInt(id) }
      });
    } catch (error) {
      console.error('Error deleting FAQ:', error);

      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          error: error.message
        });
      }

      return res.status(500).json({
        success: false,
        error: error.message || 'Failed to delete FAQ'
      });
    }
  }

  updateFaq = async (req, res) => {
    try {
      const { id } = req.params;
      const { question, answer, category, is_active, order_index } = req.body;

      if (question && question.length < 5) {
        return res.status(400).json({ success: false, error: 'Question must be at least 5 characters' });
      }
      if (answer && answer.length < 10) {
        return res.status(400).json({ success: false, error: 'Answer must be at least 10 characters' });
      }

      const data = await this.model.update(id, {
        question: question?.trim(),
        answer: answer?.trim(),
        category: category?.trim(),
        is_active,
        order_index
      });

      return res.json({
        success: true,
        message: 'FAQ updated successfully',
        data
      });
    } catch (error) {
      console.error('Error updating FAQ:', error);
      if (error.message.includes('not found')) {
        return res.status(404).json({ success: false, error: error.message });
      }
      return res.status(500).json({ success: false, error: error.message || 'Failed to update FAQ' });
    }
  }
}
