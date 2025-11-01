'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, UserCog } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

/**
 * Users Management Page
 *
 * C# equivalent: UsersController.Index()
 *
 * [HttpGet]
 * public async Task<IActionResult> Index()
 * {
 *     var users = await _userService.GetAllUsersAsync();
 *     return View(users);
 * }
 */

// Placeholder data - replace with API call later
const mockUsers = [
  { id: 1, userName: 'johndoe', email: 'john@example.com', role: 'MANAGER' },
  { id: 2, userName: 'janedoe', email: 'jane@example.com', role: 'PROCUREMENT' },
  { id: 3, userName: 'bobsmith', email: 'bob@example.com', role: 'FINANCE' },
];

export default function UsersPage() {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter users based on search query
  const filteredUsers = mockUsers.filter(
    (user) =>
      user.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage system users and their roles
          </p>
        </div>
        <Link href="/dashboard/users/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add New User
          </Button>
        </Link>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Search Users</CardTitle>
          <CardDescription>
            Search by username, email, or role
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>System Users</CardTitle>
          <CardDescription>
            A list of all users in the system
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <UserCog className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-semibold">No users found</h3>
              <p className="text-muted-foreground mt-2">
                {searchQuery
                  ? 'Try adjusting your search query'
                  : 'Get started by adding a new user'}
              </p>
              {!searchQuery && (
                <Link href="/dashboard/users/new">
                  <Button className="mt-4">
                    <Plus className="mr-2 h-4 w-4" />
                    Add New User
                  </Button>
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.userName}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <Badge variant="secondary">{user.role}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                        <Button variant="ghost" size="sm" className="text-destructive">
                          Delete
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="text-blue-900">User Roles</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800">
          <ul className="list-disc list-inside space-y-1">
            <li><strong>AUDITOR</strong> - Access to audit and compliance features</li>
            <li><strong>INVENTORYMANAGER</strong> - Manage inventory and stock</li>
            <li><strong>PROCUREMENT</strong> - Handle procurement processes</li>
            <li><strong>COMPLIANCEOFFICER</strong> - Monitor compliance and regulations</li>
            <li><strong>MANAGER</strong> - General management access</li>
            <li><strong>PROJECTMANAGER</strong> - Manage projects and assignments</li>
            <li><strong>FINANCE</strong> - Access to financial data and reports</li>
            <li><strong>WAREHOUSESTAFF</strong> - Warehouse operations</li>
            <li><strong>PURCHASINGOFFICER</strong> - Create and manage purchase orders</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
