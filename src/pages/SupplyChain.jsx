import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table.jsx'
import { 
  Truck, 
  Package, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  DollarSign,
  TrendingUp,
  TrendingDown,
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Download,
  RefreshCw,
  MapPin,
  Calendar,
  BarChart3,
  Shield,
  Users,
  Warehouse,
  FileText,
  Settings
} from 'lucide-react'
import { SupplyChainProvider, useSupplyChain } from '@/contexts/SupplyChainContext.jsx'
import { 
  mockSuppliers, 
  mockInventory, 
  mockPurchaseOrders, 
  mockQualityReports,
  getSupplierRiskColor,
  getInventoryStatusColor,
  getOrderStatusColor,
  calculateInventoryValue,
  getInventoryAlerts
} from '@/data/supplyChainData.js'

// Main Supply Chain Component
function SupplyChainContent() {
  const {
    suppliers,
    inventory,
    purchaseOrders,
    qualityReports,
    riskAssessments,
    metrics,
    loading,
    error,
    filters,
    setFilters,
    refreshData
  } = useSupplyChain()

  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('overview')

  // Filter data based on search and filters
  const filteredSuppliers = suppliers.filter(supplier => {
    const matchesSearch = supplier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         supplier.type.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filters.supplierStatus === 'all' || supplier.status === filters.supplierStatus
    const matchesRisk = filters.riskLevel === 'all' || supplier.riskLevel === filters.riskLevel
    const matchesRegion = filters.region === 'all' || supplier.region === filters.region
    
    return matchesSearch && matchesStatus && matchesRisk && matchesRegion
  })

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.ingredient.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.inci.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.supplier.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSearch
  })

  const inventoryAlerts = getInventoryAlerts(inventory)
  const totalInventoryValue = calculateInventoryValue(inventory)

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-400" />
          <span className="text-white">Loading supply chain data...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-white text-lg font-semibold mb-2">Error Loading Data</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <Button onClick={refreshData} className="bg-blue-600 hover:bg-blue-700">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-white text-2xl font-bold flex items-center">
            <Truck className="w-6 h-6 mr-2 text-orange-400" />
            Supply Chain Intelligence
          </h2>
          <p className="text-gray-300">Real-time supplier integration and blockchain traceability</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={refreshData} variant="outline" className="border-white/20">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center">
              <Users className="w-4 h-4 mr-2 text-blue-400" />
              Total Suppliers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{metrics.totalSuppliers}</div>
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">
                {suppliers.filter(s => s.status === 'verified').length} Verified
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center">
              <Package className="w-4 h-4 mr-2 text-green-400" />
              Active Orders
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{metrics.activeOrders}</div>
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">
                ${purchaseOrders.reduce((sum, order) => sum + order.totalAmount, 0).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center">
              <AlertTriangle className="w-4 h-4 mr-2 text-yellow-400" />
              Risk Alerts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{metrics.riskAlerts}</div>
            <div className="flex items-center">
              <Shield className="w-4 h-4 text-yellow-400 mr-1" />
              <span className="text-yellow-400 text-sm">
                {inventoryAlerts.length} Inventory Alerts
              </span>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-white text-sm font-medium flex items-center">
              <TrendingUp className="w-4 h-4 mr-2 text-purple-400" />
              Quality Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-white mb-2">{metrics.qualityScore}%</div>
            <Progress value={metrics.qualityScore} className="h-2 mb-2" />
            <div className="flex items-center">
              <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
              <span className="text-green-400 text-sm">Excellent</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="bg-black/20 backdrop-blur-md border-white/10">
        <CardContent className="p-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-64">
              <Label htmlFor="search" className="text-white">Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="search"
                  placeholder="Search suppliers, ingredients, or orders..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
                />
              </div>
            </div>
            
            <div>
              <Label className="text-white">Status</Label>
              <Select value={filters.supplierStatus} onValueChange={(value) => setFilters({ supplierStatus: value })}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Risk Level</Label>
              <Select value={filters.riskLevel} onValueChange={(value) => setFilters({ riskLevel: value })}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="low">Low Risk</SelectItem>
                  <SelectItem value="medium">Medium Risk</SelectItem>
                  <SelectItem value="high">High Risk</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label className="text-white">Region</Label>
              <Select value={filters.region} onValueChange={(value) => setFilters({ region: value })}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Regions</SelectItem>
                  <SelectItem value="North America">North America</SelectItem>
                  <SelectItem value="Europe">Europe</SelectItem>
                  <SelectItem value="Asia Pacific">Asia Pacific</SelectItem>
                  <SelectItem value="Latin America">Latin America</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 bg-black/20 backdrop-blur-md">
          <TabsTrigger value="overview" className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="suppliers" className="flex items-center space-x-2">
            <Users className="w-4 h-4" />
            <span>Suppliers</span>
          </TabsTrigger>
          <TabsTrigger value="inventory" className="flex items-center space-x-2">
            <Warehouse className="w-4 h-4" />
            <span>Inventory</span>
          </TabsTrigger>
          <TabsTrigger value="orders" className="flex items-center space-x-2">
            <Package className="w-4 h-4" />
            <span>Orders</span>
          </TabsTrigger>
          <TabsTrigger value="quality" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>Quality</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Supplier Performance */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Top Performing Suppliers
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {suppliers.slice(0, 3).map((supplier) => (
                  <div key={supplier.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{supplier.name}</h4>
                      <p className="text-gray-400 text-sm">{supplier.type}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{supplier.qualityScore}%</div>
                      <Badge className={getSupplierRiskColor(supplier.riskLevel)}>
                        {supplier.riskLevel} risk
                      </Badge>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Inventory Alerts */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-yellow-400" />
                  Inventory Alerts
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {inventoryAlerts.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                    <div>
                      <h4 className="text-white font-medium">{item.ingredient}</h4>
                      <p className="text-gray-400 text-sm">{item.supplier}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-white font-semibold">{item.currentStock} {item.unit}</div>
                      <Badge className={getInventoryStatusColor(item.status)}>
                        {item.status.replace('-', ' ')}
                      </Badge>
                    </div>
                  </div>
                ))}
                {inventoryAlerts.length === 0 && (
                  <div className="text-center py-8">
                    <CheckCircle className="w-12 h-12 text-green-400 mx-auto mb-2" />
                    <p className="text-gray-400">No inventory alerts</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Recent Orders */}
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-400" />
                Recent Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">Order ID</TableHead>
                      <TableHead className="text-gray-300">Supplier</TableHead>
                      <TableHead className="text-gray-300">Amount</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Expected Delivery</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.slice(0, 5).map((order) => (
                      <TableRow key={order.id} className="border-white/10">
                        <TableCell className="text-white font-medium">{order.id}</TableCell>
                        <TableCell className="text-gray-300">{order.supplier}</TableCell>
                        <TableCell className="text-white">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-gray-300">{order.expectedDelivery}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Suppliers Tab */}
        <TabsContent value="suppliers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSuppliers.map((supplier) => (
              <Card key={supplier.id} className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-white text-lg">{supplier.name}</CardTitle>
                      <CardDescription className="text-gray-400">{supplier.type}</CardDescription>
                    </div>
                    <Badge className={getSupplierRiskColor(supplier.riskLevel)}>
                      {supplier.riskLevel} risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Quality Score</Label>
                      <div className="text-white font-semibold">{supplier.qualityScore}%</div>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">On-Time Delivery</Label>
                      <div className="text-white font-semibold">{supplier.onTimeDelivery}%</div>
                    </div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-sm">Region</Label>
                    <div className="text-white">{supplier.region}</div>
                  </div>
                  
                  <div>
                    <Label className="text-gray-400 text-sm">Certifications</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {supplier.certifications.slice(0, 3).map((cert) => (
                        <Badge key={cert} variant="secondary" className="text-xs">
                          {cert}
                        </Badge>
                      ))}
                      {supplier.certifications.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{supplier.certifications.length - 3}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex space-x-2 pt-2">
                    <Button size="sm" variant="outline" className="flex-1 border-white/20">
                      <Eye className="w-3 h-3 mr-1" />
                      View
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 border-white/20">
                      <Edit className="w-3 h-3 mr-1" />
                      Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="text-white flex items-center">
                  <Warehouse className="w-5 h-5 mr-2 text-green-400" />
                  Inventory Management
                </CardTitle>
                <div className="text-right">
                  <div className="text-white text-sm">Total Value</div>
                  <div className="text-2xl font-bold text-green-400">
                    ${totalInventoryValue.toLocaleString()}
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">Ingredient</TableHead>
                      <TableHead className="text-gray-300">Supplier</TableHead>
                      <TableHead className="text-gray-300">Stock</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Value</TableHead>
                      <TableHead className="text-gray-300">Expiry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredInventory.map((item) => (
                      <TableRow key={item.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <div className="text-white font-medium">{item.ingredient}</div>
                            <div className="text-gray-400 text-sm">{item.inci}</div>
                          </div>
                        </TableCell>
                        <TableCell className="text-gray-300">{item.supplier}</TableCell>
                        <TableCell>
                          <div className="text-white">{item.currentStock} {item.unit}</div>
                          <div className="text-gray-400 text-sm">Min: {item.minStock}</div>
                        </TableCell>
                        <TableCell>
                          <Badge className={getInventoryStatusColor(item.status)}>
                            {item.status.replace('-', ' ')}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-white">
                          ${(item.currentStock * item.costPerUnit).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-gray-300">{item.expiryDate}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Package className="w-5 h-5 mr-2 text-blue-400" />
                Purchase Orders
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead className="text-gray-300">Order ID</TableHead>
                      <TableHead className="text-gray-300">Supplier</TableHead>
                      <TableHead className="text-gray-300">Items</TableHead>
                      <TableHead className="text-gray-300">Total</TableHead>
                      <TableHead className="text-gray-300">Status</TableHead>
                      <TableHead className="text-gray-300">Delivery</TableHead>
                      <TableHead className="text-gray-300">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {purchaseOrders.map((order) => (
                      <TableRow key={order.id} className="border-white/10">
                        <TableCell className="text-white font-medium">{order.id}</TableCell>
                        <TableCell className="text-gray-300">{order.supplier}</TableCell>
                        <TableCell>
                          <div className="text-white">{order.items.length} items</div>
                          <div className="text-gray-400 text-sm">
                            {order.items[0]?.ingredient}
                            {order.items.length > 1 && ` +${order.items.length - 1} more`}
                          </div>
                        </TableCell>
                        <TableCell className="text-white">${order.totalAmount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge className={getOrderStatusColor(order.status)}>
                            {order.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-gray-300">{order.expectedDelivery}</div>
                          {order.actualDelivery && (
                            <div className="text-sm text-green-400">
                              Delivered: {order.actualDelivery}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-1">
                            <Button size="sm" variant="outline" className="border-white/20">
                              <Eye className="w-3 h-3" />
                            </Button>
                            <Button size="sm" variant="outline" className="border-white/20">
                              <Download className="w-3 h-3" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Quality Tab */}
        <TabsContent value="quality" className="space-y-6">
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Quality Control Reports
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {qualityReports.map((report) => (
                <div key={report.id} className="border border-white/10 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-white font-semibold">{report.ingredient}</h4>
                      <p className="text-gray-400 text-sm">{report.supplier} • Batch: {report.batchNumber}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-white">{report.score}%</div>
                      <Badge className={report.approved ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}>
                        {report.approved ? 'Approved' : 'Rejected'}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    {Object.entries(report.tests).map(([testName, test]) => (
                      <div key={testName} className="bg-white/5 rounded p-3">
                        <div className="text-gray-400 text-sm capitalize">{testName}</div>
                        <div className="text-white font-medium">{test.result}{test.unit}</div>
                        <div className="text-gray-400 text-xs">Spec: {test.specification}</div>
                        <Badge className={test.status === 'pass' ? 'bg-green-400/20 text-green-400' : 'bg-red-400/20 text-red-400'}>
                          {test.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-400">
                      Tested: {report.testDate} • Approved by: {report.approvedBy}
                    </span>
                    <Button size="sm" variant="outline" className="border-white/20">
                      <FileText className="w-3 h-3 mr-1" />
                      View Report
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Main component with provider
export default function SupplyChain() {
  return (
    <SupplyChainProvider>
      <SupplyChainContent />
    </SupplyChainProvider>
  )
}


