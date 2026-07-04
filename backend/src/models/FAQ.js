import { BaseModel } from './BaseModel.js';

export class FAQ extends BaseModel {
  constructor(query) {
    super('faqs', query);
  }

  async getAll(filters = {}, pagination = { limit: 10, offset: 0 }) {
    try {
      let whereClause = [];
      let params = [];

      if (filters.category && filters.category !== 'all') {
        whereClause.push('category = ?');
        params.push(filters.category);
      }

      if (filters.search) {
        whereClause.push('(question LIKE ? OR answer LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm, searchTerm);
      }

      const where = whereClause.length ? 'WHERE ' + whereClause.join(' AND ') : '';
      const baseQuery = `SELECT * FROM ${this.table} ${where}`;

      const countResult = await this.query(`SELECT COUNT(*) as total FROM ${this.table} ${where}`, params);
      const total = countResult[0]?.total || 0;

      const sql = `
        ${baseQuery}
        ORDER BY order_index ASC, created_at DESC
        LIMIT ${pagination.limit} OFFSET ${pagination.offset}
      `;

      const data = await this.query(sql, params);

      return {
        data,
        pagination: {
          total,
          limit: pagination.limit,
          offset: pagination.offset,
          currentPage: Math.floor(pagination.offset / pagination.limit) + 1,
          totalPages: Math.ceil(total / pagination.limit)
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch FAQs: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const result = await this.query(
        `SELECT * FROM ${this.table} WHERE id = ?`,
        [id]
      );
      return result[0] || null;
    } catch (error) {
      throw new Error(`Failed to fetch FAQ: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const { question, answer, category } = data;

      if (!question || !answer) {
        throw new Error('Question and answer are required');
      }

      const maxOrderResult = await this.query(
        `SELECT MAX(order_index) as max_order FROM ${this.table} WHERE category = ?`,
        [category || 'general']
      );
      const nextOrder = (maxOrderResult[0]?.max_order || 0) + 1;

      const sql = `
        INSERT INTO ${this.table} (question, answer, category, order_index, is_active)
        VALUES (?, ?, ?, ?, TRUE)
      `;

      const result = await this.query(sql, [
        question,
        answer,
        category || 'general',
        nextOrder
      ]);

      return {
        id: result.insertId,
        question,
        answer,
        category: category || 'general',
        order_index: nextOrder,
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      };
    } catch (error) {
      throw new Error(`Failed to create FAQ: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const existing = await this.getById(id);
      if (!existing) throw new Error('FAQ not found');

      const { question, answer, category, is_active, order_index } = data;

      await this.query(
        `UPDATE ${this.table} SET question = ?, answer = ?, category = ?, is_active = ?, order_index = ?, updated_at = NOW() WHERE id = ?`,
        [
          question ?? existing.question,
          answer ?? existing.answer,
          category ?? existing.category,
          is_active !== undefined ? is_active : existing.is_active,
          order_index ?? existing.order_index,
          id
        ]
      );

      return this.getById(id);
    } catch (error) {
      throw new Error(`Failed to update FAQ: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const result = await this.query(
        `DELETE FROM ${this.table} WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('FAQ not found');
      }

      return { success: true, id };
    } catch (error) {
      throw new Error(`Failed to delete FAQ: ${error.message}`);
    }
  }

  async getCategories() {
    try {
      const result = await this.query(
        `SELECT DISTINCT category FROM ${this.table} ORDER BY category ASC`
      );
      return result.map(row => row.category);
    } catch (error) {
      throw new Error(`Failed to fetch FAQ categories: ${error.message}`);
    }
  }
}
