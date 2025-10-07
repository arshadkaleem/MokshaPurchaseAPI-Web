'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSuppliers, useDeleteSupplier } from '@/lib/hooks/useSuppliers';
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
  Pencil, 
  Trash2,
  Search,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import type { SuppliersQueryParams } from '@/lib/api/suppliers';
import { CreateSupplierForm } from '@/components/forms/create-supplier-form';

/**
 * Suppliers List Page
 * 
 * C# equivalent: SuppliersController Index action + Razor View
 * 
 * Like:
 * public async Task<IActionResult> Index(bool? isGSTRegistered, string? search, int page = 1)
 * {
 *     var suppliers = await _service.GetSuppliersAsync(isGSTRegistered, search, page);
 *     return View(suppliers);
 * }
 */

export default function SuppliersPage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Filters state (like ViewBag/ViewData in C# MVC)
  const [filters, setFilters] = useState<SuppliersQueryParams>({
    isGSTRegistered: undefined,
    search: undefined,
    page: 1,
    pageSize: 20,
  });

  // Search input (we'll debounce this later if needed)
  const [searchInput, setSearchInput] = useState('');

  // Router for navigation
  const router = useRouter();

  // ============================================
  // DATA FETCHING
  // ============================================

  // Fetch suppliers using our custom hook
  const { data, isLoading, error, refetch } = useSuppliers(filters);

  // Delete mutation
  const deleteMutation = useDeleteSupplier();

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle GST filter change
   * C# equivalent: OnChange event handler
   */
  const handleGSTFilterChange = (value: string) => {
    setFilters((prev) => ({
      ...prev,
      isGSTRegistered: value === 'all' ? undefined : value === 'true',
      page: 1, // Reset to first page
    }));
  };

  /**
   * Handle search
   * C# equivalent: Search button click or form submit
   */
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
      page: 1,
    }));
  };

  /**
   * Handle search input key press (Enter key)
   */
  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * Handle pagination
   * C# equivalent: Page change in GridView
   */
  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  /**
   * Handle delete supplier
   * C# equivalent: Delete action
   */
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    deleteMutation.mutate(id);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Get GST registration badge
   * Green for registered, gray for not registered
   */
  const getGSTBadge = (isRegistered: boolean, gstin: string | null) => {
    if (isRegistered) {
      return (
        <div className="flex items-center gap-2">
          <Badge variant="default" className="bg-green-100 text-green-800">
            <CheckCircle2 className="h-3 w-3 mr-1" />
            Registered
          </Badge>
          {gstin && (
            <span className="text-xs text-muted-foreground">{gstin}</span>
          )}
        </div>
      );
    }
    return (
      <Badge variant="secondary" className="bg-gray-100 text-gray-800">
        <XCircle className="h-3 w-3 mr-1" />
        Not Registered
      </Badge>
    );
  };

  /**
   * Format phone number
   * C# equivalent: string.Format for display
   */
  const formatPhone = (phone: string | null) => {
    return phone || 'N/A';
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage your suppliers and vendors
          </p>
        </div>
        <CreateSupplierForm onSuccess={() => refetch()} />
      </div>

      {/* Filters Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <div className="md:col-span-2 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, email, or GSTIN..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                  className="pl-8"
                />
              </div>
              <Button onClick={handleSearch} variant="secondary">
                Search
              </Button>
            </div>

            {/* GST Filter */}
            <Select
              value={
                filters.isGSTRegistered === undefined
                  ? 'all'
                  : filters.isGSTRegistered
                  ? 'true'
                  : 'false'
              }
              onValueChange={handleGSTFilterChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Filter by GST status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Suppliers</SelectItem>
                <SelectItem value="true">GST Registered</SelectItem>
                <SelectItem value="false">Not GST Registered</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load suppliers. Please try again.
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
                  <TableHead>Supplier Name</TableHead>
                  <TableHead>Contact Person</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>GST Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-muted-foreground">
                        No suppliers found. Create your first supplier!
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((supplier) => (
                    <TableRow key={supplier.supplierId}>
                      <TableCell className="font-medium">
                        {supplier.supplierName}
                      </TableCell>
                      <TableCell>{supplier.contactName || 'N/A'}</TableCell>
                      <TableCell>{supplier.email || 'N/A'}</TableCell>
                      <TableCell>{formatPhone(supplier.phone)}</TableCell>
                      <TableCell>
                        {getGSTBadge(supplier.isGSTRegistered, supplier.gstin)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => 
                              router.push(`/dashboard/suppliers/${supplier.supplierId}/edit`)
                            }
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                supplier.supplierId,
                                supplier.supplierName
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
              <div className="flex items-center justify-between mt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {data.data.length} of {data.pagination.totalRecords}{' '}
                  suppliers
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