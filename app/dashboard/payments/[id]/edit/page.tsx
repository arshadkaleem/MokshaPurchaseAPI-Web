'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditPaymentForm from '@/components/forms/edit-payment-form';
import { usePayment } from '@/lib/hooks/usePayments';

/**
 * Edit Payment Page
 *
 * C# equivalent: Edit action in PaymentsController
 * Route: /dashboard/payments/[id]/edit
 */

export default function EditPaymentPage() {
  const params = useParams();
  const router = useRouter();
  const paymentId = parseInt(params.id as string, 10);

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error } = usePayment(paymentId);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    router.push('/dashboard/payments');
  };

  // ============================================
  // RENDER STATES
  // ============================================

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="text-muted-foreground">Loading payment...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto py-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>

        <Alert variant="destructive">
          <AlertDescription>
            Failed to load payment. Please try again later.
            <br />
            {error instanceof Error ? error.message : 'Unknown error'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // No data state
  if (!data?.data) {
    return (
      <div className="container mx-auto py-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>

        <Alert>
          <AlertDescription>Payment not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const payment = data.data;

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Payments
        </Button>
        <h1 className="text-3xl font-bold">Edit Payment</h1>
        <p className="text-muted-foreground">
          Update payment details for invoice {payment.invoice?.invoiceNumber || 'N/A'}
        </p>
      </div>

      {/* Edit Form */}
      <EditPaymentForm payment={payment} />
    </div>
  );
}
