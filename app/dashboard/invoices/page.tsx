'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInvoices, useDeleteInvoice } from '@/lib/hooks/useInvoices';
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
import {
  AlertCircle,
  Plus,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle,
} from 'lucide-react';
import type { InvoicesQueryParams } from '@/lib/api/invoices';
import {
  formatCurrency,
  formatDate,
  calculateOutstandingAmount,
} from '@/lib/validations/invoice-schema';

/**
 * Invoices List Page
 *
 * C# equivalent: InvoicesController Index action + Razor View
 */

export default function InvoicesPage() {
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [filters, setFilters] = useState<InvoicesQueryParams>({
    purchaseOrderId: undefined,
    status: undefined,
  });

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error, refetch } = useInvoices(filters);
  const deleteMutation = useDeleteInvoice();

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === 'all' ? undefined : value,
    }));
  };

  const handleCreate = () => {
    router.push('/dashboard/invoices/new');
  };

  const handleView = (id: number) => {
    router.push(`/dashboard/invoices/${id}`);
  };

  const handleEdit = (id: number) => {
    router.push(`/dashboard/invoices/${id}/edit`);
  };

  const handleDelete = async (id: number, invoiceNumber: string) => {
    if (!confirm(`Are you sure you want to delete invoice ${invoiceNumber}?`)) {
      return;
    }

    deleteMutation.mutate(id);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get status badge with appropriate color
   */
  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      Pending: 'default',
      Paid: 'secondary',
      Cancelled: 'destructive',
    };

    const icons: Record<string, React.ReactNode> = {
      Pending: null,
      Paid: <CheckCircle className="mr-1 h-3 w-3" />,
      Cancelled: <XCircle className="mr-1 h-3 w-3" />,
    };

    return (
      <Badge
        variant={variants[status] || 'default'}
        className="flex w-fit items-center"
      >
        {icons[status]}
        {status}
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
          <h1 className="text-3xl font-bold">Invoices</h1>
          <p className="text-muted-foreground">
            Manage invoices and track payments
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Invoice
        </Button>
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Status Filter */}
            <Select
              value={filters.status || 'all'}
              onValueChange={handleStatusChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* TODO: Add PO Filter */}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load invoices. Please try again.
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
                  <TableHead>Invoice Number</TableHead>
                  <TableHead>PO Number</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Invoice Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Outstanding</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No invoices found. Create your first invoice!
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((invoice) => {
                    const outstanding = calculateOutstandingAmount(
                      invoice.totalAmount,
                      invoice.payments || []
                    );

                    return (
                      <TableRow key={invoice.invoiceID}>
                        <TableCell className="font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          {invoice.purchaseOrder?.poNumber ||
                            `PO-${invoice.purchaseOrderID.toString().padStart(5, '0')}`}
                        </TableCell>
                        <TableCell>
                          {invoice.purchaseOrder?.supplierName || 'N/A'}
                        </TableCell>
                        <TableCell>{formatDate(invoice.invoiceDate)}</TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(invoice.totalAmount)}
                        </TableCell>
                        <TableCell className="text-right">
                          {outstanding > 0 ? (
                            <span className="font-medium text-orange-600">
                              {formatCurrency(outstanding)}
                            </span>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(invoice.invoiceID)}
                              title="Edit invoice status"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                handleDelete(
                                  invoice.invoiceID,
                                  invoice.invoiceNumber
                                )
                              }
                              disabled={deleteMutation.isPending}
                              title="Delete invoice"
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
