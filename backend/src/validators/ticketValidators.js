import { z } from 'zod';

export const createTicketSchema = z.object({
  customer_name: z
    .string({ required_error: 'Customer name is required' })
    .trim()
    .min(1, 'Customer name cannot be empty')
    .max(100, 'Customer name cannot exceed 100 characters'),
  customer_email: z
    .string({ required_error: 'Customer email is required' })
    .trim()
    .email('Invalid email address')
    .max(255, 'Customer email cannot exceed 255 characters'),
  subject: z
    .string({ required_error: 'Subject is required' })
    .trim()
    .min(1, 'Subject cannot be empty')
    .max(200, 'Subject cannot exceed 200 characters'),
  description: z
    .string({ required_error: 'Description is required' })
    .trim()
    .min(1, 'Description cannot be empty')
    .max(5000, 'Description cannot exceed 5000 characters'),
  priority: z
    .enum(['Low', 'Medium', 'High'], {
      errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
    })
    .default('Medium')
    .optional(),
});

export const updateTicketSchema = z.object({
  status: z
    .enum(['Open', 'In Progress', 'Closed'], {
      errorMap: () => ({ message: 'Status must be Open, In Progress, or Closed' }),
    })
    .optional(),
  priority: z
    .enum(['Low', 'Medium', 'High'], {
      errorMap: () => ({ message: 'Priority must be Low, Medium, or High' }),
    })
    .optional(),
  notes: z
    .string()
    .trim()
    .max(3000, 'Note cannot exceed 3000 characters')
    .optional()
    .nullable(),
});

export const ticketQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(['Open', 'In Progress', 'Closed']).optional(),
  priority: z.enum(['Low', 'Medium', 'High']).optional(),
  sort: z.enum(['newest', 'oldest']).default('newest'),
  needsAttention: z.enum(['true', 'false']).optional(),
});
