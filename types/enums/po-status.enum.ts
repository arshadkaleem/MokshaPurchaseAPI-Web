/**
 * Purchase Order status enumeration
 */

export enum PurchaseOrderStatus {
  Draft = 'Draft',
  Pending = 'Pending',
  Approved = 'Approved',
  Shipped = 'Shipped',
  Received = 'Received',
  Cancelled = 'Cancelled',
}

export const PO_STATUS_OPTIONS = [
  { value: PurchaseOrderStatus.Draft, label: 'Draft', color: 'gray' },
  {
    value: PurchaseOrderStatus.Pending,
    label: 'Pending Approval',
    color: 'yellow',
  },
  { value: PurchaseOrderStatus.Approved, label: 'Approved', color: 'green' },
  { value: PurchaseOrderStatus.Shipped, label: 'Shipped', color: 'blue' },
  { value: PurchaseOrderStatus.Received, label: 'Received', color: 'green' },
  { value: PurchaseOrderStatus.Cancelled, label: 'Cancelled', color: 'red' },
];

export const getPOStatusColor = (status: PurchaseOrderStatus): string => {
  const option = PO_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.color || 'gray';
};
