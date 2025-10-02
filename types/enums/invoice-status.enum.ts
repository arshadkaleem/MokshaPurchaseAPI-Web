/**
 * Invoice status enumeration
 */

export enum InvoiceStatus {
  Pending = 'Pending',
  Paid = 'Paid',
  Cancelled = 'Cancelled',
}

export const INVOICE_STATUS_OPTIONS = [
  { value: InvoiceStatus.Pending, label: 'Pending', color: 'yellow' },
  { value: InvoiceStatus.Paid, label: 'Paid', color: 'green' },
  { value: InvoiceStatus.Cancelled, label: 'Cancelled', color: 'red' },
];

export const getInvoiceStatusColor = (status: InvoiceStatus): string => {
  const option = INVOICE_STATUS_OPTIONS.find((opt) => opt.value === status);
  return option?.color || 'gray';
};
