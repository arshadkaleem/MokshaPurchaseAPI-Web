'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

import { useUpdateProject } from '@/lib/hooks/useProjects';
import { projectSchema, type ProjectFormData } from '@/lib/validations/project-schema';
import { cn } from '@/lib/utils/utils';
import type { ProjectResponse } from '@/types/projects.types';

/**
 * Edit Project Form Component
 * 
 * C# equivalent: Edit view with form bound to existing model
 * 
 * Like:
 * @model UpdateProjectRequest
 * @Html.HiddenFor(m => m.Id)
 * @Html.TextBoxFor(m => m.ProjectName)
 */

interface EditProjectFormProps {
  projectId: number;
  initialData: ProjectResponse;
  onSuccess?: () => void;
}

export function EditProjectForm({
  projectId,
  initialData,
  onSuccess,
}: EditProjectFormProps) {
  // Initialize form with existing data
  // C# equivalent: Model binding with existing entity
  const form = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      projectName: initialData.projectName,
      projectType: initialData.projectType as 'Government' | 'Private',
      status: initialData.status as any,
      description: initialData.description || '',
      startDate: initialData.startDate || null,
      endDate: initialData.endDate || null,
      budget: initialData.budget,
      complianceStatus: initialData.complianceStatus || '',
    },
  });

  /**
   * Reset form if initialData changes
   * This handles the case where user navigates to different edit page
   */
  useEffect(() => {
    form.reset({
      projectName: initialData.projectName,
      projectType: initialData.projectType as 'Government' | 'Private',
      status: initialData.status as any,
      description: initialData.description || '',
      startDate: initialData.startDate || null,
      endDate: initialData.endDate || null,
      budget: initialData.budget,
      complianceStatus: initialData.complianceStatus || '',
    });
  }, [initialData, form]);

  // Get the update mutation from our hook
  const updateMutation = useUpdateProject();

  /**
   * Form submit handler
   * C# equivalent: PUT action in controller
   * 
   * [HttpPost]
   * public async Task<IActionResult> Edit(int id, UpdateProjectRequest model)
   * {
   *     if (!ModelState.IsValid) return View(model);
   *     await _service.UpdateAsync(id, model);
   *     return RedirectToAction("Index");
   * }
   */
  const onSubmit = async (data: ProjectFormData) => {
    try {
      await updateMutation.mutateAsync({
        id: projectId,
        data: data,
      });

      // Call success callback
      onSuccess?.();
    } catch (error) {
      // Error is already handled by mutation (shows toast)
      console.error('Failed to update project:', error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Project Name */}
        <FormField
          control={form.control}
          name="projectName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Project Name <span className="text-destructive">*</span>
              </FormLabel>
              <FormControl>
                <Input placeholder="Enter project name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Project Type and Status - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Project Type */}
          <FormField
            control={form.control}
            name="projectType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Project Type <span className="text-destructive">*</span>
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
                    <SelectItem value="Government">Government</SelectItem>
                    <SelectItem value="Private">Private</SelectItem>
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Planned">Planned</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Description */}
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter project description"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Start Date and End Date - Side by Side */}
        <div className="grid grid-cols-2 gap-4">
          {/* Start Date */}
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start Date</FormLabel>
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : null);
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* End Date */}
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End Date</FormLabel>
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={(date) => {
                        field.onChange(date ? format(date, 'yyyy-MM-dd') : null);
                      }}
                      disabled={(date) => {
                        const startDate = form.getValues('startDate');
                        return startDate ? date < new Date(startDate) : false;
                      }}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Budget */}
        <FormField
          control={form.control}
          name="budget"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Budget (₹)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Enter budget amount"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? null : parseFloat(value));
                  }}
                />
              </FormControl>
              <FormDescription>
                Enter the project budget in Indian Rupees
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Compliance Status */}
        <FormField
          control={form.control}
          name="complianceStatus"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Compliance Status</FormLabel>
              <FormControl>
                <Input
                  placeholder="e.g., Approved, Pending"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Form Actions */}
        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? 'Updating...' : 'Update Project'}
          </Button>
        </div>
      </form>
    </Form>
  );
}