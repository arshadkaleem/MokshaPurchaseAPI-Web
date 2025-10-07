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

import { useCreateInvoice } from '@/lib/hooks/useInvoices';
import { usePurchaseOrders } from '@/lib/hooks/usePurchaseOrders';
import {
  createInvoiceSchema,
  type CreateInvoiceFormData,
  formatCurrency,
} from '@/lib/validations/invoice-schema';
import { cn } from '@/lib/utils/utils';

/**
 * Create Invoice Page
 *
 * C# equivalent: Create action in InvoicesController
 * Route: /dashboard/invoices/new
 */

export default function CreateInvoicePage() {
  const router = useRouter();

  // ============================================
  // DATA FETCHING
  // ============================================

  // Fetch approved/received purchase orders for dropdown
  // Only these statuses can have invoices created
  const { data: approvedPOsData } = usePurchaseOrders({
    status: 'Approved',
  });
  const { data: receivedPOsData } = usePurchaseOrders({
    status: 'Received',
  });

  // Combine both approved and received POs
  const approvedPOs = approvedPOsData?.data || [];
  const receivedPOs = receivedPOsData?.data || [];
  const availablePOs = [...approvedPOs, ...receivedPOs];

  // ============================================
  // FORM SETUP
  // ============================================

  const form = useForm<CreateInvoiceFormData>({
    resolver: zodResolver(createInvoiceSchema),
    defaultValues: {
      purchaseOrderID: 0,
      invoiceNumber: '',
      invoiceDate: format(new Date(), 'yyyy-MM-dd'),
      totalAmount: 0,
    },
  });

  const createMutation = useCreateInvoice();

  // Watch the selected PO to show its details
  const selectedPOId = form.watch('purchaseOrderID');
  const selectedPO = availablePOs.find(
    (po) => po.purchaseOrderId === selectedPOId
  );

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    router.push('/dashboard/invoices');
  };

  /**
   * Auto-fill total amount when PO is selected
   */
  const handlePOChange = (poId: number) => {
    form.setValue('purchaseOrderID', poId);

    // Auto-fill amount with PO total
    const po = availablePOs.find((p) => p.purchaseOrderId === poId);
    if (po) {
      form.setValue('totalAmount', po.totalAmount);
    }
  };

  const onSubmit = async (data: CreateInvoiceFormData) => {
    try {
      await createMutation.mutateAsync(data);
      router.push('/dashboard/invoices');
    } catch (error) {
      console.error('Failed to create invoice:', error);
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
          Back to Invoices
        </Button>
        <h1 className="text-3xl font-bold">Create Invoice</h1>
        <p className="text-muted-foreground">
          Create a new invoice for an approved purchase order
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Invoice Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Invoice Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Purchase Order Selection */}
              <FormField
                control={form.control}
                name="purchaseOrderID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Purchase Order <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => handlePOChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select purchase order" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {availablePOs.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No approved purchase orders available
                          </div>
                        ) : (
                          availablePOs.map((po) => (
                            <SelectItem
                              key={po.purchaseOrderId}
                              value={po.purchaseOrderId.toString()}
                            >
                              PO-
                              {po.purchaseOrderId.toString().padStart(5, '0')} -{' '}
                              {po.projectName} -{' '}
                              {formatCurrency(po.totalAmount)}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Only approved or received purchase orders can have
                      invoices
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show Selected PO Details */}
              {selectedPO && (
                <Alert>
                  <AlertDescription>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="font-medium">Project:</span>{' '}
                        {selectedPO.projectName}
                      </div>
                      <div>
                        <span className="font-medium">Supplier:</span>{' '}
                        {selectedPO.supplierName}
                      </div>
                      <div>
                        <span className="font-medium">PO Amount:</span>{' '}
                        {formatCurrency(selectedPO.totalAmount)}
                      </div>
                      <div>
                        <span className="font-medium">Status:</span>{' '}
                        {selectedPO.status}
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Invoice Number */}
                <FormField
                  control={form.control}
                  name="invoiceNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Invoice Number{' '}
                        <span className="text-destructive">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., INV-001" {...field} />
                      </FormControl>
                      <FormDescription>
                        Must be unique (e.g., INV-001, 2025-001)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Invoice Date */}
                <FormField
                  control={form.control}
                  name="invoiceDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Invoice Date <span className="text-destructive">*</span>
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
              </div>

              {/* Total Amount */}
              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Total Amount (₹){' '}
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
                      Typically matches the PO total amount (auto-filled)
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
              onClick={handleBack}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Creating...' : 'Create Invoice'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
