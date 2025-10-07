'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

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
import { Separator } from '@/components/ui/separator';

import { useUpdatePayment } from '@/lib/hooks/usePayments';
import {
  updatePaymentSchema,
  type UpdatePaymentFormData,
  formatCurrency,
  formatDate,
} from '@/lib/validations/payment-schema';
import type { PaymentResponse } from '@/types/payments.types';
import { PaymentMethods } from '@/types/payments.types';
import { cn } from '@/lib/utils/utils';

/**
 * Edit Payment Form Component
 *
 * C# equivalent: Edit view in MVC PaymentsController
 */

interface EditPaymentFormProps {
  payment: PaymentResponse;
}

export default function EditPaymentForm({ payment }: EditPaymentFormProps) {
  const router = useRouter();
  const updateMutation = useUpdatePayment();

  // ============================================
  // FORM SETUP
  // ============================================

  const form = useForm<UpdatePaymentFormData>({
    resolver: zodResolver(updatePaymentSchema),
    defaultValues: {
      paymentDate: payment.paymentDate.split('T')[0], // Extract date part
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      transactionReference: payment.transactionReference,
    },
  });

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const onSubmit = async (data: UpdatePaymentFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: payment.paymentID,
        data,
      });
      router.push('/dashboard/payments');
    } catch (error) {
      console.error('Failed to update payment:', error);
    }
  };

  const handleCancel = () => {
    router.push('/dashboard/payments');
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <p className="text-lg font-semibold">
                  {payment.invoice?.invoiceNumber || 'N/A'}
                </p>
              </div>

              {/* Invoice Total */}
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Invoice Total
                </p>
                <p className="text-lg font-semibold">
                  {formatCurrency(payment.invoice?.totalAmount || 0)}
                </p>
              </div>
            </div>

            <Separator />

            {/* Purchase Order Details */}
            <div>
              <p className="text-sm font-medium mb-2">Purchase Order</p>
              <div className="rounded-lg border bg-muted/50 p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    PO Number:
                  </span>
                  <span className="text-sm font-medium">
                    {payment.invoice?.purchaseOrder?.poNumber || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Project:
                  </span>
                  <span className="text-sm font-medium">
                    {payment.invoice?.purchaseOrder?.projectName || 'N/A'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">
                    Supplier:
                  </span>
                  <span className="text-sm font-medium">
                    {payment.invoice?.purchaseOrder?.supplierName || 'N/A'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Payment Details Form */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                      Update the payment amount
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
            onClick={handleCancel}
            disabled={updateMutation.isPending}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={updateMutation.isPending}>
            {updateMutation.isPending ? 'Updating...' : 'Update Payment'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
