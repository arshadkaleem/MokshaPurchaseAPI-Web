'use client';

import { useState } from 'react';
import { useDashboard } from '@/lib/hooks/useDashboard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  ShoppingCart,
  DollarSign,
  Clock,
  FolderKanban,
  TrendingUp,
  AlertTriangle,
  FileText,
  CheckCircle,
  XCircle,
  Package,
  Truck,
  FileEdit,
} from 'lucide-react';
import Link from 'next/link';

/**
 * Main Dashboard Page
 *
 * Displays key metrics, recent purchase orders, top projects, and items needing attention
 * Based on /api/v1/Dashboard endpoint
 */
export default function DashboardPage() {
  const [period, setPeriod] = useState<'month' | 'year'>('month');
  const { data: dashboard, isLoading, error, isError } = useDashboard(period);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32" />
          ))}
        </div>
        <div className="grid gap-4 md:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <Skeleton key={i} className="h-96" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Failed to load dashboard data: {error instanceof Error ? error.message : JSON.stringify(error)}
        </AlertDescription>
      </Alert>
    );
  }

  // No data
  if (!dashboard) {
    return (
      <Alert>
        <AlertDescription>No dashboard data available</AlertDescription>
      </Alert>
    );
  }

  const { metrics, recentPurchaseOrders, topProjectsBySpending, attentionItems } = dashboard;

  // Helper function to format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
    }).format(amount);
  };

  // Helper function to format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  // Helper function to get status color
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'draft':
        return 'bg-gray-500';
      case 'pending':
        return 'bg-yellow-500';
      case 'approved':
        return 'bg-green-500';
      case 'shipped':
        return 'bg-blue-500';
      case 'received':
        return 'bg-purple-500';
      case 'cancelled':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            Overview of your purchase management system
          </p>
        </div>
        <Tabs value={period} onValueChange={(v) => setPeriod(v as 'month' | 'year')}>
          <TabsList>
            <TabsTrigger value="month">This Month</TabsTrigger>
            <TabsTrigger value="year">This Year</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Purchase Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Purchase Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.totalPurchaseOrders}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {period === 'month' ? 'This month' : 'This year'}
            </p>
          </CardContent>
        </Card>

        {/* Total Spending */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Spending</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(metrics.totalSpending)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              {metrics.spendingPeriod}
            </p>
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Approvals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.pendingApprovalsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Awaiting approval
            </p>
          </CardContent>
        </Card>

        {/* Active Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{metrics.activeProjectsCount}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Currently active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Status Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Purchase Order Status Breakdown</CardTitle>
          <CardDescription>Overview of PO statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <div className="flex flex-col items-center space-y-2">
              <FileEdit className="h-8 w-8 text-gray-500" />
              <div className="text-2xl font-bold">{metrics.statusBreakdown.draft}</div>
              <div className="text-sm text-muted-foreground">Draft</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Clock className="h-8 w-8 text-yellow-500" />
              <div className="text-2xl font-bold">{metrics.statusBreakdown.pending}</div>
              <div className="text-sm text-muted-foreground">Pending</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <CheckCircle className="h-8 w-8 text-green-500" />
              <div className="text-2xl font-bold">{metrics.statusBreakdown.approved}</div>
              <div className="text-sm text-muted-foreground">Approved</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Truck className="h-8 w-8 text-blue-500" />
              <div className="text-2xl font-bold">{metrics.statusBreakdown.shipped}</div>
              <div className="text-sm text-muted-foreground">Shipped</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <Package className="h-8 w-8 text-purple-500" />
              <div className="text-2xl font-bold">{metrics.statusBreakdown.received}</div>
              <div className="text-sm text-muted-foreground">Received</div>
            </div>
            <div className="flex flex-col items-center space-y-2">
              <XCircle className="h-8 w-8 text-red-500" />
              <div className="text-2xl font-bold">{metrics.statusBreakdown.cancelled}</div>
              <div className="text-sm text-muted-foreground">Cancelled</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Two Column Layout for Recent Orders and Top Projects */}
      <div className="grid gap-4 md:grid-cols-2">
        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Purchase Orders</CardTitle>
              <CardDescription>Latest purchase orders in the system</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/purchase-orders">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPurchaseOrders && recentPurchaseOrders.length > 0 ? (
                recentPurchaseOrders.map((po) => (
                  <div
                    key={po.purchaseOrderID}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/purchase-orders/${po.purchaseOrderID}/edit`}
                          className="font-medium hover:underline"
                        >
                          {po.purchaseOrderNumber}
                        </Link>
                        <Badge className={getStatusColor(po.status)} variant="secondary">
                          {po.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {po.supplierName} " {po.projectName}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {formatDate(po.orderDate)}
                      </p>
                    </div>
                    <div className="text-right font-semibold">
                      {formatCurrency(po.totalAmount)}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No recent purchase orders
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Projects by Spending */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Top Projects by Spending</CardTitle>
              <CardDescription>Projects with highest spending</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/dashboard/projects">View All</Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topProjectsBySpending && topProjectsBySpending.length > 0 ? (
                topProjectsBySpending.map((project, index) => (
                  <div
                    key={project.projectID}
                    className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                  >
                    <div className="space-y-1 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {index + 1}
                        </span>
                        <Link
                          href={`/dashboard/projects/${project.projectID}/edit`}
                          className="font-medium hover:underline"
                        >
                          {project.projectName}
                        </Link>
                      </div>
                      <p className="text-sm text-muted-foreground ml-8">
                        {project.projectType} " {project.purchaseOrderCount} PO
                        {project.purchaseOrderCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(project.totalSpent)}</div>
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <TrendingUp className="h-3 w-3" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No project spending data
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Items Needing Attention */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <CardTitle>Items Needing Attention</CardTitle>
          </div>
          <CardDescription>Purchase orders and invoices that require action</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="approvals" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="approvals">
                Pending Approvals ({attentionItems.pendingApprovalsCount})
              </TabsTrigger>
              <TabsTrigger value="drafts">
                Draft POs ({attentionItems.draftPurchaseOrdersCount})
              </TabsTrigger>
              <TabsTrigger value="invoices">
                Unpaid Invoices ({attentionItems.unpaidInvoicesCount})
              </TabsTrigger>
            </TabsList>

            {/* Pending Approvals Tab */}
            <TabsContent value="approvals" className="space-y-3">
              {attentionItems.pendingApprovals && attentionItems.pendingApprovals.length > 0 ? (
                attentionItems.pendingApprovals.map((item) => (
                  <div
                    key={item.purchaseOrderID}
                    className="flex items-center justify-between border p-3 rounded-lg"
                  >
                    <div className="space-y-1">
                      <Link
                        href={`/dashboard/purchase-orders/${item.purchaseOrderID}/edit`}
                        className="font-medium hover:underline"
                      >
                        {item.purchaseOrderNumber}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.supplierName}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDate(item.createdDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.totalAmount)}</div>
                      <Button size="sm" className="mt-2" asChild>
                        <Link href={`/dashboard/purchase-orders/${item.purchaseOrderID}/edit`}>
                          Review
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No pending approvals
                </p>
              )}
            </TabsContent>

            {/* Draft POs Tab */}
            <TabsContent value="drafts" className="space-y-3">
              {attentionItems.draftPurchaseOrders && attentionItems.draftPurchaseOrders.length > 0 ? (
                attentionItems.draftPurchaseOrders.map((item) => (
                  <div
                    key={item.purchaseOrderID}
                    className="flex items-center justify-between border p-3 rounded-lg"
                  >
                    <div className="space-y-1">
                      <Link
                        href={`/dashboard/purchase-orders/${item.purchaseOrderID}/edit`}
                        className="font-medium hover:underline"
                      >
                        {item.purchaseOrderNumber}
                      </Link>
                      <p className="text-sm text-muted-foreground">{item.supplierName}</p>
                      <p className="text-xs text-muted-foreground">
                        Created: {formatDate(item.createdDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.totalAmount)}</div>
                      <Button size="sm" variant="outline" className="mt-2" asChild>
                        <Link href={`/dashboard/purchase-orders/${item.purchaseOrderID}/edit`}>
                          Continue Editing
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No draft purchase orders
                </p>
              )}
            </TabsContent>

            {/* Unpaid Invoices Tab */}
            <TabsContent value="invoices" className="space-y-3">
              {attentionItems.unpaidInvoices && attentionItems.unpaidInvoices.length > 0 ? (
                attentionItems.unpaidInvoices.map((item) => (
                  <div
                    key={item.invoiceID}
                    className="flex items-center justify-between border p-3 rounded-lg"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/dashboard/invoices/${item.invoiceID}/edit`}
                          className="font-medium hover:underline"
                        >
                          {item.invoiceNumber}
                        </Link>
                        {item.daysOverdue > 0 && (
                          <Badge variant="destructive" className="text-xs">
                            {item.daysOverdue} days overdue
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{item.supplierName}</p>
                      <p className="text-xs text-muted-foreground">
                        Due: {formatDate(item.dueDate)}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold">{formatCurrency(item.totalAmount)}</div>
                      <Button size="sm" className="mt-2" asChild>
                        <Link href={`/dashboard/payments/new?invoiceId=${item.invoiceID}`}>
                          Pay Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No unpaid invoices
                </p>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
