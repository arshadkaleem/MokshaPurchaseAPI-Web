'use client';

import { useParams, useRouter } from 'next/navigation';
import { useSupplier } from '@/lib/hooks/useSuppliers';
import { EditSupplierForm } from '@/components/forms/edit-supplier-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * Edit Supplier Page
 * 
 * C# equivalent: Edit action in SuppliersController
 * 
 * Route: /dashboard/suppliers/[id]/edit
 * Example: /dashboard/suppliers/5/edit
 * 
 * Like:
 * [HttpGet]
 * public async Task<IActionResult> Edit(int id)
 * {
 *     var supplier = await _service.GetByIdAsync(id);
 *     if (supplier == null) return NotFound();
 *     return View(supplier);
 * }
 */

export default function EditSupplierPage() {
  const params = useParams();
  const router = useRouter();
  
  // Get the supplier ID from URL parameter
  // C# equivalent: int id parameter in action method
  const supplierId = parseInt(params.id as string);

  // Fetch the supplier data
  // C# equivalent: await _service.GetByIdAsync(id)
  const { data, isLoading, error } = useSupplier(supplierId);

  /**
   * Navigate back to suppliers list
   * C# equivalent: return RedirectToAction("Index")
   */
  const handleBack = () => {
    router.push('/dashboard/suppliers');
  };

  /**
   * Handle successful update
   */
  const handleSuccess = () => {
    router.push('/dashboard/suppliers');
  };

  // ============================================
  // LOADING STATE
  // ============================================
  
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // ============================================
  // ERROR STATE
  // ============================================
  
  if (error || !data) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load supplier. The supplier may not exist or you may not have permission to view it.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Suppliers
        </Button>
      </div>
    );
  }

  // ============================================
  // SUCCESS - SHOW THE FORM
  // ============================================
  
  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Suppliers
        </Button>
        <h1 className="text-3xl font-bold">Edit Supplier</h1>
        <p className="text-muted-foreground">
          Update details for {data.data.supplierName}
        </p>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Supplier Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditSupplierForm
            supplierId={supplierId}
            initialData={data.data}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}