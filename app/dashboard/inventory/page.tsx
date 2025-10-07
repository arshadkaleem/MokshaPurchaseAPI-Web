'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventory } from '@/lib/hooks/useInventory';
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
import { Input } from '@/components/ui/input';
import {
  AlertCircle,
  Plus,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  Package,
  History,
} from 'lucide-react';
import type { InventoryQueryParams } from '@/lib/api/inventory';
import { formatCurrency, formatQuantity, calculateStockValue } from '@/lib/validations/inventory-schema';
import { getStockStatus, type StockStatus } from '@/types/inventory.types';

/**
 * Inventory List Page
 *
 * C# equivalent: InventoryController Index action + Razor View
 */

export default function InventoryPage() {
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [filters, setFilters] = useState<InventoryQueryParams>({
    lowStockOnly: false,
  });

  const [searchTerm, setSearchTerm] = useState('');

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error, refetch } = useInventory(filters);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleRecordMovement = () => {
    router.push('/dashboard/inventory/movements/new');
  };

  const handleViewMovements = () => {
    router.push('/dashboard/inventory/movements');
  };

  const handleToggleLowStock = () => {
    setFilters((prev) => ({
      ...prev,
      lowStockOnly: !prev.lowStockOnly,
    }));
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get stock status badge
   */
  const getStockStatusBadge = (
    current: number,
    minimum: number,
    maximum: number | null
  ) => {
    const status = getStockStatus(current, minimum, maximum);

    const statusConfig: Record<
      StockStatus,
      { variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode }
    > = {
      'Out of Stock': {
        variant: 'destructive',
        icon: <AlertTriangle className="mr-1 h-3 w-3" />,
      },
      Low: {
        variant: 'destructive',
        icon: <TrendingDown className="mr-1 h-3 w-3" />,
      },
      Normal: {
        variant: 'secondary',
        icon: <Package className="mr-1 h-3 w-3" />,
      },
      Overstocked: {
        variant: 'default',
        icon: <TrendingUp className="mr-1 h-3 w-3" />,
      },
    };

    const config = statusConfig[status];

    return (
      <Badge variant={config.variant} className="flex w-fit items-center">
        {config.icon}
        {status}
      </Badge>
    );
  };

  /**
   * Filter data by search term
   */
  const filteredData = data?.data.filter((item) =>
    item.material.materialName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.material.materialCode.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  /**
   * Calculate totals
   */
  const totalValue = filteredData.reduce(
    (sum, item) => sum + calculateStockValue(item.currentStock, item.material.unitPrice),
    0
  );

  const lowStockCount = filteredData.filter(
    (item) => item.currentStock < item.minimumStock
  ).length;

  const outOfStockCount = filteredData.filter(
    (item) => item.currentStock <= 0
  ).length;

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inventory</h1>
          <p className="text-muted-foreground">
            Track material stock levels and movements
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleViewMovements}>
            <History className="mr-2 h-4 w-4" />
            View Movements
          </Button>
          <Button onClick={handleRecordMovement}>
            <Plus className="mr-2 h-4 w-4" />
            Record Movement
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      {!isLoading && data && (
        <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{filteredData.length}</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Value
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {formatCurrency(totalValue)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Low Stock Items
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">
                {lowStockCount}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Out of Stock
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">
                {outOfStockCount}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <Input
              placeholder="Search by material name or code..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-md"
            />
            <Button
              variant={filters.lowStockOnly ? 'default' : 'outline'}
              onClick={handleToggleLowStock}
            >
              <AlertTriangle className="mr-2 h-4 w-4" />
              Low Stock Only
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load inventory. Please try again.
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
                  <TableHead>Material Code</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead className="text-right">Current Stock</TableHead>
                  <TableHead className="text-right">Min Stock</TableHead>
                  <TableHead className="text-right">Max Stock</TableHead>
                  <TableHead className="text-right">Unit Price</TableHead>
                  <TableHead className="text-right">Stock Value</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Location</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={9} className="py-10 text-center">
                      <p className="text-muted-foreground">
                        {searchTerm
                          ? 'No materials found matching your search.'
                          : 'No inventory records found. Materials will appear here automatically.'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData.map((item) => {
                    const stockValue = calculateStockValue(
                      item.currentStock,
                      item.material.unitPrice
                    );

                    return (
                      <TableRow key={item.inventoryID}>
                        <TableCell className="font-medium">
                          {item.material.materialCode}
                        </TableCell>
                        <TableCell>{item.material.materialName}</TableCell>
                        <TableCell className="text-right font-semibold">
                          {formatQuantity(
                            item.currentStock,
                            item.material.unitOfMeasure
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {formatQuantity(
                            item.minimumStock,
                            item.material.unitOfMeasure
                          )}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {item.maximumStock
                            ? formatQuantity(
                                item.maximumStock,
                                item.material.unitOfMeasure
                              )
                            : '-'}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(item.material.unitPrice)}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-green-600">
                          {formatCurrency(stockValue)}
                        </TableCell>
                        <TableCell>
                          {getStockStatusBadge(
                            item.currentStock,
                            item.minimumStock,
                            item.maximumStock
                          )}
                        </TableCell>
                        <TableCell>
                          <span className="text-sm text-muted-foreground">
                            {item.warehouseLocation || '-'}
                          </span>
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
