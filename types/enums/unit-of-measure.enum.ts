/**
 * Unit of measure enumeration
 */

export enum UnitOfMeasure {
  Kg = 'Kg',
  Ton = 'Ton',
  Bag = 'Bag',
  Nos = 'Nos',
  CuM = 'CuM',
  CuFt = 'CuFt',
  SqM = 'SqM',
  SqFt = 'SqFt',
  Meter = 'Meter',
  MM = 'mm',
  Litre = 'Litre',
  Unit = 'Unit',
}

export const UNIT_OF_MEASURE_OPTIONS = [
  { value: UnitOfMeasure.Kg, label: 'Kilogram (Kg)' },
  { value: UnitOfMeasure.Ton, label: 'Ton' },
  { value: UnitOfMeasure.Bag, label: 'Bag' },
  { value: UnitOfMeasure.Nos, label: 'Numbers (Nos)' },
  { value: UnitOfMeasure.CuM, label: 'Cubic Meter (CuM)' },
  { value: UnitOfMeasure.CuFt, label: 'Cubic Feet (CuFt)' },
  { value: UnitOfMeasure.SqM, label: 'Square Meter (SqM)' },
  { value: UnitOfMeasure.SqFt, label: 'Square Feet (SqFt)' },
  { value: UnitOfMeasure.Meter, label: 'Meter' },
  { value: UnitOfMeasure.MM, label: 'Millimeter (mm)' },
  { value: UnitOfMeasure.Litre, label: 'Litre' },
  { value: UnitOfMeasure.Unit, label: 'Unit' },
];
