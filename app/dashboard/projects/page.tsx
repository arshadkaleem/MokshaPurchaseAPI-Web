'use client';

import { useState } from 'react';
import { useProjects, useDeleteProject } from '@/hooks/useProjects';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Plus, Edit, Trash2 } from 'lucide-react';

export default function ProjectsPage() {
  const [status, setStatus] = useState<string | undefined>();
  const [page, setPage] = useState(1);

  // TanStack Query hook
  const { data, isLoading, error } = useProjects({ status, page });
  const deleteMutation = useDeleteProject();

  // 🔍 DEBUG: Log everything
  console.log('=== PROJECTS PAGE DEBUG ===');
  console.log('1. isLoading:', isLoading);
  console.log('2. error:', error);
  console.log('3. data (full object):', data);
  console.log('4. data structure:', {
    hasData: !!data,
    dataKeys: data ? Object.keys(data) : 'no data',
    dataType: typeof data,
  });
  
  if (data) {
    console.log('5. data.data (projects array):', data.data);
    console.log('6. data.data type:', Array.isArray(data.data) ? 'array' : typeof data.data);
    console.log('7. data.data length:', data.data?.length);
    console.log('8. First project:', data.data?.[0]);
    console.log('9. data.pagination:', data.pagination);
  }
  console.log('===========================');

  // Loading state
  if (isLoading) {
    return (
      <div className="p-6">
        <p>Loading projects...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <p className="text-red-600">Error: {error.message}</p>
      </div>
    );
  }

  // No data
  if (!data) {
    return (
      <div className="p-6">
        <p>No data returned from API</p>
      </div>
    );
  }

  // Handle delete
  const handleDelete = (id: number) => {
    if (confirm('Are you sure?')) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Link href="/dashboard/projects/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Project
          </Button>
        </Link>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <Button
          variant={status === undefined ? 'default' : 'outline'}
          onClick={() => setStatus(undefined)}
        >
          All
        </Button>
        <Button
          variant={status === 'Planned' ? 'default' : 'outline'}
          onClick={() => setStatus('Planned')}
        >
          Planned
        </Button>
        <Button
          variant={status === 'In Progress' ? 'default' : 'outline'}
          onClick={() => setStatus('In Progress')}
        >
          In Progress
        </Button>
      </div>

      {/* 🔍 DEBUG: Show raw data structure */}
      <Card className="p-4 bg-yellow-50">
        <p className="font-mono text-xs">
          <strong>DEBUG INFO:</strong><br/>
          Has data: {data ? 'YES' : 'NO'}<br/>
          data.data exists: {data?.data ? 'YES' : 'NO'}<br/>
          data.data is array: {Array.isArray(data?.data) ? 'YES' : 'NO'}<br/>
          data.data length: {data?.data?.length ?? 'N/A'}<br/>
          <br/>
          Full data structure:<br/>
          <pre className="mt-2 overflow-auto max-h-40">
            {JSON.stringify(data, null, 2)}
          </pre>
        </p>
      </Card>

      {/* Projects Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">
          Projects List (Count: {data?.data?.length ?? 0})
        </h2>

        {/* Check if data.data exists and is an array */}
        {data?.data && Array.isArray(data.data) && data.data.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {data.data.map((project, index) => {
              console.log(`Rendering project ${index}:`, project);
              
              return (
                <Card key={project.projectId} className="p-6">
                  <div className="mb-4">
                    <h3 className="font-semibold text-lg">
                      {project.projectName || 'Unnamed Project'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {project.projectType || 'No type'}
                    </p>
                    <Badge className="mt-2">
                      {project.status || 'No status'}
                    </Badge>
                  </div>

                  {project.budget && (
                    <p className="text-sm mb-4">
                      Budget: ₹{project.budget.toLocaleString()}
                    </p>
                  )}

                  <div className="flex gap-2">
                    <Link href={`/dashboard/projects/${project.projectId}`} className="flex-1">
                      <Button size="sm" variant="outline" className="w-full">
                        <Edit className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(project.projectId)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <p className="text-gray-600 mb-2">No projects found</p>
            <p className="text-sm text-gray-500">
              Debug: data?.data is {!data?.data ? 'undefined' : !Array.isArray(data.data) ? 'not an array' : 'empty array'}
            </p>
            <Link href="/dashboard/projects/new">
              <Button className="mt-4">
                <Plus className="mr-2 h-4 w-4" />
                Create First Project
              </Button>
            </Link>
          </Card>
        )}
      </div>

      {/* Pagination */}
      {data?.pagination && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Showing {data.data?.length ?? 0} of {data.pagination.totalRecords} projects
          </p>
          <div className="flex gap-2">
            <Button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={!data.pagination.hasPreviousPage}
              variant="outline"
            >
              Previous
            </Button>
            <span className="px-4 py-2">
              Page {data.pagination.page} of {data.pagination.totalPages}
            </span>
            <Button
              onClick={() => setPage((p) => p + 1)}
              disabled={!data.pagination.hasNextPage}
              variant="outline"
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}