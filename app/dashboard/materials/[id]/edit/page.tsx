'use client';

import { useParams, useRouter } from 'next/navigation';
import { useMaterial } from '@/lib/hooks/useMaterials';
import { EditMaterialForm } from '@/components/forms/edit-material-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * Edit Material Page
 * 
 * C# equivalent: Edit action in MaterialsController
 * 
 * Route: /dashboard/materials/[id]/edit
 * Example: /dashboard/materials/3/edit
 */

export default function EditMaterialPage() {
  const params = useParams();
  const router = useRouter();
  
  // Get the material ID from URL parameter
  const materialId = parseInt(params.id as string);

  // Fetch the material data
  const { data, isLoading, error } = useMaterial(materialId);

  /**
   * Navigate back to materials list
   */
  const handleBack = () => {
    router.push('/dashboard/materials');
  };

  /**
   * Handle successful update
   */
  const handleSuccess = () => {
    router.push('/dashboard/materials');
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
            <Skeleton className="h-20 w-full" />
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
            Failed to load material. The material may not exist.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Materials
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
          Back to Materials
        </Button>
        <h1 className="text-3xl font-bold">Edit Material</h1>
        <p className="text-muted-foreground">
          Update details for {data.data.materialName}
        </p>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Material Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditMaterialForm
            materialId={materialId}
            initialData={data.data}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}