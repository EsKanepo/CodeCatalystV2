import { BaseModel } from './BaseModel.js';

export class Testimonial extends BaseModel {
  constructor(query) {
    super('testimonials', query);
  }

  async getAll(filters = {}, pagination = { limit: 10, offset: 0 }) {
    try {
      let whereClause = [];
      let params = [];

      if (filters.rating) {
        whereClause.push('rating = ?');
        params.push(parseInt(filters.rating));
      }

      if (filters.search) {
        whereClause.push('(testimonial LIKE ?)');
        const searchTerm = `%${filters.search}%`;
        params.push(searchTerm);
      }

      const where = whereClause.length ? 'WHERE ' + whereClause.join(' AND ') : '';
      const baseQuery = `SELECT * FROM ${this.table} ${where}`;
      const countResult = await this.query(`SELECT COUNT(*) as total FROM ${this.table} ${where}`, params);
      const total = countResult[0]?.total || 0;

      const sql = `
        ${baseQuery}
        ORDER BY created_at DESC
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
      throw new Error(`Failed to fetch testimonials: ${error.message}`);
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
      throw new Error(`Failed to fetch testimonial: ${error.message}`);
    }
  }

  async create(data) {
    try {
      const { testimonial, rating, name, email, role_title, course_category } = data;

      if (!testimonial) {
        throw new Error('Testimonial message is required');
      }

      const ratingVal = Math.min(5, Math.max(1, parseInt(rating) || 5));

      let sql, values;
      try {
        sql = `
          INSERT INTO ${this.table} (name, email, role_title, course_category, rating, testimonial, is_approved)
          VALUES (?, ?, ?, ?, ?, ?, TRUE)
        `;
        values = [
          name || 'Anonymous',
          email || null,
          role_title || 'Student',
          course_category || 'General',
          ratingVal,
          testimonial
        ];
        const result = await this.query(sql, values);
        return {
          id: result.insertId,
          name: name || 'Anonymous',
          email: email || null,
          role_title: role_title || 'Student',
          course_category: course_category || 'General',
          rating: ratingVal,
          testimonial,
          is_approved: true,
          created_at: new Date()
        };
      } catch (colErr) {
        if (colErr.message.includes("Unknown column")) {
          sql = `INSERT INTO ${this.table} (rating, testimonial, is_approved) VALUES (?, ?, TRUE)`;
          const result = await this.query(sql, [ratingVal, testimonial]);
          return { id: result.insertId, rating: ratingVal, testimonial, is_approved: true, created_at: new Date() };
        }
        throw colErr;
      }
    } catch (error) {
      throw new Error(`Failed to create testimonial: ${error.message}`);
    }
  }

  async update(id, data) {
    try {
      const existing = await this.getById(id);
      if (!existing) throw new Error('Testimonial not found');

      const fields = [];
      const values = [];

      const allowed = ['name', 'email', 'role_title', 'course_category', 'rating', 'testimonial', 'is_approved'];
      for (const key of allowed) {
        if (data[key] !== undefined) {
          fields.push(`${key} = ?`);
          values.push(data[key]);
        }
      }

      if (fields.length === 0) return existing;

      values.push(id);
      await this.query(`UPDATE ${this.table} SET ${fields.join(', ')} WHERE id = ?`, values);
      return this.getById(id);
    } catch (error) {
      throw new Error(`Failed to update testimonial: ${error.message}`);
    }
  }

  async delete(id) {
    try {
      const result = await this.query(
        `DELETE FROM ${this.table} WHERE id = ?`,
        [id]
      );

      if (result.affectedRows === 0) {
        throw new Error('Testimonial not found');
      }

      return { success: true, id };
    } catch (error) {
      throw new Error(`Failed to delete testimonial: ${error.message}`);
    }
  }
}
