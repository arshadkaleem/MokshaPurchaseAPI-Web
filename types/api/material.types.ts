/**
 * Material-related types
 */

import { UnitOfMeasure } from '@/types/enums/unit-of-measure.enum';

export interface CreateMaterialRequest {
  materialName: string;
  description?: string;
  unitOfMeasure: UnitOfMeasure;
  reorderLevel?: number;
}

export interface UpdateMaterialRequest extends CreateMaterialRequest {}

export interface MaterialResponse {
  materialId: number;
  materialName: string;
  description?: string;
  unitOfMeasure: UnitOfMeasure;
  reorderLevel?: number;
  createdAt: string;
  updatedAt: string;
}

export interface MaterialListItem {
  materialId: number;
  materialName: string;
  unitOfMeasure: UnitOfMeasure;
  reorderLevel?: number;
}
