'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import { useCreatePurchaseOrder } from '@/lib/hooks/usePurchaseOrders';
import { useProjects } from '@/lib/hooks/useProjects';
import { useSuppliers } from '@/lib/hooks/useSuppliers';
import { useMaterials } from '@/lib/hooks/useMaterials';
import {
  purchaseOrderSchema,
  type PurchaseOrderFormData,
  calculateLineTotal,
  calculateTotalAmount,
  formatCurrency,
} from '@/lib/validations/purchase-order-schema';
import { cn } from '@/lib/utils/utils';

/**
 * Create Purchase Order Form Component
 *
 * C# equivalent: Create view with:
 * - Master-detail form (PO + Line Items)
 * - Dynamic row management (like DataGridView)
 * - Dropdowns populated from database
 * - Auto-calculation of totals
 */

interface CreatePurchaseOrderFormProps {
  onSuccess?: () => void;
}

export function CreatePurchaseOrderForm({
  onSuccess,
}: CreatePurchaseOrderFormProps) {
  const [open, setOpen] = useState(false);

  // ============================================
  // DATA FETCHING - Populate Dropdowns
  // ============================================

  // Fetch active projects for dropdown
  const { data: projectsData } = useProjects({ status: 'In Progress' });
  const projects = projectsData?.data || [];

  // Fetch suppliers for dropdown
  const { data: suppliersData } = useSuppliers();
  const suppliers = suppliersData?.data || [];

  // Fetch materials for line items dropdown
  const { data: materialsData } = useMaterials();
  const materials = materialsData?.data || [];

  // ============================================
  // FORM SETUP
  // ============================================

  const form = useForm<PurchaseOrderFormData>({
    resolver: zodResolver(purchaseOrderSchema),
    defaultValues: {
      projectId: 0,
      supplierId: 0,
      orderDate: format(new Date(), 'yyyy-MM-dd'), // Today's date
      status: 'Received', // Default status as per your requirement
      items: [
        // Start with one empty row
        {
          materialId: 0,
          quantity: 0,
          unitPrice: 0,
        },
      ],
    },
  });

  /**
   * useFieldArray - Manages dynamic array of line items
   *
   * C# equivalent: List<PurchaseOrderItem> in your model
   *
   * This gives us:
   * - fields: Array of line items
   * - append: Add new row (like list.Add())
   * - remove: Delete row (like list.RemoveAt())
   */
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'items',
  });

  // Get mutation hook
  const createMutation = useCreatePurchaseOrder();

  // Watch all items to calculate totals
  const watchItems = form.watch('items');

  // ============================================
  // CALCULATED VALUES
  // ============================================

  /**
   * Calculate total amount in real-time
   * Updates as user types quantities/prices
   */
  const totalAmount = calculateTotalAmount(watchItems);

  // ============================================
  // EVENT HANDLERS
  // ============================================

  /**
   * Add new line item row
   * Like clicking "Add Row" button in DataGridView
   */
  const handleAddItem = () => {
    append({
      materialId: 0,
      quantity: 0,
      unitPrice: 0,
    });
  };

  /**
   * Remove line item row
   * Like clicking "Delete Row" button in DataGridView
   */
  const handleRemoveItem = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    } else {
      // Don't allow removing the last row
      form.setError('items', {
        message: 'At least one item is required',
      });
    }
  };

  /**
   * Form submit handler
   */
  const onSubmit = async (data: PurchaseOrderFormData) => {
    try {
      await createMutation.mutateAsync(data);

      // Success - close dialog and reset form
      setOpen(false);
      form.reset();

      // Call optional callback
      onSuccess?.();
    } catch (error) {
      console.error('Failed to create purchase order:', error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* Trigger Button */}
      <DialogTrigger asChild>
        <Button>Create Purchase Order</Button>
      </DialogTrigger>

      {/* Dialog Content */}
      <DialogContent className="max-h-[90vh] max-w-6xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Purchase Order</DialogTitle>
          <DialogDescription>
            Add a new purchase order with materials and quantities.
          </DialogDescription>
        </DialogHeader>

        {/* Form */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* ============================================ */}
            {/* BASIC INFORMATION SECTION */}
            {/* ============================================ */}

            <div className="grid grid-cols-2 gap-4">
              {/* Project Dropdown */}
              <FormField
                control={form.control}
                name="projectId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Project <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select project" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {projects.map((project) => (
                          <SelectItem
                            key={project.projectId}
                            value={project.projectId.toString()}
                          >
                            {project.projectName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Supplier Dropdown */}
              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Supplier <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value?.toString()}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map((supplier) => (
                          <SelectItem
                            key={supplier.supplierId}
                            value={supplier.supplierId.toString()}
                          >
                            {supplier.supplierName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              {/* Order Date */}
              <FormField
                control={form.control}
                name="orderDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>
                      Order Date <span className="text-destructive">*</span>
                    </FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              'w-full pl-3 text-left font-normal',
                              !field.value && 'text-muted-foreground'
                            )}
                          >
                            {field.value ? (
                              format(new Date(field.value), 'PPP')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            field.onChange(
                              date ? format(date, 'yyyy-MM-dd') : ''
                            );
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Status */}
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Status <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Draft">Draft</SelectItem>
                        <SelectItem value="Pending">Pending</SelectItem>
                        <SelectItem value="Approved">Approved</SelectItem>
                        <SelectItem value="Shipped">Shipped</SelectItem>
                        <SelectItem value="Received">Received</SelectItem>
                        {/* <SelectItem value="Completed">Completed</SelectItem> */}
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* ============================================ */}
            {/* LINE ITEMS SECTION (Dynamic Table) */}
            {/* ============================================ */}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <FormLabel>
                  Line Items <span className="text-destructive">*</span>
                </FormLabel>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddItem}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {/* Show array-level error */}
              {form.formState.errors.items?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.items.message}
                </p>
              )}

              {/* Line Items Table */}
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-[40%]">Material</TableHead>
                      <TableHead className="w-[15%]">Quantity</TableHead>
                      <TableHead className="w-[20%]">Unit Price (₹)</TableHead>
                      <TableHead className="w-[20%]">Line Total (₹)</TableHead>
                      <TableHead className="w-[5%]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {fields.map((field, index) => {
                      const item = watchItems[index];
                      const lineTotal = calculateLineTotal(
                        item?.quantity || 0,
                        item?.unitPrice || 0
                      );

                      return (
                        <TableRow key={field.id}>
                          {/* Material Dropdown */}
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.materialId`}
                              render={({ field }) => (
                                <FormItem>
                                  <Select
                                    onValueChange={(value) =>
                                      field.onChange(parseInt(value))
                                    }
                                    value={field.value?.toString()}
                                  >
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select material" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {materials.map((material) => (
                                        <SelectItem
                                          key={material.materialId}
                                          value={material.materialId.toString()}
                                        >
                                          {material.materialName}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          {/* Quantity */}
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.quantity`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="0"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          {/* Unit Price */}
                          <TableCell>
                            <FormField
                              control={form.control}
                              name={`items.${index}.unitPrice`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="0.00"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(
                                          parseFloat(e.target.value) || 0
                                        )
                                      }
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </TableCell>

                          {/* Line Total (Read-only, Auto-calculated) */}
                          <TableCell>
                            <div className="font-medium">
                              {formatCurrency(lineTotal)}
                            </div>
                          </TableCell>

                          {/* Delete Button */}
                          <TableCell>
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(index)}
                              disabled={fields.length === 1}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>

              {/* Total Amount (Highlighted) */}
              <div className="flex items-center justify-end gap-4 rounded-md bg-muted p-4">
                <span className="text-lg font-semibold">Total Amount:</span>
                <span className="text-2xl font-bold text-primary">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </div>

            {/* Form Actions */}
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={createMutation.isPending}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending}>
                {createMutation.isPending
                  ? 'Creating...'
                  : 'Create Purchase Order'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
