'use client';

import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon, ArrowLeft, TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { Alert, AlertDescription } from '@/components/ui/alert';

import { useCreateMovement } from '@/lib/hooks/useInventory';
import { useMaterials } from '@/lib/hooks/useMaterials';
import { useInventoryByMaterial } from '@/lib/hooks/useInventory';
import {
  createMovementSchema,
  type CreateMovementFormData,
  formatQuantity,
} from '@/lib/validations/inventory-schema';
import { MovementTypes } from '@/types/inventory.types';
import { cn } from '@/lib/utils/utils';

/**
 * Create Stock Movement Page
 *
 * C# equivalent: Create action in InventoryController
 * Route: /dashboard/inventory/movements/new
 */

export default function CreateMovementPage() {
  const router = useRouter();

  // ============================================
  // DATA FETCHING
  // ============================================

  const { data: materialsData } = useMaterials();
  const materials = materialsData?.data || [];

  // ============================================
  // FORM SETUP
  // ============================================

  const form = useForm<CreateMovementFormData>({
    resolver: zodResolver(createMovementSchema),
    defaultValues: {
      materialID: 0,
      movementType: 'In',
      quantity: 0,
      movementDate: format(new Date(), 'yyyy-MM-dd'),
      notes: null,
    },
  });

  const createMutation = useCreateMovement();

  // Watch the selected material to show its current stock
  const selectedMaterialId = form.watch('materialID');
  const { data: inventoryData } = useInventoryByMaterial(selectedMaterialId);
  const currentInventory = inventoryData?.data;

  const selectedMaterial = materials.find(
    (m) => m.materialId === selectedMaterialId
  );

  // ============================================
  // EVENT HANDLERS
  // ============================================

  const handleBack = () => {
    router.push('/dashboard/inventory');
  };

  const onSubmit = async (data: CreateMovementFormData) => {
    try {
      await createMutation.mutateAsync(data);
      router.push('/dashboard/inventory/movements');
    } catch (error) {
      console.error('Failed to create movement:', error);
    }
  };

  // ============================================
  // HELPER FUNCTIONS
  // ============================================

  const getMovementIcon = (type: string) => {
    switch (type) {
      case 'In':
        return <TrendingUp className="h-4 w-4" />;
      case 'Out':
        return <TrendingDown className="h-4 w-4" />;
      case 'Adjustment':
        return <RefreshCw className="h-4 w-4" />;
      default:
        return null;
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button onClick={handleBack} variant="ghost" className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Inventory
        </Button>
        <h1 className="text-3xl font-bold">Record Stock Movement</h1>
        <p className="text-muted-foreground">
          Add, remove, or adjust material stock quantities
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Movement Information Card */}
          <Card>
            <CardHeader>
              <CardTitle>Movement Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Material Selection */}
              <FormField
                control={form.control}
                name="materialID"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Material <span className="text-destructive">*</span>
                    </FormLabel>
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
                        {materials.length === 0 ? (
                          <div className="p-2 text-sm text-muted-foreground">
                            No materials available
                          </div>
                        ) : (
                          materials
                            .filter((material) => material.materialId) // Filter out any undefined IDs
                            .map((material) => (
                              <SelectItem
                                key={material.materialId}
                                value={material.materialId.toString()}
                              >
                                {material.materialName} ({material.unitOfMeasure})
                              </SelectItem>
                            ))
                        )}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the material for this stock movement
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Show Current Stock */}
              {selectedMaterial && (
                <Alert>
                  <AlertDescription>
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">Current Stock:</span>
                      <span className="text-lg font-bold">
                        {currentInventory
                          ? formatQuantity(
                              currentInventory.currentStock,
                              selectedMaterial.unitOfMeasure
                            )
                          : `0 ${selectedMaterial.unitOfMeasure}`}
                      </span>
                    </div>
                  </AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                {/* Movement Type */}
                <FormField
                  control={form.control}
                  name="movementType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Movement Type <span className="text-destructive">*</span>
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MovementTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              <div className="flex items-center gap-2">
                                {getMovementIcon(type)}
                                {type}
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        In = Add stock | Out = Remove stock | Adjustment = Correct stock
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Movement Date */}
                <FormField
                  control={form.control}
                  name="movementDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>
                        Movement Date <span className="text-destructive">*</span>
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
                            disabled={(date) => date > new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Cannot be a future date</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Quantity */}
              <FormField
                control={form.control}
                name="quantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Quantity{' '}
                      {selectedMaterial && `(${selectedMaterial.unitOfMeasure})`}{' '}
                      <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.01"
                        placeholder="0"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseFloat(e.target.value) || 0)
                        }
                      />
                    </FormControl>
                    <FormDescription>
                      Use positive values for In/Adjustment. Negative values for Out movements will be converted.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Notes */}
              <FormField
                control={form.control}
                name="notes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Optional notes about this movement..."
                        className="resize-none"
                        {...field}
                        value={field.value || ''}
                      />
                    </FormControl>
                    <FormDescription>
                      Add any relevant details (e.g., reason for adjustment, PO reference, etc.)
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Form Actions */}
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleBack}
              disabled={createMutation.isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Recording...' : 'Record Movement'}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
