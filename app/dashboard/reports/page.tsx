'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BarChart3,
  TrendingUp,
  DollarSign,
  Package,
  Users,
  ShoppingCart,
  FileText,
  CreditCard,
  Download,
  AlertTriangle,
} from 'lucide-react';

import { useProjects } from '@/lib/hooks/useProjects';
import { useSuppliers } from '@/lib/hooks/useSuppliers';
import { useMaterials } from '@/lib/hooks/useMaterials';
import { usePurchaseOrders } from '@/lib/hooks/usePurchaseOrders';
import { useInvoices } from '@/lib/hooks/useInvoices';
import { usePayments } from '@/lib/hooks/usePayments';
import { useInventory } from '@/lib/hooks/useInventory';
import { formatCurrency } from '@/lib/validations/payment-schema';
import { getStockStatus } from '@/types/inventory.types';

/**
 * Reports & Analytics Dashboard
 *
 * C# equivalent: ReportsController Index action + Razor View
 * Aggregates data from all modules to provide business insights
 */

export default function ReportsPage() {
  // ============================================
  // DATA FETCHING
  // ============================================

  const { data: projectsData, isLoading: projectsLoading } = useProjects();
  const { data: suppliersData, isLoading: suppliersLoading } = useSuppliers();
  const { data: materialsData, isLoading: materialsLoading } = useMaterials();
  const { data: posData, isLoading: posLoading } = usePurchaseOrders();
  const { data: invoicesData, isLoading: invoicesLoading } = useInvoices();
  const { data: paymentsData, isLoading: paymentsLoading } = usePayments();
  const { data: inventoryData, isLoading: inventoryLoading } = useInventory();

  const isLoading =
    projectsLoading ||
    suppliersLoading ||
    materialsLoading ||
    posLoading ||
    invoicesLoading ||
    paymentsLoading ||
    inventoryLoading;

  // ============================================
  // CALCULATIONS
  // ============================================

  // Projects
  const totalProjects = projectsData?.data.length || 0;
  const activeProjects =
    projectsData?.data.filter((p) => p.status === 'Active').length || 0;

  // Suppliers
  const totalSuppliers = suppliersData?.data.length || 0;
  const gstSuppliers =
    suppliersData?.data.filter((s) => s.isGSTRegistered).length || 0;

  // Materials
  const totalMaterials = materialsData?.data.length || 0;

  // Purchase Orders
  const totalPOs = posData?.data.length || 0;
  const approvedPOs =
    posData?.data.filter((po) => po.status === 'Approved').length || 0;
  const totalPOValue =
    posData?.data.reduce((sum, po) => sum + po.totalAmount, 0) || 0;

  // Invoices
  const totalInvoices = invoicesData?.data.length || 0;
  const pendingInvoices =
    invoicesData?.data.filter((inv) => inv.status === 'Pending').length || 0;
  const totalInvoiceValue =
    invoicesData?.data.reduce((sum, inv) => sum + inv.totalAmount, 0) || 0;

  // Payments
  const totalPayments = paymentsData?.data.length || 0;
  const totalPaid =
    paymentsData?.data.reduce((sum, payment) => sum + payment.amount, 0) || 0;

  // Outstanding Amount
  const outstandingAmount = totalInvoiceValue - totalPaid;

  // Inventory
  const totalInventoryItems = inventoryData?.data.length || 0;
  const lowStockItems =
    inventoryData?.data.filter(
      (item) => item.currentStock < item.minimumStock
    ).length || 0;
  const totalInventoryValue =
    inventoryData?.data.reduce(
      (sum, item) => sum + item.currentStock * item.material.unitPrice,
      0
    ) || 0;

  // Top Suppliers by PO Value
  const supplierPOValues = posData?.data.reduce((acc, po) => {
    const supplier = po.supplierName || 'Unknown';
    acc[supplier] = (acc[supplier] || 0) + po.totalAmount;
    return acc;
  }, {} as Record<string, number>);

  const topSuppliers = Object.entries(supplierPOValues || {})
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className="container mx-auto py-6">
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">
            Business insights and performance metrics
          </p>
        </div>
        <Button variant="outline">
          <Download className="mr-2 h-4 w-4" />
          Export Report
        </Button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {/* Dashboard Content */}
      {!isLoading && (
        <>
          {/* Key Metrics Overview */}
          <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Purchase Value
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPOValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalPOs} purchase orders
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Outstanding Invoices
                </CardTitle>
                <AlertTriangle className="h-4 w-4 text-orange-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">
                  {formatCurrency(outstandingAmount)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {pendingInvoices} pending invoices
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Inventory Value
                </CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency(totalInventoryValue)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalInventoryItems} items in stock
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Paid
                </CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalPaid)}
                </div>
                <p className="text-xs text-muted-foreground">
                  {totalPayments} payments made
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Detailed Reports Tabs */}
          <Tabs defaultValue="overview" className="space-y-4">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="procurement">Procurement</TabsTrigger>
              <TabsTrigger value="suppliers">Suppliers</TabsTrigger>
              <TabsTrigger value="inventory">Inventory</TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {/* System Statistics */}
                <Card>
                  <CardHeader>
                    <CardTitle>System Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
                          <span>Active Projects</span>
                        </div>
                        <Badge variant="secondary">
                          {activeProjects} / {totalProjects}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <span>Total Suppliers</span>
                        </div>
                        <Badge variant="secondary">{totalSuppliers}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          <span>Materials Catalog</span>
                        </div>
                        <Badge variant="secondary">{totalMaterials}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="h-4 w-4 text-orange-500" />
                          <span>Low Stock Items</span>
                        </div>
                        <Badge variant="destructive">{lowStockItems}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Financial Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle>Financial Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Invoiced
                          </span>
                          <span className="font-medium">
                            {formatCurrency(totalInvoiceValue)}
                          </span>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            Total Paid
                          </span>
                          <span className="font-medium text-green-600">
                            {formatCurrency(totalPaid)}
                          </span>
                        </div>
                      </div>
                      <div className="border-t pt-2">
                        <div className="flex justify-between text-sm font-semibold">
                          <span>Outstanding</span>
                          <span className="text-orange-600">
                            {formatCurrency(outstandingAmount)}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Payment Rate:{' '}
                        {totalInvoiceValue > 0
                          ? Math.round((totalPaid / totalInvoiceValue) * 100)
                          : 0}
                        %
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Procurement Tab */}
            <TabsContent value="procurement" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Purchase Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total POs
                        </p>
                        <p className="text-2xl font-bold">{totalPOs}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Approved POs
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {approvedPOs}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Value
                        </p>
                        <p className="text-2xl font-bold">
                          {formatCurrency(totalPOValue)}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Invoice & Payment Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Invoices
                      </p>
                      <p className="text-2xl font-bold">{totalInvoices}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Pending Invoices
                      </p>
                      <p className="text-2xl font-bold text-orange-600">
                        {pendingInvoices}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Payments
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {totalPayments}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Suppliers Tab */}
            <TabsContent value="suppliers" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Top Suppliers by Purchase Value</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Supplier Name</TableHead>
                        <TableHead className="text-right">
                          Total Purchase Value
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {topSuppliers.length === 0 ? (
                        <TableRow>
                          <TableCell
                            colSpan={2}
                            className="text-center text-muted-foreground"
                          >
                            No supplier data available
                          </TableCell>
                        </TableRow>
                      ) : (
                        topSuppliers.map(([supplier, value]) => (
                          <TableRow key={supplier}>
                            <TableCell className="font-medium">
                              {supplier}
                            </TableCell>
                            <TableCell className="text-right font-semibold">
                              {formatCurrency(value)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <div className="grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Supplier Overview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground">
                          Total Suppliers
                        </p>
                        <p className="text-3xl font-bold">{totalSuppliers}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">
                          GST Registered
                        </p>
                        <p className="text-2xl font-bold text-green-600">
                          {gstSuppliers}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Inventory Tab */}
            <TabsContent value="inventory" className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <Card>
                  <CardHeader>
                    <CardTitle>Total Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{totalInventoryItems}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Inventory Value</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-green-600">
                      {formatCurrency(totalInventoryValue)}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold text-orange-600">
                      {lowStockItems}
                    </p>
                  </CardContent>
                </Card>
              </div>

              {lowStockItems > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Low Stock Items</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Material</TableHead>
                          <TableHead className="text-right">
                            Current Stock
                          </TableHead>
                          <TableHead className="text-right">
                            Minimum Stock
                          </TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {inventoryData?.data
                          .filter(
                            (item) => item.currentStock < item.minimumStock
                          )
                          .map((item) => (
                            <TableRow key={item.inventoryID}>
                              <TableCell className="font-medium">
                                {item.material.materialName}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.currentStock} {item.material.unitOfMeasure}
                              </TableCell>
                              <TableCell className="text-right">
                                {item.minimumStock} {item.material.unitOfMeasure}
                              </TableCell>
                              <TableCell>
                                <Badge variant="destructive">Low Stock</Badge>
                              </TableCell>
                            </TableRow>
                          ))}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
}
