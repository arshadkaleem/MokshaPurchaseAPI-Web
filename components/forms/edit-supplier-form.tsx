'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateSupplier } from '@/lib/hooks/useSuppliers';
import { 
  supplierSchema, 
  type SupplierFormData,
  convertSupplierToFormData 
} from '@/lib/validations/supplier-schema';
import type { SupplierResponse } from '@/types/suppliers.types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2 } from 'lucide-react';

/**
 * Edit Supplier Form
 * 
 * C# equivalent: Edit view with pre-populated form
 * 
 * Like:
 * @model UpdateSupplierRequest
 * @using (Html.BeginForm("Update", "Suppliers"))
 * {
 *     @Html.HiddenFor(m => m.Id)
 *     @Html.TextBoxFor(m => m.SupplierName, new { @Value = Model.SupplierName })
 *     // ... pre-filled fields
 * }
 */

interface EditSupplierFormProps {
  supplierId: number;
  initialData: SupplierResponse;
  onSuccess?: () => void;
}

export function EditSupplierForm({ 
  supplierId, 
  initialData, 
  onSuccess 
}: EditSupplierFormProps) {
  // ============================================
  // FORM SETUP
  // ============================================

  /**
   * React Hook Form setup with pre-filled data
   * 
   * C# equivalent: Passing model to view
   * return View(supplier);
   */
  const form = useForm<SupplierFormData>({
    resolver: zodResolver(supplierSchema),
    defaultValues: convertSupplierToFormData(initialData),
  });

  // Watch the isGSTRegistered field to show/hide GST fields
  const isGSTRegistered = form.watch('isGSTRegistered');

  // ============================================
  // MUTATIONS
  // ============================================

  const updateMutation = useUpdateSupplier();

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Form submit handler
   * 
   * C# equivalent:
   * [HttpPost]
   * public async Task<IActionResult> Update(int id, UpdateSupplierRequest model)
   * {
   *     if (!ModelState.IsValid)
   *         return View(model);
   *     
   *     await _service.UpdateAsync(id, model);
   *     return RedirectToAction("Index");
   * }
   */
  const onSubmit = async (data: SupplierFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: supplierId,
        data: data,
      });
      
      // Call parent callback if provided
      onSuccess?.();
    } catch (error) {
      // Error is handled by the mutation (shows toast)
      console.error('Update supplier error:', error);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
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
          type="submit"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update Supplier
        </Button>
      </div>
    </form>
  );
}