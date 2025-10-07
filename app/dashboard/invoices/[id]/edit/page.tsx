'use client';

import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import EditInvoiceForm from '@/components/forms/edit-invoice-form';
import { useInvoice } from '@/lib/hooks/useInvoices';

/**
 * Edit Invoice Page
 *
 * C# equivalent: Edit action in InvoicesController
 * Route: /dashboard/invoices/[id]/edit
 *
 * Important: Invoices can only update their status, not other fields
 */

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = parseInt(params.id as string, 10);

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data, isLoading, error } = useInvoice(invoiceId);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    router.push('/dashboard/invoices');
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
            <p className="text-muted-foreground">Loading invoice...</p>
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
          Back to Invoices
        </Button>

        <Alert variant="destructive">
          <AlertDescription>
            Failed to load invoice. Please try again later.
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
          Back to Invoices
        </Button>

        <Alert>
          <AlertDescription>Invoice not found.</AlertDescription>
        </Alert>
      </div>
    );
  }

  const invoice = data.data;

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Invoices
        </Button>
        <h1 className="text-3xl font-bold">Edit Invoice</h1>
        <p className="text-muted-foreground">
          Update the payment status for invoice {invoice.invoiceNumber}
        </p>
      </div>

      {/* Edit Form */}
      <EditInvoiceForm invoice={invoice} />
    </div>
  );
}
