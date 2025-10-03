'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  FolderKanban,
  Users,
  ShoppingCart,
  FileText,
  TrendingUp,
  AlertCircle,
  Plus,
} from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  // Mock data - replace with real data from TanStack Query
  const stats = [
    {
      title: 'Active Projects',
      value: '12',
      icon: FolderKanban,
      trend: '+2 this month',
      href: '/dashboard/projects',
    },
    {
      title: 'Active Suppliers',
      value: '45',
      icon: Users,
      trend: '+5 this month',
      href: '/dashboard/suppliers',
    },
    {
      title: 'Pending Orders',
      value: '8',
      icon: ShoppingCart,
      trend: '3 need approval',
      href: '/dashboard/purchase-orders',
    },
    {
      title: 'Pending Invoices',
      value: '23',
      icon: FileText,
      trend: '₹2.5L outstanding',
      href: '/dashboard/invoices',
    },
  ];

  const recentActivity = [
    {
      title: 'PO #1234 Approved',
      description: 'Highway Construction - ABC Suppliers',
      time: '2 hours ago',
      type: 'success',
    },
    {
      title: 'Invoice Overdue',
      description: 'INV-5678 - Payment pending since 5 days',
      time: '3 hours ago',
      type: 'warning',
    },
    {
      title: 'New Material Added',
      description: 'Cement - 50kg bags',
      time: '5 hours ago',
      type: 'info',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Welcome back, {user?.userName?.split(' ')[0]}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.trend}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Recent Activity</span>
              <Button variant="ghost" size="sm">View All</Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div
                  className={`mt-1 h-2 w-2 rounded-full ${
                    activity.type === 'success'
                      ? 'bg-green-500'
                      : activity.type === 'warning'
                      ? 'bg-yellow-500'
                      : 'bg-blue-500'
                  }`}
                />
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{activity.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {activity.description}
                  </p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3">
            <Link href="/dashboard/projects/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
            </Link>
            <Link href="/dashboard/purchase-orders/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Create Purchase Order
              </Button>
            </Link>
            <Link href="/dashboard/suppliers/new">
              <Button className="w-full justify-start" variant="outline">
                <Plus className="mr-2 h-4 w-4" />
                Add New Supplier
              </Button>
            </Link>
            <Link href="/dashboard/reports">
              <Button className="w-full justify-start" variant="outline">
                <TrendingUp className="mr-2 h-4 w-4" />
                View Reports
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Pending Approvals Alert (Role-based) */}
      {(user?.role === 'Admin' || user?.role === 'Manager') && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="flex items-start gap-3 p-4">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-yellow-900">
                Pending Approvals
              </h3>
              <p className="text-sm text-yellow-800 mt-1">
                You have 3 purchase orders waiting for your approval.
              </p>
              <Link href="/dashboard/purchase-orders?status=Pending">
                <Button variant="outline" size="sm" className="mt-3">
                  Review Now
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}