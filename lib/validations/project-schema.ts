import { z } from 'zod';

/**
 * Project Validation Schema
 * 
 * C# equivalent: FluentValidation or Data Annotations
 * 
 * Like:
 * public class CreateProjectValidator : AbstractValidator<CreateProjectRequest>
 * {
 *     public CreateProjectValidator()
 *     {
 *         RuleFor(x => x.ProjectName)
 *             .NotEmpty().WithMessage("Project name is required")
 *             .MaximumLength(100).WithMessage("Max 100 characters");
 *     }
 * }
 */

export const projectSchema = z.object({
  projectName: z
    .string()
    .min(1, 'Project name is required')
    .max(100, 'Project name cannot exceed 100 characters'),

  projectType: z.enum(['Government', 'Private'], {
    required_error: 'Project type is required',
  }),

  status: z.enum(['Planned', 'In Progress', 'Completed', 'Cancelled'], {
    required_error: 'Status is required',
  }),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable(),

  startDate: z
    .string()
    .optional()
    .nullable(),

  endDate: z
    .string()
    .optional()
    .nullable(),

  budget: z
    .number({
      invalid_type_error: 'Budget must be a number',
    })
    .min(0, 'Budget must be greater than or equal to 0')
    .optional()
    .nullable(),

  complianceStatus: z
    .string()
    .max(100)
    .optional()
    .nullable(),
})
  .refine(
    (data) => {
      // Custom validation: End date must be after start date
      if (data.startDate && data.endDate) {
        return new Date(data.endDate) >= new Date(data.startDate);
      }
      return true;
    },
    {
      message: 'End date must be after or equal to start date',
      path: ['endDate'], // Error shows on endDate field
    }
  );

/**
 * TypeScript type inferred from schema
 * This is like your CreateProjectRequest DTO
 */
export type ProjectFormData = z.infer<typeof projectSchema>;