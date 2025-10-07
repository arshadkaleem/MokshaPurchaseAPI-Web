'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

import { useUpdateInvoiceStatus } from '@/lib/hooks/useInvoices';
import {
  updateInvoiceStatusSchema,
  type UpdateInvoiceStatusFormData,
  formatCurrency,
  formatDate,
  calculateOutstandingAmount,
} from '@/lib/validations/invoice-schema';
import type { InvoiceResponse } from '@/types/invoices.types';
import { AlertCircle, CheckCircle2, Clock, XCircle } from 'lucide-react';

/**
 * Edit Invoice Form Component
 *
 * Important: Invoices can ONLY update their status (Pending, Paid, Cancelled)
 * Other fields (invoice number, date, amount) are read-only after creation
 *
 * C# equivalent: Edit view in MVC InvoicesController
 */

interface EditInvoiceFormProps {
  invoice: InvoiceResponse;
}

export default function EditInvoiceForm({ invoice }: EditInvoiceFormProps) {
  const router = useRouter();
  const updateStatusMutation = useUpdateInvoiceStatus();

  // ============================================
  // FORM SETUP
  // ============================================

  const form = useForm<UpdateInvoiceStatusFormData>({
    resolver: zodResolver(updateInvoiceStatusSchema),
    defaultValues: {
      status: invoice.status as 'Pending' | 'Paid' | 'Cancelled',
    },
  });

  // ============================================
  // CALCULATIONS
  // ============================================

  const totalPaid = invoice.payments.reduce(
    (sum, payment) => sum + payment.amount,
    0
  );
  const outstandingAmount = calculateOutstandingAmount(
    invoice.totalAmount,
    invoice.payments
  );

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const onSubmit = async (data: UpdateInvoiceStatusFormData) => {
    try {
      await updateStatusMutation.mutateAsync({
        id: invoice.invoiceID,
        data,
      });
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Failed to update invoice status:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/invoices');
  };

  // ============================================
  // STATUS HELPERS
  // ============================================

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pending
          </Badge>
        );
      case 'Paid':
        return (
          <Badge
            variant="secondary"
            className="flex items-center gap-1 bg-green-100 text-green-800"
          >
            <CheckCircle2 className="h-3 w-3" />
            Paid
          </Badge>
        );
      case 'Cancelled':
        return (
          <Badge variant="destructive" className="flex items-center gap-1">
            <XCircle className="h-3 w-3" />
            Cancelled
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Important Notice */}
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Update Status Only</AlertTitle>
          <AlertDescription>
            Invoice details (number, date, amount) cannot be modified after
            creation. You can only update the payment status.
          </AlertDescription>
        </Alert>

        {/* Invoice Information (Read-Only) */}
        <Card>
          <CardHeader>
            <CardTitle>Invoice Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Invoice Number */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invoice Number
                </p>
                <p className="text-lg font-semibold">{invoice.invoiceNumber}</p>
              </div>

              {/* Invoice Date */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invoice Date
                </p>
                <p className="text-lg font-semibold">
                  {formatDate(invoice.invoiceDate)}
                </p>
              </div>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Amount
              </p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(invoice.totalAmount)}
              </p>
            </div>

            {/* Current Status */}
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Current Status
              </p>
              {getStatusBadge(invoice.status)}
            </div>

            <Separator />

            {/* Purchase Order Details */}
            <div>
              <p className="text-sm font-medium mb-2">
                Related Purchase Order
              </p>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    PO Number:
                  </span>
                  <span className="text-sm font-medium">
                    {invoice.purchaseOrder.poNumber}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Project:
                  </span>
                  <span className="text-sm font-medium">
                    {invoice.purchaseOrder.projectName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Supplier:
                  </span>
                  <span className="text-sm font-medium">
                    {invoice.purchaseOrder.supplierName}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Amount
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(invoice.totalAmount)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Total Paid
                </p>
                <p className="text-lg font-semibold text-green-600">
                  {formatCurrency(totalPaid)}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Outstanding
                </p>
                <p className="text-lg font-semibold text-orange-600">
                  {formatCurrency(outstandingAmount)}
                </p>
              </div>
            </div>

            {/* Payment Records */}
            {invoice.payments.length > 0 ? (
              <div className="space-y-2">
                <p className="text-sm font-medium">Payment Records</p>
                <div className="space-y-2">
                  {invoice.payments.map((payment) => (
                    <div
                      key={payment.paymentID}
                      className="flex justify-between items-center rounded-lg border p-3"
                    >
                      <div>
                        <p className="text-sm font-medium">
                          {formatDate(payment.paymentDate)}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {payment.paymentMethod || 'N/A'}
                          {payment.transactionReference &&
                            ` - ${payment.transactionReference}`}
                        </p>
                      </div>
                      <p className="text-sm font-semibold">
                        {formatCurrency(payment.amount)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <Alert>
                <AlertDescription>
                  No payments have been recorded for this invoice yet.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>

        {/* Update Status Form */}
        <Card>
          <CardHeader>
            <CardTitle>Update Status</CardTitle>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Payment Status <span className="text-destructive">*</span>
                  </FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Pending">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4" />
                          Pending
                        </div>
                      </SelectItem>
                      <SelectItem value="Paid">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="h-4 w-4" />
                          Paid
                        </div>
                      </SelectItem>
                      <SelectItem value="Cancelled">
                        <div className="flex items-center gap-2">
                          <XCircle className="h-4 w-4" />
                          Cancelled
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Change the payment status of this invoice
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={updateStatusMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateStatusMutation.isPending}>
            {updateStatusMutation.isPending
              ? 'Updating...'
              : 'Update Status'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
