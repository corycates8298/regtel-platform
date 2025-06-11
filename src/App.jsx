import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button.jsx'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { 
  Brain, 
  Shield, 
  Beaker, 
  TrendingUp, 
  Truck, 
  Database,
  AlertTriangle,
  CheckCircle,
  Clock,
  Globe,
  Zap,
  Users,
  FileText,
  Search,
  Plus,
  Settings,
  BarChart3,
  Lightbulb,
  Target
} from 'lucide-react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('dashboard')
  const [complianceScore, setComplianceScore] = useState(94)
  const [ingredientCount, setIngredientCount] = useState(3247)
  const [regulatoryChanges, setRegulatoryChanges] = useState(12)
  const [activeAlerts, setActiveAlerts] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [formulaIngredients, setFormulaIngredients] = useState([])

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setComplianceScore(prev => Math.min(100, prev + Math.random() * 2 - 1))
    }, 5000)
    return () => clearInterval(interval)
  }, [])

  const mockIngredients = [
    { id: 1, inci: 'WATER', cas: '7732-18-5', function: 'Solvent', status: 'approved' },
    { id: 2, inci: 'GLYCERIN', cas: '56-81-5', function: 'Humectant', status: 'approved' },
    { id: 3, inci: 'CETYL ALCOHOL', cas: '36653-82-4', function: 'Emollient', status: 'approved' },
    { id: 4, inci: 'CYCLOPENTASILOXANE', cas: '541-02-6', function: 'Emollient', status: 'restricted' },
    { id: 5, inci: 'RETINOL', cas: '68-26-8', function: 'Anti-aging', status: 'restricted' }
  ]

  const mockRegulatoryChanges = [
    {
      id: 1,
      title: 'FDA Facility Registration Deadline Extended',
      description: 'FDA has extended the deadline for cosmetic facility registration under MoCRA to December 31, 2025',
      jurisdiction: 'FDA',
      significance: 85,
      date: '2025-06-11'
    },
    {
      id: 2,
      title: 'California PFAS Ban Implementation Update',
      description: 'California provides updated guidance on PFAS substance identification and testing requirements',
      jurisdiction: 'California',
      significance: 75,
      date: '2025-06-11'
    }
  ]

  const addToFormula = (ingredient) => {
    if (!formulaIngredients.find(item => item.id === ingredient.id)) {
      setFormulaIngredients([...formulaIngredients, { ...ingredient, concentration: 1.0 }])
    }
  }

  const removeFromFormula = (ingredientId) => {
    setFormulaIngredients(formulaIngredients.filter(item => item.id !== ingredientId))
  }

  const updateConcentration = (ingredientId, concentration) => {
    setFormulaIngredients(formulaIngredients.map(item => 
      item.id === ingredientId ? { ...item, concentration: parseFloat(concentration) } : item
    ))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-md border-b border-white/10 p-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <div>
              <h1 className="text-white text-2xl font-bold">RegTel Nuclear Platform</h1>
              <p className="text-purple-200 text-sm">AI-Powered Cosmetics Regulatory Intelligence v8.0</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white text-sm">AI Intelligence Active</span>
            </div>
            <div className="text-white text-sm">
              {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation */}
          <TabsList className="grid w-full grid-cols-6 mb-8 bg-black/20 backdrop-blur-md">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="formulator" className="flex items-center space-x-2">
              <Beaker className="w-4 h-4" />
              <span>AI Formulator</span>
            </TabsTrigger>
            <TabsTrigger value="compliance" className="flex items-center space-x-2">
              <Shield className="w-4 h-4" />
              <span>Compliance</span>
            </TabsTrigger>
            <TabsTrigger value="intelligence" className="flex items-center space-x-2">
              <Brain className="w-4 h-4" />
              <span>AI Intelligence</span>
            </TabsTrigger>
            <TabsTrigger value="supply-chain" className="flex items-center space-x-2">
              <Truck className="w-4 h-4" />
              <span>Supply Chain</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Overall Compliance Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{complianceScore.toFixed(0)}</div>
                  <Progress value={complianceScore} className="h-2" />
                  <div className="flex items-center mt-2">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">Excellent</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">PCPC Ingredients</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{ingredientCount.toLocaleString()}</div>
                  <div className="flex items-center">
                    <Database className="w-4 h-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 text-sm">Database Complete</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Regulatory Changes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{regulatoryChanges}</div>
                  <div className="flex items-center">
                    <AlertTriangle className="w-4 h-4 text-yellow-400 mr-1" />
                    <span className="text-yellow-400 text-sm">3 Critical Updates</span>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-md border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-sm font-medium">Active Alerts</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-white mb-2">{activeAlerts}</div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 text-green-400 mr-1" />
                    <span className="text-green-400 text-sm">All Clear</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Regulatory Changes */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-400" />
                  Recent Regulatory Changes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockRegulatoryChanges.map((change) => (
                  <div key={change.id} className="border border-white/10 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-white font-semibold">{change.title}</h4>
                      <Badge variant="secondary">{change.jurisdiction}</Badge>
                    </div>
                    <p className="text-gray-300 text-sm mb-2">{change.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400 text-sm">{change.date}</span>
                      <div className="flex items-center">
                        <span className="text-sm text-gray-400 mr-2">Significance:</span>
                        <Badge variant={change.significance > 80 ? "destructive" : "secondary"}>
                          {change.significance}/100
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* System Status */}
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-yellow-400" />
                  System Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-500/20 rounded-lg p-4">
                    <div className="text-green-400 font-semibold">Supabase Database</div>
                    <div className="text-white text-sm">Connected & Operational</div>
                  </div>
                  <div className="bg-blue-500/20 rounded-lg p-4">
                    <div className="text-blue-400 font-semibold">AI Intelligence</div>
                    <div className="text-white text-sm">Processing 1,247 data points</div>
                  </div>
                  <div className="bg-purple-500/20 rounded-lg p-4">
                    <div className="text-purple-400 font-semibold">Regulatory Monitor</div>
                    <div className="text-white text-sm">Monitoring 58 jurisdictions</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Formulator Tab */}
          <TabsContent value="formulator" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Beaker className="w-5 h-5 mr-2 text-green-400" />
                  AI-Powered Formulator IDE
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced formulation with real-time compliance checking and AI optimization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ingredient Search */}
                <div>
                  <Label htmlFor="ingredient-search" className="text-white">Search PCPC Ingredients Database</Label>
                  <div className="flex space-x-2 mt-2">
                    <Input
                      id="ingredient-search"
                      placeholder="Search by INCI name, CAS number, or function..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                    />
                    <Button className="bg-blue-600 hover:bg-blue-700">
                      <Search className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Search Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockIngredients
                    .filter(ingredient => 
                      searchQuery === '' || 
                      ingredient.inci.toLowerCase().includes(searchQuery.toLowerCase()) ||
                      ingredient.cas.includes(searchQuery) ||
                      ingredient.function.toLowerCase().includes(searchQuery.toLowerCase())
                    )
                    .map((ingredient) => (
                    <Card key={ingredient.id} className="bg-white/5 border-white/10">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="text-white font-semibold text-sm">{ingredient.inci}</h4>
                          <Badge variant={ingredient.status === 'approved' ? 'default' : 'destructive'}>
                            {ingredient.status}
                          </Badge>
                        </div>
                        <p className="text-gray-400 text-xs mb-1">CAS: {ingredient.cas}</p>
                        <p className="text-gray-400 text-xs mb-3">Function: {ingredient.function}</p>
                        <Button 
                          size="sm" 
                          onClick={() => addToFormula(ingredient)}
                          className="w-full bg-green-600 hover:bg-green-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Add to Formula
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {/* Formula Builder */}
                <div className="border-t border-white/10 pt-6">
                  <h4 className="text-white font-semibold mb-4 flex items-center">
                    <Target className="w-4 h-4 mr-2" />
                    Current Formula
                  </h4>
                  {formulaIngredients.length === 0 ? (
                    <div className="bg-white/5 rounded-lg p-8 text-center">
                      <p className="text-gray-400">Add ingredients to start building your formulation</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {formulaIngredients.map((ingredient) => (
                        <div key={ingredient.id} className="bg-white/5 rounded-lg p-4 flex items-center justify-between">
                          <div className="flex-1">
                            <h5 className="text-white font-medium">{ingredient.inci}</h5>
                            <p className="text-gray-400 text-sm">{ingredient.function}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <div className="flex items-center space-x-2">
                              <Label className="text-gray-400 text-sm">%:</Label>
                              <Input
                                type="number"
                                value={ingredient.concentration}
                                onChange={(e) => updateConcentration(ingredient.id, e.target.value)}
                                className="w-20 bg-white/10 border-white/20 text-white"
                                step="0.1"
                                min="0"
                                max="100"
                              />
                            </div>
                            <Button 
                              size="sm" 
                              variant="destructive"
                              onClick={() => removeFromFormula(ingredient.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        </div>
                      ))}
                      <div className="flex space-x-3 pt-4">
                        <Button className="bg-blue-600 hover:bg-blue-700">
                          <Brain className="w-4 h-4 mr-2" />
                          AI Optimize
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700">
                          <Shield className="w-4 h-4 mr-2" />
                          Check Compliance
                        </Button>
                        <Button className="bg-purple-600 hover:bg-purple-700">
                          <FileText className="w-4 h-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Compliance Tab */}
          <TabsContent value="compliance" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-400" />
                  Global Compliance Engine
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time compliance checking across 58 global jurisdictions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <Card className="bg-green-500/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-green-400 font-semibold">US FDA MoCRA</h4>
                          <p className="text-white text-sm">Fully Compliant</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-yellow-500/20 border-yellow-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-yellow-400 font-semibold">California Prop 65</h4>
                          <p className="text-white text-sm">Review Required</p>
                        </div>
                        <AlertTriangle className="w-8 h-8 text-yellow-400" />
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-green-500/20 border-green-500/30">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-green-400 font-semibold">EU Regulation 1223/2009</h4>
                          <p className="text-white text-sm">Compliant</p>
                        </div>
                        <CheckCircle className="w-8 h-8 text-green-400" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Intelligence Tab */}
          <TabsContent value="intelligence" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-purple-400" />
                  AI Intelligence Center
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Advanced AI analytics and predictive regulatory intelligence
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card className="bg-purple-500/20 border-purple-500/30">
                    <CardContent className="p-4">
                      <h4 className="text-purple-400 font-semibold mb-2">Predictive Compliance</h4>
                      <p className="text-white text-sm mb-3">AI models predict regulatory changes 6 months in advance</p>
                      <div className="flex items-center">
                        <Lightbulb className="w-4 h-4 text-yellow-400 mr-2" />
                        <span className="text-yellow-400 text-sm">3 upcoming changes detected</span>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-blue-500/20 border-blue-500/30">
                    <CardContent className="p-4">
                      <h4 className="text-blue-400 font-semibold mb-2">Market Intelligence</h4>
                      <p className="text-white text-sm mb-3">Real-time analysis of industry trends and competitor activities</p>
                      <div className="flex items-center">
                        <TrendingUp className="w-4 h-4 text-green-400 mr-2" />
                        <span className="text-green-400 text-sm">247 data points processed</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Supply Chain Tab */}
          <TabsContent value="supply-chain" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Truck className="w-5 h-5 mr-2 text-orange-400" />
                  Supply Chain Intelligence
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Real-time supplier integration and blockchain traceability
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Truck className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Supply Chain Module</h3>
                  <p className="text-gray-400">Advanced supply chain features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="bg-black/20 backdrop-blur-md border-white/10">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-400" />
                  Advanced Analytics
                </CardTitle>
                <CardDescription className="text-gray-300">
                  Business intelligence and performance metrics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <BarChart3 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white text-lg font-semibold mb-2">Analytics Dashboard</h3>
                  <p className="text-gray-400">Advanced analytics features coming soon</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default App

