'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { registerSchema, type RegisterFormData, USER_ROLES } from '@/lib/validations/auth-schema';
import { authApi } from '@/lib/api/auth';
import Link from 'next/link';
import { ArrowLeft, UserPlus } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, CheckCircle2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

/**
 * New User Registration Page (Admin)
 *
 * C# equivalent: UsersController.Create()
 *
 * [HttpGet]
 * public IActionResult Create() => View();
 *
 * [HttpPost]
 * public async Task<IActionResult> Create(RegisterRequest model)
 */

export default function NewUserPage() {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const router = useRouter();

  // Initialize form
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      userName: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'PURCHASINGOFFICER',
    },
  });

  /**
   * Handle form submission
   * C# equivalent: POST Create action
   */
  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      setSuccess(null);

      // Call register API
      await authApi.register(data);

      // Show success message
      setSuccess(`User "${data.userName}" created successfully!`);

      // Reset form
      form.reset();

      // Redirect to users list after a short delay
      setTimeout(() => {
        router.push('/dashboard/users');
      }, 2000);
    } catch (err: any) {
      // Show error message
      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.title ||
        'Failed to create user. Please try again.';
      setError(errorMessage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link href="/dashboard/users">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Users
              </Button>
            </Link>
          </div>
          <h1 className="text-3xl font-bold tracking-tight mt-2">Create New User</h1>
          <p className="text-muted-foreground mt-1">
            Add a new user to the system with specific role
          </p>
        </div>
      </div>

      {/* Registration Form Card */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                User Information
              </CardTitle>
              <CardDescription>
                Fill in the details to create a new user account
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Error Alert */}
              {error && (
                <Alert variant="destructive" className="mb-6">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Success Alert */}
              {success && (
                <Alert className="mb-6 border-green-200 bg-green-50 text-green-800">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Register Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  {/* Username Field */}
                  <FormField
                    control={form.control}
                    name="userName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Username</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="e.g., johndoe"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          A unique username for the user
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email Address</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="user@example.com"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          The user's email address for login and notifications
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Role Field */}
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a role" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {USER_ROLES.map((role) => (
                              <SelectItem key={role} value={role}>
                                {role}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Assign a role that determines user permissions
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid gap-4 md:grid-cols-2">
                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Enter password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              placeholder="Confirm password"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Submit Button */}
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                    >
                      {form.formState.isSubmitting ? 'Creating User...' : 'Create User'}
                    </Button>
                    <Link href="/dashboard/users">
                      <Button type="button" variant="outline">
                        Cancel
                      </Button>
                    </Link>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Role Information Sidebar */}
        <div className="md:col-span-1">
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>User Roles</CardTitle>
              <CardDescription>
                Available roles and their descriptions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div>
                  <p className="font-semibold">AUDITOR</p>
                  <p className="text-muted-foreground">
                    Access to audit and compliance features
                  </p>
                </div>
                <div>
                  <p className="font-semibold">INVENTORYMANAGER</p>
                  <p className="text-muted-foreground">
                    Manage inventory and stock levels
                  </p>
                </div>
                <div>
                  <p className="font-semibold">PROCUREMENT</p>
                  <p className="text-muted-foreground">
                    Handle procurement processes
                  </p>
                </div>
                <div>
                  <p className="font-semibold">COMPLIANCEOFFICER</p>
                  <p className="text-muted-foreground">
                    Monitor compliance and regulations
                  </p>
                </div>
                <div>
                  <p className="font-semibold">MANAGER</p>
                  <p className="text-muted-foreground">
                    General management access
                  </p>
                </div>
                <div>
                  <p className="font-semibold">PROJECTMANAGER</p>
                  <p className="text-muted-foreground">
                    Manage projects and assignments
                  </p>
                </div>
                <div>
                  <p className="font-semibold">FINANCE</p>
                  <p className="text-muted-foreground">
                    Access to financial data and reports
                  </p>
                </div>
                <div>
                  <p className="font-semibold">WAREHOUSESTAFF</p>
                  <p className="text-muted-foreground">
                    Warehouse operations and management
                  </p>
                </div>
                <div>
                  <p className="font-semibold">PURCHASINGOFFICER</p>
                  <p className="text-muted-foreground">
                    Create and manage purchase orders
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
