'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useUpdateMaterial } from '@/lib/hooks/useMaterials';
import { 
  materialSchema, 
  type MaterialFormData,
  convertMaterialToFormData 
} from '@/lib/validations/material-schema';
import type { MaterialResponse } from '@/types/materials.types';
import { COMMON_UNITS } from '@/types/materials.types';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils/utils';

/**
 * Edit Material Form
 * 
 * C# equivalent: Edit view with pre-populated form
 */

interface EditMaterialFormProps {
  materialId: number;
  initialData: MaterialResponse;
  onSuccess?: () => void;
}

export function EditMaterialForm({ 
  materialId, 
  initialData, 
  onSuccess 
}: EditMaterialFormProps) {
  // ============================================
  // STATE
  // ============================================
  
  const [unitPickerOpen, setUnitPickerOpen] = useState(false);

  // ============================================
  // FORM SETUP
  // ============================================

  /**
   * React Hook Form setup with pre-filled data
   */
  const form = useForm<MaterialFormData>({
    resolver: zodResolver(materialSchema),
    defaultValues: convertMaterialToFormData(initialData),
  });

  // ============================================
  // MUTATIONS
  // ============================================

  const updateMutation = useUpdateMaterial();

  // ============================================
  // HANDLERS
  // ============================================

  /**
   * Form submit handler
   */
  const onSubmit = async (data: MaterialFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: materialId,
        data: data,
      });
      
      // Call parent callback if provided
      onSuccess?.();
    } catch (error) {
      console.error('Update material error:', error);
    }
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* Material Name - Required */}
      <div className="space-y-2">
        <Label htmlFor="materialName">
          Material Name <span className="text-red-500">*</span>
        </Label>
        <Input
          id="materialName"
          {...form.register('materialName')}
          placeholder="e.g., Cement, Steel Rods, Sand"
        />
        {form.formState.errors.materialName && (
          <p className="text-sm text-red-500">
            {form.formState.errors.materialName.message}
          </p>
        )}
      </div>

      {/* Description - Optional */}
      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          {...form.register('description')}
          placeholder="Enter material description (optional)"
          rows={3}
        />
        {form.formState.errors.description && (
          <p className="text-sm text-red-500">
            {form.formState.errors.description.message}
          </p>
        )}
      </div>

      {/* Unit of Measure - Required with Combobox */}
      <div className="space-y-2">
        <Label htmlFor="unitOfMeasure">
          Unit of Measure <span className="text-red-500">*</span>
        </Label>
        <Popover open={unitPickerOpen} onOpenChange={setUnitPickerOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={unitPickerOpen}
              className="w-full justify-between"
            >
              {form.watch('unitOfMeasure') || "Select or type unit..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-full p-0">
            <Command>
              <CommandInput 
                placeholder="Search or type custom unit..." 
                onValueChange={(value) => {
                  form.setValue('unitOfMeasure', value);
                }}
              />
              <CommandEmpty>Press Enter to use custom unit</CommandEmpty>
              <CommandGroup>
                {COMMON_UNITS.map((unit) => (
                  <CommandItem
                    key={unit}
                    value={unit}
                    onSelect={(currentValue) => {
                      form.setValue('unitOfMeasure', currentValue);
                      setUnitPickerOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        form.watch('unitOfMeasure') === unit
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {unit}
                  </CommandItem>
                ))}
              </CommandGroup>
            </Command>
          </PopoverContent>
        </Popover>
        {form.formState.errors.unitOfMeasure && (
          <p className="text-sm text-red-500">
            {form.formState.errors.unitOfMeasure.message}
          </p>
        )}
        <p className="text-xs text-muted-foreground">
          Select from common units or type your own
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex justify-end gap-3 pt-4">
        <Button type="submit" disabled={updateMutation.isPending}>
          {updateMutation.isPending && (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          )}
          Update Material
        </Button>
      </div>
    </form>
  );
}