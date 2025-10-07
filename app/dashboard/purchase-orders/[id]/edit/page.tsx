'use client';

import { useParams, useRouter } from 'next/navigation';
import { usePurchaseOrder } from '@/lib/hooks/usePurchaseOrders';
import { EditPurchaseOrderForm } from '@/components/forms/edit-purchase-order-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * Edit Purchase Order Page
 *
 * C# equivalent: Edit action in PurchaseOrdersController
 *
 * Route: /dashboard/purchase-orders/[id]/edit
 * Example: /dashboard/purchase-orders/1/edit
 */

export default function EditPurchaseOrderPage() {
  const params = useParams();
  const router = useRouter();

  const purchaseOrderId = parseInt(params.id as string);

  // Fetch the purchase order data (includes all line items)
  const { data, isLoading, error } = usePurchaseOrder(purchaseOrderId);

  const handleBack = () => {
    router.push('/dashboard/purchase-orders');
  };

  const handleSuccess = () => {
    router.push('/dashboard/purchase-orders');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="mb-2 h-8 w-64" />
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
            <Skeleton className="h-20 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  // Error state
  if (error || !data) {
    return (
      <div className="container mx-auto py-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load purchase order. The purchase order may not exist.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchase Orders
        </Button>
      </div>
    );
  }

  // Success - show the form
  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Purchase Orders
        </Button>
        <h1 className="text-3xl font-bold">Edit Purchase Order</h1>
        <p className="text-muted-foreground">
          Update purchase order details and line items
        </p>
      </div>

      <EditPurchaseOrderForm
        purchaseOrderId={purchaseOrderId}
        initialData={data.data}
        onSuccess={handleSuccess}
      />
    </div>
  );
}
