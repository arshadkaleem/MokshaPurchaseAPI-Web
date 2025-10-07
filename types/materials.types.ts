// ============================================
// MATERIAL TYPES
// C# equivalent: Your Material DTOs
// ============================================

/**
 * Material Response - What you GET from API
 * Matches: MaterialResponse from Swagger
 * 
 * C# equivalent:
 * public class MaterialResponse
 * {
 *     public int MaterialId { get; set; }
 *     public string MaterialName { get; set; }
 *     public string? Description { get; set; }
 *     public string UnitOfMeasure { get; set; }
 *     public DateTime CreatedAt { get; set; }
 *     public DateTime UpdatedAt { get; set; }
 * }
 */
export interface MaterialResponse {
  materialId: number;
  materialName: string;
  description: string | null;
  unitOfMeasure: string;
  createdAt: string;  // ISO date string
  updatedAt: string;  // ISO date string
}

/**
 * Create Material Request - What you POST
 * Matches: CreateMaterialRequest from Swagger
 * 
 * C# equivalent:
 * public class CreateMaterialRequest
 * {
 *     [Required]
 *     [MaxLength(100)]
 *     public string MaterialName { get; set; }
 *     
 *     public string? Description { get; set; }
 *     
 *     [Required]
 *     [MaxLength(20)]
 *     public string UnitOfMeasure { get; set; }
 * }
 */
export interface CreateMaterialRequest {
  materialName: string;        // Required, max 100
  description?: string | null; // Optional
  unitOfMeasure: string;       // Required, max 20
}

/**
 * Update Material Request - What you PUT
 * Matches: UpdateMaterialRequest from Swagger
 * Same structure as CreateMaterialRequest
 */
export interface UpdateMaterialRequest extends CreateMaterialRequest {}

/**
 * Common unit of measure options
 * These are suggestions, users can enter custom values
 */
export const COMMON_UNITS = [
  // Weight
  'kg', 'grams', 'tons', 'pounds',
  
  // Length
  'meters', 'feet', 'inches', 'cm',
  
  // Volume
  'liters', 'gallons', 'cubic meters',
  
  // Quantity
  'pieces', 'pcs', 'units', 'boxes', 'bags',
  
  // Area
  'sq meters', 'sq feet',
] as const;