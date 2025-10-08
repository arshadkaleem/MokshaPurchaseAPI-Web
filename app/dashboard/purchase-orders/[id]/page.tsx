'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePurchaseOrder } from '@/lib/hooks/usePurchaseOrders';
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
import { AlertCircle, ArrowLeft, Pencil, Printer } from 'lucide-react';
import { formatCurrency } from '@/lib/validations/purchase-order-schema';

/**
 * Purchase Order Detail Page
 *
 * C# equivalent: PurchaseOrdersController Details action + Razor View
 */

export default function PurchaseOrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const purchaseOrderId = parseInt(params.id as string, 10);

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error, refetch } = usePurchaseOrder(purchaseOrderId);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Navigate back to list
   */
  const handleBack = () => {
    router.push('/dashboard/purchase-orders');
  };

  /**
   * Navigate to edit page
   */
  const handleEdit = () => {
    router.push(`/dashboard/purchase-orders/${purchaseOrderId}/edit`);
  };

  /**
   * Handle print (placeholder)
   */
  const handlePrint = () => {
    window.print();
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get status badge variant
   */
  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      'default' | 'secondary' | 'destructive' | 'outline'
    > = {
      Draft: 'outline',
      Pending: 'default',
      Approved: 'secondary',
      Shipped: 'default',
      Received: 'secondary',
      Completed: 'secondary',
      Cancelled: 'destructive',
    };

    return <Badge variant={variants[status] || 'default'}>{status}</Badge>;
  };

  /**
   * Format date
   */
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  /**
   * Format date with time
   */
  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">
              {isLoading
                ? 'Loading...'
                : `PO-${purchaseOrderId.toString().padStart(5, '0')}`}
            </h1>
            <p className="text-muted-foreground">Purchase Order Details</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button onClick={handleEdit}>
            <Pencil className="mr-2 h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load purchase order. Please try again.
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
        <div className="space-y-6">
          <Card>
            <CardContent className="pt-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-64" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-48" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Data Display */}
      {!isLoading && !error && data && (
        <div className="space-y-6">
          {/* Basic Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    PO Number
                  </label>
                  <p className="mt-1 text-lg font-semibold">
                    PO-{data.data.purchaseOrderId.toString().padStart(5, '0')}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Status
                  </label>
                  <div className="mt-1">
                    {getStatusBadge(data.data.status)}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Project
                  </label>
                  <p className="mt-1 text-lg">{data.data.projectName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Supplier
                  </label>
                  <p className="mt-1 text-lg">{data.data.supplierName}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Order Date
                  </label>
                  <p className="mt-1 text-lg">
                    {formatDate(data.data.orderDate)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created By
                  </label>
                  <p className="mt-1 text-lg">{data.data.createdBy}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Created At
                  </label>
                  <p className="mt-1 text-lg">
                    {formatDateTime(data.data.createdAt)}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">
                    Last Updated
                  </label>
                  <p className="mt-1 text-lg">
                    {formatDateTime(data.data.updatedAt)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Line Items Card */}
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Material</TableHead>
                    <TableHead>Unit</TableHead>
                    <TableHead className="text-right">Quantity</TableHead>
                    <TableHead className="text-right">Unit Price</TableHead>
                    <TableHead className="text-right">Line Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.data.items.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="py-10 text-center">
                        <p className="text-muted-foreground">
                          No items in this purchase order.
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.data.items.map((item) => (
                      <TableRow key={item.purchaseOrderItemId}>
                        <TableCell className="font-medium">
                          {item.materialName}
                        </TableCell>
                        <TableCell>{item.unitOfMeasure}</TableCell>
                        <TableCell className="text-right">
                          {item.quantity.toLocaleString('en-IN')}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(item.lineTotal)}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {/* Total */}
              {data.data.items.length > 0 && (
                <div className="mt-6 flex justify-end border-t pt-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-16">
                      <span className="text-lg font-medium">Total Amount:</span>
                      <span className="text-2xl font-bold">
                        {formatCurrency(data.data.totalAmount)}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
