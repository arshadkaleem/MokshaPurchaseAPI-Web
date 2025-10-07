'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  FolderKanban,
  Users,
  ShoppingCart,
  FileText,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

/**
 * Dashboard Home Page
 * Shows overview statistics and key metrics
 * 
 * C# equivalent: Dashboard/Index action
 * 
 * public async Task<IActionResult> Index()
 * {
 *     var stats = await _service.GetDashboardStatsAsync();
 *     return View(stats);
 * }
 */

export default function DashboardPage() {
  // TODO: Fetch real stats from API
  // For now, using mock data
  const isLoading = false;

  const stats = [
    {
      title: 'Total Projects',
      value: '24',
      change: '+2 this month',
      icon: FolderKanban,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Active Suppliers',
      value: '156',
      change: '+12 new',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Purchase Orders',
      value: '89',
      change: '+5 pending',
      icon: ShoppingCart,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Pending Invoices',
      value: '12',
      change: '₹45.2L outstanding',
      icon: FileText,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  const recentActivity = [
    {
      title: 'New Project Created',
      description: 'Mumbai Bridge Project',
      time: '2 hours ago',
      icon: FolderKanban,
    },
    {
      title: 'PO Approved',
      description: 'PO-2024-089 for ₹12.5L',
      time: '4 hours ago',
      icon: ShoppingCart,
    },
    {
      title: 'Invoice Paid',
      description: 'INV-2024-156 - ₹8.2L',
      time: '6 hours ago',
      icon: FileText,
    },
  ];

  const alerts = [
    {
      title: 'Low Stock Alert',
      description: '5 materials below reorder threshold',
      type: 'warning',
    },
    {
      title: 'Pending Approvals',
      description: '3 purchase orders awaiting approval',
      type: 'info',
    },
  ];

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-4 w-96" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-4 w-24" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your purchase management system.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-gray-600 mt-1">
                  <TrendingUp className="inline h-3 w-3 mr-1" />
                  {stat.change}
                </p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Two Column Layout */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity, index) => {
                const Icon = activity.icon;
                return (
                  <div key={index} className="flex items-start gap-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      <Icon className="h-4 w-4 text-gray-600" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.title}</p>
                      <p className="text-xs text-gray-600">
                        {activity.description}
                      </p>
                      <p className="text-xs text-gray-400">{activity.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts & Notifications */}
        <Card>
          <CardHeader>
            <CardTitle>Alerts & Notifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert, index) => (
                <div
                  key={index}
                  className={`flex items-start gap-4 p-3 rounded-lg ${
                    alert.type === 'warning'
                      ? 'bg-orange-50 border border-orange-200'
                      : 'bg-blue-50 border border-blue-200'
                  }`}
                >
                  <AlertCircle
                    className={`h-5 w-5 ${
                      alert.type === 'warning'
                        ? 'text-orange-600'
                        : 'text-blue-600'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.title}</p>
                    <p className="text-xs text-gray-600 mt-1">
                      {alert.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            
              <a href="/dashboard/projects"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <FolderKanban className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">View Projects</p>
                <p className="text-xs text-gray-600">Manage all projects</p>
              </div>
            </a>
            
             <a  href="/dashboard/purchase-orders"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <ShoppingCart className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">Create PO</p>
                <p className="text-xs text-gray-600">New purchase order</p>
              </div>
            </a>
            
             <a  href="/dashboard/reports"
              className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 hover:border-primary hover:bg-gray-50 transition-colors"
            >
              <TrendingUp className="h-5 w-5 text-primary" />
              <div>
                <p className="font-medium text-sm">View Reports</p>
                <p className="text-xs text-gray-600">Analytics & insights</p>
              </div>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}