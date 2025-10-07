'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  usePurchaseOrders,
  useDeletePurchaseOrder,
} from '@/lib/hooks/usePurchaseOrders';
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
import { AlertCircle, Plus, Pencil, Trash2, Eye } from 'lucide-react';
import type { PurchaseOrdersQueryParams } from '@/lib/api/purchase-orders';
import { formatCurrency } from '@/lib/validations/purchase-order-schema';

/**
 * Purchase Orders List Page
 *
 * C# equivalent: PurchaseOrdersController Index action + Razor View
 */

export default function PurchaseOrdersPage() {
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [filters, setFilters] = useState<PurchaseOrdersQueryParams>({
    projectId: undefined,
    supplierId: undefined,
    status: undefined,
    page: 1,
    pageSize: 20,
  });

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error, refetch } = usePurchaseOrders(filters);
  const deleteMutation = useDeletePurchaseOrder();

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle status filter change
   */
  const handleStatusChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      status: value === 'all' ? undefined : value,
      page: 1,
    }));
  };

  /**
   * Handle pagination
   */
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  /**
   * Navigate to create page
   */
  const handleCreate = () => {
    router.push('/dashboard/purchase-orders/new');
  };

  /**
   * Navigate to edit page
   */
  const handleEdit = (id: number) => {
    router.push(`/dashboard/purchase-orders/${id}/edit`);
  };

  /**
   * Navigate to details page
   */
  const handleView = (id: number) => {
    router.push(`/dashboard/purchase-orders/${id}`);
  };

  /**
   * Handle delete purchase order
   */
  const handleDelete = async (id: number, poNumber: string) => {
    if (!confirm(`Are you sure you want to delete PO #${poNumber}?`)) {
      return;
    }

    deleteMutation.mutate(id);
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

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage your purchase orders and track materials
          </p>
        </div>
        <Button onClick={handleCreate}>
          <Plus className="mr-2 h-4 w-4" />
          Create Purchase Order
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
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Received">Received</SelectItem>
                {/* <SelectItem value="Completed">Completed</SelectItem> */}
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

            {/* TODO: Add Project Filter */}
            {/* TODO: Add Supplier Filter */}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load purchase orders. Please try again.
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
                  <TableHead>PO Number</TableHead>
                  <TableHead>Project</TableHead>
                  <TableHead>Supplier</TableHead>
                  <TableHead>Order Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Total Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No purchase orders found. Create your first purchase
                        order!
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((po) => (
                    <TableRow key={po.purchaseOrderId}>
                      <TableCell className="font-medium">
                        PO-{po.purchaseOrderId.toString().padStart(5, '0')}
                      </TableCell>
                      <TableCell>{po.projectName}</TableCell>
                      <TableCell>{po.supplierName}</TableCell>
                      <TableCell>{formatDate(po.orderDate)}</TableCell>
                      <TableCell>{getStatusBadge(po.status)}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(po.totalAmount)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleView(po.purchaseOrderId)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(po.purchaseOrderId)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                po.purchaseOrderId,
                                `PO-${po.purchaseOrderId.toString().padStart(5, '0')}`
                              )
                            }
                            disabled={deleteMutation.isPending}
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

            {/* Pagination */}
            {data.pagination && data.pagination.totalPages > 1 && (
              <div className="mt-4 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  Showing {data.data.length} of {data.pagination.totalRecords}{' '}
                  purchase orders
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page! - 1)}
                    disabled={!data.pagination.hasPreviousPage}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(filters.page! + 1)}
                    disabled={!data.pagination.hasNextPage}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
