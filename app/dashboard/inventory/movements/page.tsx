'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useInventoryMovements } from '@/lib/hooks/useInventory';
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
  TrendingUp,
  TrendingDown,
  RefreshCw,
  ArrowLeft,
} from 'lucide-react';
import type { MovementQueryParams } from '@/lib/api/inventory';
import { formatDate, formatQuantity } from '@/lib/validations/inventory-schema';
import { MovementTypes } from '@/types/inventory.types';

/**
 * Inventory Movements List Page
 *
 * C# equivalent: InventoryController Movements action + Razor View
 */

export default function InventoryMovementsPage() {
  const router = useRouter();

  // ============================================
  // STATE MANAGEMENT
  // ============================================

  const [filters, setFilters] = useState<MovementQueryParams>({
    movementType: undefined,
  });

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error, refetch } = useInventoryMovements(filters);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    router.push('/dashboard/inventory');
  };

  const handleRecordMovement = () => {
    router.push('/dashboard/inventory/movements/new');
  };

  const handleMovementTypeChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      movementType: value === 'all' ? undefined : value,
    }));
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get movement type badge
   */
  const getMovementTypeBadge = (type: string) => {
    const typeConfig: Record<
      string,
      { variant: 'default' | 'secondary' | 'destructive'; icon: React.ReactNode; color: string }
    > = {
      In: {
        variant: 'secondary',
        icon: <TrendingUp className="mr-1 h-3 w-3" />,
        color: 'bg-green-100 text-green-800',
      },
      Out: {
        variant: 'destructive',
        icon: <TrendingDown className="mr-1 h-3 w-3" />,
        color: 'bg-red-100 text-red-800',
      },
      Adjustment: {
        variant: 'default',
        icon: <RefreshCw className="mr-1 h-3 w-3" />,
        color: 'bg-blue-100 text-blue-800',
      },
    };

    const config = typeConfig[type] || typeConfig.Adjustment;

    return (
      <Badge variant="secondary" className={`flex w-fit items-center ${config.color}`}>
        {config.icon}
        {type}
      </Badge>
    );
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
          Back to Inventory
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">Stock Movements</h1>
            <p className="text-muted-foreground">
              View history of all inventory transactions
            </p>
          </div>
          <Button onClick={handleRecordMovement}>
            <Plus className="mr-2 h-4 w-4" />
            Record Movement
          </Button>
        </div>
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Movement Type Filter */}
            <Select
              value={filters.movementType || 'all'}
              onValueChange={handleMovementTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by movement type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                {MovementTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* TODO: Add Material filter */}
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
            Failed to load movements. Please try again.
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
                  <TableHead>Date</TableHead>
                  <TableHead>Material Code</TableHead>
                  <TableHead>Material Name</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Quantity</TableHead>
                  <TableHead className="text-right">Balance After</TableHead>
                  <TableHead>Notes</TableHead>
                  <TableHead>Performed By</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="py-10 text-center">
                      <p className="text-muted-foreground">
                        No movements found. Record your first stock movement!
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((movement) => (
                    <TableRow key={movement.movementID}>
                      <TableCell className="font-medium">
                        {formatDate(movement.movementDate)}
                      </TableCell>
                      <TableCell>{movement.material.materialCode}</TableCell>
                      <TableCell>{movement.material.materialName}</TableCell>
                      <TableCell>
                        {getMovementTypeBadge(movement.movementType)}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        <span
                          className={
                            movement.movementType === 'In'
                              ? 'text-green-600'
                              : movement.movementType === 'Out'
                              ? 'text-red-600'
                              : ''
                          }
                        >
                          {movement.movementType === 'In' && '+'}
                          {movement.movementType === 'Out' && '-'}
                          {formatQuantity(
                            Math.abs(movement.quantity),
                            movement.material.unitOfMeasure
                          )}
                        </span>
                      </TableCell>
                      <TableCell className="text-right">
                        {formatQuantity(
                          movement.balanceAfter,
                          movement.material.unitOfMeasure
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {movement.notes || '-'}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-sm text-muted-foreground">
                          {movement.performedBy || '-'}
                        </span>
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
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Total Movements</p>
                <p className="text-2xl font-bold">{data.data.length}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock In</p>
                <p className="text-2xl font-bold text-green-600">
                  {data.data.filter((m) => m.movementType === 'In').length}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Stock Out</p>
                <p className="text-2xl font-bold text-red-600">
                  {data.data.filter((m) => m.movementType === 'Out').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
