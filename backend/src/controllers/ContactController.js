import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(5, 'Message must be at least 5 characters')
});

export class ContactController {
  constructor(query) {
    this.query = query;
  }

  submitContact = async (req, res) => {
    try {
      const validatedData = contactSchema.parse(req.body);
      
      const sql = `
        INSERT INTO contacts (name, email, subject, message) 
        VALUES (?, ?, ?, ?)
      `;
      
      const values = [
        validatedData.name, 
        validatedData.email, 
        "General Inquiry", // Default subject since frontend doesn't send it
        validatedData.message
      ];
      
      const result = await this.query(sql, values);
      
      res.status(201).json({
        success: true,
        message: 'Your message has been sent successfully. We will get back to you soon!',
        data: {
          id: result.insertId,
          email: validatedData.email,
          status: 'pending'
        }
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          success: false,
          error: 'Validation error',
          message: error.errors?.map(e => e.message).join(', ') || 'Invalid input data'
        });
      }
      
      console.error('Contact submission error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to send message',
        message: 'Internal server error'
      });
    }
  }

  getContacts = async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'Only admins can view contacts'
        });
      }
      
      const contacts = await this.query('SELECT * FROM contacts ORDER BY created_at DESC');
      
      res.json({
        success: true,
        data: contacts
      });
    } catch (error) {
      console.error('Get contacts error:', error);
      res.status(500).json({
        success: false,
        error: 'Failed to get contacts',
        message: 'Internal server error'
      });
    }
  }
}
