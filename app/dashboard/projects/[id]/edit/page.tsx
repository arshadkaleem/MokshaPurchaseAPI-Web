'use client';

import { useParams, useRouter } from 'next/navigation';
import { useProject } from '@/lib/hooks/useProjects';
import { EditProjectForm } from '@/components/forms/edit-project-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { AlertCircle, ArrowLeft } from 'lucide-react';

/**
 * Edit Project Page
 * 
 * C# equivalent: Edit action in ProjectsController
 * 
 * Route: /dashboard/projects/[id]/edit
 * Example: /dashboard/projects/1/edit
 * 
 * Like:
 * [HttpGet]
 * public async Task<IActionResult> Edit(int id)
 * {
 *     var project = await _service.GetByIdAsync(id);
 *     if (project == null) return NotFound();
 *     return View(project);
 * }
 */

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();
  
  // Get the project ID from URL parameter
  // C# equivalent: int id parameter in action method
  const projectId = parseInt(params.id as string);

  // Fetch the project data
  // C# equivalent: await _service.GetByIdAsync(id)
  const { data, isLoading, error } = useProject(projectId);

  /**
   * Navigate back to projects list
   * C# equivalent: return RedirectToAction("Index")
   */
  const handleBack = () => {
    router.push('/dashboard/projects');
  };

  /**
   * Handle successful update
   */
  const handleSuccess = () => {
    router.push('/dashboard/projects');
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="container mx-auto py-6">
        <div className="mb-6">
          <Skeleton className="h-8 w-64 mb-2" />
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
            Failed to load project. The project may not exist.
          </AlertDescription>
        </Alert>
        <Button onClick={handleBack} className="mt-4" variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
      </div>
    );
  }

  // Success - show the form
  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6">
        <Button
          onClick={handleBack}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Projects
        </Button>
        <h1 className="text-3xl font-bold">Edit Project</h1>
        <p className="text-muted-foreground">
          Update project details for {data.data.projectName}
        </p>
      </div>

      {/* Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <EditProjectForm
            projectId={projectId}
            initialData={data.data}
            onSuccess={handleSuccess}
          />
        </CardContent>
      </Card>
    </div>
  );
}