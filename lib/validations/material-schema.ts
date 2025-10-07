import { z } from 'zod';

/**
 * Material Validation Schema
 * 
 * C# equivalent: FluentValidation
 * 
 * public class CreateMaterialValidator : AbstractValidator<CreateMaterialRequest>
 * {
 *     public CreateMaterialValidator()
 *     {
 *         RuleFor(x => x.MaterialName)
 *             .NotEmpty().WithMessage("Material name is required")
 *             .MaximumLength(100);
 *         
 *         RuleFor(x => x.UnitOfMeasure)
 *             .NotEmpty().WithMessage("Unit of measure is required")
 *             .MaximumLength(20);
 *         
 *         RuleFor(x => x.Description)
 *             .MaximumLength(500);
 *     }
 * }
 */

export const materialSchema = z.object({
  materialName: z
    .string()
    .min(1, 'Material name is required')
    .max(100, 'Material name cannot exceed 100 characters'),

  description: z
    .string()
    .max(500, 'Description cannot exceed 500 characters')
    .optional()
    .nullable(),

  unitOfMeasure: z
    .string()
    .min(1, 'Unit of measure is required')
    .max(20, 'Unit of measure cannot exceed 20 characters'),
});

/**
 * TypeScript type inferred from schema
 */
export type MaterialFormData = z.infer<typeof materialSchema>;

/**
 * Convert MaterialResponse to form data
 * Handles null values for form compatibility
 */
export function convertMaterialToFormData(
  material: any
): Partial<MaterialFormData> {
  return {
    materialName: material.materialName || '',
    description: material.description || null,
    unitOfMeasure: material.unitOfMeasure || '',
  };
}