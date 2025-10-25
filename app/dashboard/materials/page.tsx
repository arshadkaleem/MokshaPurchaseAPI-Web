'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMaterials, useDeleteMaterial } from '@/lib/hooks/useMaterials';
import { Button } from '@/components/ui/button';
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
  Pencil, 
  Trash2,
  Search,
} from 'lucide-react';
import type { MaterialsQueryParams } from '@/lib/api/materials';
import { CreateMaterialForm } from '@/components/forms/create-material-form';

/**
 * Materials List Page
 * 
 * C# equivalent: MaterialsController Index action + Razor View
 * 
 * Like:
 * public async Task<IActionResult> Index(string? search, int page = 1)
 * {
 *     var materials = await _service.GetMaterialsAsync(search, page);
 *     return View(materials);
 * }
 */

export default function MaterialsPage() {
  // ============================================
  // STATE MANAGEMENT
  // ============================================
  
  // Filters state
  const [filters, setFilters] = useState<MaterialsQueryParams>({
    search: undefined,
    page: 1,
    pageSize: 20,
  });

  // Search input (local state before applying filter)
  const [searchInput, setSearchInput] = useState('');

  // Router for navigation
  const router = useRouter();

  // ============================================
  // DATA FETCHING
  // ============================================

  // Fetch materials using our custom hook
  const { data, isLoading, error, refetch } = useMaterials(filters);

  // Delete mutation
  const deleteMutation = useDeleteMaterial();

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Handle search
   * C# equivalent: Search button click or form submit
   */
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search: searchInput.trim() || undefined,
      page: 1, // Reset to first page
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
   * Clear search
   */
  const handleClearSearch = () => {
    setSearchInput('');
    setFilters((prev) => ({
      ...prev,
      search: undefined,
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
   * Handle delete material
   * C# equivalent: Delete action
   */
  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Are you sure you want to delete "${name}"?`)) {
      return;
    }

    deleteMutation.mutate(id);
  };

  /**
   * Navigate to edit page
   */
  const handleEdit = (id: number) => {
    router.push(`/dashboard/materials/${id}/edit`);
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  /**
   * Truncate long descriptions
   */
  const truncateText = (text: string | null, maxLength: number = 50) => {
    if (!text) return 'N/A';
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  /**
   * Format date for display
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
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Materials</h1>
          <p className="text-muted-foreground">
            Manage your material catalog
          </p>
        </div>
        <CreateMaterialForm onSuccess={() => refetch()} />
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Search Materials</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by material name..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleSearchKeyPress}
                className="pl-8"
              />
            </div>
            <Button onClick={handleSearch} variant="secondary">
              Search
            </Button>
            {filters.search && (
              <Button onClick={handleClearSearch} variant="outline">
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load materials. Please try again.
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
                  <TableHead>Material Name</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>HSN Code</TableHead>
                  <TableHead>Unit of Measure</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.data.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-10">
                      <p className="text-muted-foreground">
                        {filters.search
                          ? `No materials found matching "${filters.search}"`
                          : 'No materials found. Create your first material!'}
                      </p>
                    </TableCell>
                  </TableRow>
                ) : (
                  data.data.map((material) => (
                    <TableRow key={material.materialId}>
                      <TableCell className="font-medium">
                        {material.materialName}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {truncateText(material.description)}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {material.hsnCode || 'N/A'}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {material.unitOfMeasure}
                        </span>
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {formatDate(material.updatedAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          {/* Edit Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(material.materialId)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>

                          {/* Delete Button */}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() =>
                              handleDelete(
                                material.materialId,
                                material.materialName
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
                  materials
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