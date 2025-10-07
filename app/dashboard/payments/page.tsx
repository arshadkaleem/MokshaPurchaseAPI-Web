'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePayments, useDeletePayment } from '@/lib/hooks/usePayments';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  Plus,
  Edit,
  Trash2,
  CreditCard,
  CheckCircle,
} from 'lucide-react';
import type { PaymentsQueryParams } from '@/lib/api/payments';
import { formatCurrency, formatDate } from '@/lib/validations/payment-schema';
import { PaymentMethods } from '@/types/payments.types';

/**
 * Payments List Page
 *
 * C# equivalent: PaymentsController Index action + Razor View
 */

export default function PaymentsPage() {
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [filters, setFilters] = useState<PaymentsQueryParams>({
    invoiceId: undefined,
    paymentMethod: undefined,
  });

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error, refetch } = usePayments(filters);
  const deleteMutation = useDeletePayment();

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handlePaymentMethodChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      paymentMethod: value === 'all' ? undefined : value,
    }));
  };

  const handleCreate = () => {
    router.push('/dashboard/payments/new');
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/payments/${id}/edit`);
  };

  const handleDelete = async (
    id: number,
    invoiceNumber: string,
    amount: number
  ) => {
    if (
      !confirm(
        `Are you sure you want to delete payment of ${formatCurrency(amount)} for invoice ${invoiceNumber}?`
      )
    ) {
      return;
    }

    deleteMutation.mutate(id);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get payment method badge
   */
  const getPaymentMethodBadge = (method: string | null) => {
    if (!method) {
      return <Badge variant="outline">N/A</Badge>;
    }

    const colorMap: Record<string, string> = {
      Cash: 'bg-green-100 text-green-800',
      Check: 'bg-blue-100 text-blue-800',
      'Bank Transfer': 'bg-purple-100 text-purple-800',
      'Credit Card': 'bg-orange-100 text-orange-800',
      'Debit Card': 'bg-pink-100 text-pink-800',
      'Online Payment': 'bg-indigo-100 text-indigo-800',
    };

    const colorClass = colorMap[method] || 'bg-gray-100 text-gray-800';

    return (
      <Badge variant="secondary" className={colorClass}>
        <CreditCard className="mr-1 h-3 w-3" />
        {method}
      </Badge>
    );
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Payments</h1>
          <p className="text-muted-foreground">
            Manage payments and track transactions
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Record Payment
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Payment Method Filter */}
            <Select
              value={filters.paymentMethod || 'all'}
              onValueChange={handlePaymentMethodChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                {PaymentMethods.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* TODO: Add Invoice ID filter */}
            {/* TODO: Add Date range filter */}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load payments. Please try again.
            <Button
              variant="outline"
              size="sm"
              className="ml-4"
              onClick={() => refetch()}
            >
              Retry
            </Button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Data Table */}
      {!isLoading && !error && data && (
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Payment Date</TableHead>
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>Project / Supplier</TableHead>
                  <TableHead>Payment Method</TableHead>
                  <TableHead>Transaction Ref</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No payments found. Record your first payment!
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((payment) => (
                    <TableRow key={payment.paymentID}>
                      <TableCell className="font-medium">
                        {formatDate(payment.paymentDate)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {payment.invoice?.invoiceNumber || 'N/A'}
                          {payment.invoice?.status === 'Paid' && (
                            <Badge
                              variant="secondary"
                              className="bg-green-100 text-green-800"
                            >
                              <CheckCircle className="mr-1 h-3 w-3" />
                              Paid
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          <div className="font-medium">
                            {payment.invoice?.purchaseOrder?.projectName ||
                              'N/A'}
                          </div>
                          <div className="text-muted-foreground">
                            {payment.invoice?.purchaseOrder?.supplierName ||
                              'N/A'}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPaymentMethodBadge(payment.paymentMethod)}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {payment.transactionReference || '-'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right font-semibold text-green-600">
                        {formatCurrency(payment.amount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(payment.paymentID)}
                            title="Edit payment"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                payment.paymentID,
                                payment.invoice?.invoiceNumber || 'Unknown',
                                payment.amount
                              )
                            }
                            disabled={deleteMutation.isPending}
                            title="Delete payment"
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Summary Stats */}
      {!isLoading && !error && data && data.data.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Payments</p>
                <p className="text-2xl font-bold">{data.data.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Amount</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    data.data.reduce(
                      (sum, payment) => sum + payment.amount,
                      0
                    )
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
