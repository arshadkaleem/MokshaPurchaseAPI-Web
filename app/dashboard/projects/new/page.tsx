'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { useCreateProject } from '@/hooks/useProjects';
import { projectSchema } from '@/lib/validations/project-schema';
import { CreateProjectRequest } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function NewProjectPage() {
  const router = useRouter();
  const createMutation = useCreateProject();

  const form = useForm<CreateProjectRequest>({
    resolver: zodResolver(projectSchema),
  });

  const onSubmit = (data: CreateProjectRequest) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        router.push('/dashboard/projects');
      },
    });
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Create New Project</h1>

      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="projectName">Project Name</Label>
          <Input
            id="projectName"
            {...form.register('projectName')}
            disabled={createMutation.isPending}
          />
          {form.formState.errors.projectName && (
            <p className="text-sm text-red-500">
              {form.formState.errors.projectName.message}
            </p>
          )}
        </div>

        {/* Add other form fields similarly */}

        <div className="flex gap-2">
          <Button
            type="submit"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? 'Creating...' : 'Create Project'}
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}