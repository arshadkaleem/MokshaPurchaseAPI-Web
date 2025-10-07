'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft } from 'lucide-react';

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
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useCreatePayment } from '@/lib/hooks/usePayments';
import { useInvoices } from '@/lib/hooks/useInvoices';
import {
  createPaymentSchema,
  type CreatePaymentFormData,
  formatCurrency,
  calculateOutstanding,
} from '@/lib/validations/payment-schema';
import { PaymentMethods } from '@/types/payments.types';
import { cn } from '@/lib/utils/utils';

/**
 * Create Payment Page
 *
 * C# equivalent: Create action in PaymentsController
 * Route: /dashboard/payments/new
 */

export default function CreatePaymentPage() {
  const router = useRouter();

  // ============================================
  // DATA FETCHING
  // ============================================

  // Fetch pending invoices for dropdown (invoices that have outstanding balance)
  const { data: pendingInvoicesData } = useInvoices({
    status: 'Pending',
  });

  const pendingInvoices = pendingInvoicesData?.data || [];

  // ============================================
  // FORM SETUP
  // ============================================

  const form = useForm<CreatePaymentFormData>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      invoiceID: 0,
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      amount: 0,
      paymentMethod: null,
      transactionReference: null,
    },
  });

  const createMutation = useCreatePayment();

  // Watch the selected invoice to show its details
  const selectedInvoiceId = form.watch('invoiceID');
  const selectedInvoice = pendingInvoices.find(
    (inv) => inv.invoiceID === selectedInvoiceId
  );

  // Calculate outstanding for selected invoice
  const outstandingAmount = selectedInvoice
    ? calculateOutstanding(
        selectedInvoice.totalAmount,
        selectedInvoice.payments?.reduce(
          (sum, p) => sum + p.amount,
          0
        ) || 0
      )
    : 0;

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    router.push('/dashboard/payments');
  };

  /**
   * Auto-fill amount when invoice is selected
   */
  const handleInvoiceChange = (invoiceId: number) => {
    form.setValue('invoiceID', invoiceId);

    // Auto-fill amount with outstanding balance
    const invoice = pendingInvoices.find((inv) => inv.invoiceID === invoiceId);
    if (invoice) {
      const totalPaid =
        invoice.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const outstanding = calculateOutstanding(invoice.totalAmount, totalPaid);
      form.setValue('amount', outstanding);
    }
  };

  const onSubmit = async (data: CreatePaymentFormData) => {
    try {
      await createMutation.mutateAsync(data);
      router.push('/dashboard/payments');
    } catch (error) {
      console.error('Failed to create payment:', error);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
        <h1 className="text-3xl font-bold">Record Payment</h1>
        <p className="text-muted-foreground">
          Record a new payment against an invoice
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Payment Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Invoice Selection */}
              <FormField
                control={form.control}
                name="invoiceID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Invoice <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) =>
                        handleInvoiceChange(parseInt(value))
                      }
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select invoice" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {pendingInvoices.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No pending invoices available
                          </div>
                        ) : (
                          pendingInvoices.map((invoice) => {
                            const totalPaid =
                              invoice.payments?.reduce(
                                (sum, p) => sum + p.amount,
                                0
                              ) || 0;
                            const outstanding = calculateOutstanding(
                              invoice.totalAmount,
                              totalPaid
                            );

                            return (
                              <SelectItem
                                key={invoice.invoiceID}
                                value={invoice.invoiceID.toString()}
                              >
                                {invoice.invoiceNumber} -{' '}
                                {invoice.purchaseOrder?.supplierName || 'N/A'} -
                                Outstanding: {formatCurrency(outstanding)}
                              </SelectItem>
                            );
                          })
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Only pending invoices with outstanding balance are shown
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show Selected Invoice Details */}
              {selectedInvoice && (
                <Alert>
                  <AlertDescription>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Project:</span>{' '}
                        {selectedInvoice.purchaseOrder?.projectName || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Supplier:</span>{' '}
                        {selectedInvoice.purchaseOrder?.supplierName || 'N/A'}
                      </div>
                      <div>
                        <span className="font-medium">Invoice Total:</span>{' '}
                        {formatCurrency(selectedInvoice.totalAmount)}
                      </div>
                      <div>
                        <span className="font-medium text-orange-600">
                          Outstanding:
                        </span>{' '}
                        <span className="font-semibold text-orange-600">
                          {formatCurrency(outstandingAmount)}
                        </span>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Date */}
                <FormField
                  control={form.control}
                  name="paymentDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Payment Date <span className="text-destructive">*</span>
                      </FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              className={cn(
                                'w-full pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                              )}
                            >
                              {field.value ? (
                                format(new Date(field.value), 'PPP')
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={
                              field.value ? new Date(field.value) : undefined
                            }
                            onSelect={(date) => {
                              field.onChange(
                                date ? format(date, 'yyyy-MM-dd') : ''
                              );
                            }}
                            disabled={(date) => date > new Date()} // Cannot be future date
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Cannot be a future date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Payment Amount */}
                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Payment Amount (₹){' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value) || 0)
                          }
                        />
                      </FormControl>
                      <FormDescription>
                        Can be partial or full payment (auto-filled with
                        outstanding)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Payment Method */}
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Method</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value || undefined}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select method (optional)" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {PaymentMethods.map((method) => (
                            <SelectItem key={method} value={method}>
                              {method}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        How was the payment made? (Optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Transaction Reference */}
                <FormField
                  control={form.control}
                  name="transactionReference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transaction Reference</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Check #1234, TXN-ABC123"
                          {...field}
                          value={field.value || ''}
                        />
                      </FormControl>
                      <FormDescription>
                        Check number, transaction ID, etc. (Optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Recording...' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
