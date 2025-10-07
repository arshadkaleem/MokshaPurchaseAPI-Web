'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCreateSupplier } from '@/lib/hooks/useSuppliers';
import { supplierSchema, type SupplierFormData } from '@/lib/validations/supplier-schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Loader2 } from 'lucide-react';

/**
 * Create Supplier Form (Modal)
 * 
 * C# equivalent: Partial View for Create modal
 * 
 * Like:
 * @model CreateSupplierRequest
 * @using (Html.BeginForm("Create", "Suppliers"))
 * {
 *     @Html.ValidationSummary()
 *     // Form fields...
 * }
 */

interface CreateSupplierFormProps {
  onSuccess?: () => void;
}

export function CreateSupplierForm({ onSuccess }: CreateSupplierFormProps) {
  // ============================================
  // STATE
  // ============================================
  
  const [open, setOpen] = useState(false);

  // ============================================
  // FORM SETUP
  // ============================================

  /**
   * React Hook Form setup
   * 
   * C# equivalent: Model binding in controller
   * 
   * [HttpPost]
   * public async Task<IActionResult> Create(CreateSupplierRequest model)
   * {
   *     if (!ModelState.IsValid)
   *         return View(model);
   *     // ...
   * }
   */
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      supplierName: '',
      contactName: null,
      email: null,
      phone: null,
      address: null,
      isGSTRegistered: false,
      gstin: null,
      gstRegistrationDate: null,
      gstStatus: null,
      stateCode: null,
      stateName: null,
      pan: null,
      gstType: null,
      turnoverRange: null,
      hsnCode: null,
      taxRate: null,
      isCompositionDealer: false,
      isECommerce: false,
      isReverseCharge: false,
      gstExemptionReason: null,
    },
  });

  // Watch the isGSTRegistered field to show/hide GST fields
  // C# equivalent: @if (Model.IsGSTRegistered) { ... }
  const isGSTRegistered = form.watch('isGSTRegistered');

  // ============================================
  // MUTATIONS
  // ============================================

  const createMutation = useCreateSupplier();

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Form submit handler
   * 
   * C# equivalent: Create action method
   */
  const onSubmit = async (data: SupplierFormData) => {
    try {
      await createMutation.mutateAsync(data);
      
      // Close modal on success
      setOpen(false);
      
      // Reset form
      form.reset();
      
      // Call parent callback if provided
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation (shows toast)
      console.error('Create supplier error:', error);
    }
  };

  /**
   * Handle modal close
   * Reset form when modal closes
   */
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      form.reset();
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Supplier
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Supplier</DialogTitle>
          <DialogDescription>
            Add a new supplier to your database. GST registration details are optional.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* ============================================ */}
          {/* BASIC INFORMATION SECTION */}
          {/* ============================================ */}
          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Information</h3>
            
            {/* Supplier Name - Required */}
            <div className="space-y-2">
              <Label htmlFor="supplierName">
                Supplier Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supplierName"
                {...form.register('supplierName')}
                placeholder="Enter supplier name"
              />
              {form.formState.errors.supplierName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.supplierName.message}
                </p>
              )}
            </div>

            {/* Contact Name - Optional */}
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Person</Label>
              <Input
                id="contactName"
                {...form.register('contactName')}
                placeholder="Enter contact person name"
              />
              {form.formState.errors.contactName && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.contactName.message}
                </p>
              )}
            </div>

            {/* Email - Optional */}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                {...form.register('email')}
                placeholder="supplier@example.com"
              />
              {form.formState.errors.email && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Phone - Optional */}
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                {...form.register('phone')}
                placeholder="+91 98765 43210"
              />
              {form.formState.errors.phone && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.phone.message}
                </p>
              )}
            </div>

            {/* Address - Optional */}
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Textarea
                id="address"
                {...form.register('address')}
                placeholder="Enter full address"
                rows={3}
              />
              {form.formState.errors.address && (
                <p className="text-sm text-red-500">
                  {form.formState.errors.address.message}
                </p>
              )}
            </div>
          </div>

          {/* ============================================ */}
          {/* GST REGISTRATION SECTION */}
          {/* ============================================ */}
          
          <div className="space-y-4 pt-4 border-t">
            <h3 className="text-lg font-semibold">GST Registration</h3>
            
            {/* GST Registered Checkbox */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isGSTRegistered"
                checked={isGSTRegistered}
                onCheckedChange={(checked) => {
                  form.setValue('isGSTRegistered', checked as boolean);
                  
                  // Clear GST fields when unchecking
                  if (!checked) {
                    form.setValue('gstin', null);
                    form.setValue('gstRegistrationDate', null);
                    form.setValue('gstStatus', null);
                    form.setValue('stateCode', null);
                    form.setValue('stateName', null);
                    form.setValue('pan', null);
                    form.setValue('gstType', null);
                    form.setValue('turnoverRange', null);
                    form.setValue('hsnCode', null);
                    form.setValue('taxRate', null);
                  }
                }}
              />
              <Label htmlFor="isGSTRegistered" className="font-normal cursor-pointer">
                Supplier is GST registered
              </Label>
            </div>

            {/* ============================================ */}
            {/* CONDITIONAL GST FIELDS */}
            {/* Show only if isGSTRegistered is TRUE */}
            {/* C# equivalent: @if (Model.IsGSTRegistered) { ... } */}
            {/* ============================================ */}
            
            {isGSTRegistered && (
              <div className="space-y-4 pl-6 border-l-2 border-primary/20">
                {/* GSTIN - Required when GST registered */}
                <div className="space-y-2">
                  <Label htmlFor="gstin">
                    GSTIN <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="gstin"
                    {...form.register('gstin')}
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                  />
                  {form.formState.errors.gstin && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.gstin.message}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Format: 2 digits + 10 characters + 1 digit + 1 char + Z + 1 char
                  </p>
                </div>

                {/* PAN - Optional */}
                <div className="space-y-2">
                  <Label htmlFor="pan">PAN</Label>
                  <Input
                    id="pan"
                    {...form.register('pan')}
                    placeholder="ABCDE1234F"
                    maxLength={10}
                    style={{ textTransform: 'uppercase' }}
                  />
                  {form.formState.errors.pan && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.pan.message}
                    </p>
                  )}
                </div>

                {/* GST Registration Date */}
                <div className="space-y-2">
                  <Label htmlFor="gstRegistrationDate">GST Registration Date</Label>
                  <Input
                    id="gstRegistrationDate"
                    type="date"
                    {...form.register('gstRegistrationDate')}
                  />
                </div>

                {/* State Code and Name - Two columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stateCode">State Code</Label>
                    <Input
                      id="stateCode"
                      {...form.register('stateCode')}
                      placeholder="27"
                      maxLength={2}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="stateName">State Name</Label>
                    <Input
                      id="stateName"
                      {...form.register('stateName')}
                      placeholder="Maharashtra"
                    />
                  </div>
                </div>

                {/* GST Type and Status - Two columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gstType">GST Type</Label>
                    <Input
                      id="gstType"
                      {...form.register('gstType')}
                      placeholder="Regular"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gstStatus">GST Status</Label>
                    <Input
                      id="gstStatus"
                      {...form.register('gstStatus')}
                      placeholder="Active"
                    />
                  </div>
                </div>

                {/* Turnover Range and HSN Code - Two columns */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="turnoverRange">Turnover Range</Label>
                    <Input
                      id="turnoverRange"
                      {...form.register('turnoverRange')}
                      placeholder="Above 5 Crores"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="hsnCode">HSN Code</Label>
                    <Input
                      id="hsnCode"
                      {...form.register('hsnCode')}
                      placeholder="9801"
                    />
                  </div>
                </div>

                {/* Tax Rate */}
                <div className="space-y-2">
                  <Label htmlFor="taxRate">Tax Rate (%)</Label>
                  <Input
                    id="taxRate"
                    type="number"
                    step="0.01"
                    min="0"
                    max="100"
                    {...form.register('taxRate', { valueAsNumber: true })}
                    placeholder="18"
                  />
                  {form.formState.errors.taxRate && (
                    <p className="text-sm text-red-500">
                      {form.formState.errors.taxRate.message}
                    </p>
                  )}
                </div>

                {/* GST Flags - Checkboxes */}
                <div className="space-y-3">
                  <Label>Additional GST Information</Label>
                  
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isCompositionDealer"
                      checked={form.watch('isCompositionDealer')}
                      onCheckedChange={(checked) =>
                        form.setValue('isCompositionDealer', checked as boolean)
                      }
                    />
                    <Label htmlFor="isCompositionDealer" className="font-normal cursor-pointer">
                      Composition Dealer
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isECommerce"
                      checked={form.watch('isECommerce')}
                      onCheckedChange={(checked) =>
                        form.setValue('isECommerce', checked as boolean)
                      }
                    />
                    <Label htmlFor="isECommerce" className="font-normal cursor-pointer">
                      E-Commerce Operator
                    </Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="isReverseCharge"
                      checked={form.watch('isReverseCharge')}
                      onCheckedChange={(checked) =>
                        form.setValue('isReverseCharge', checked as boolean)
                      }
                    />
                    <Label htmlFor="isReverseCharge" className="font-normal cursor-pointer">
                      Reverse Charge Applicable
                    </Label>
                  </div>
                </div>
              </div>
            )}

            {/* ============================================ */}
            {/* GST EXEMPTION REASON */}
            {/* Show only if isGSTRegistered is FALSE */}
            {/* ============================================ */}
            
            {!isGSTRegistered && (
              <div className="space-y-2">
                <Label htmlFor="gstExemptionReason">GST Exemption Reason (Optional)</Label>
                <Textarea
                  id="gstExemptionReason"
                  {...form.register('gstExemptionReason')}
                  placeholder="Explain why this supplier is not GST registered..."
                  rows={3}
                />
                {form.formState.errors.gstExemptionReason && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.gstExemptionReason.message}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ============================================ */}
          {/* FORM ACTIONS */}
          {/* ============================================ */}
          
          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending && (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              )}
              Create Supplier
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}