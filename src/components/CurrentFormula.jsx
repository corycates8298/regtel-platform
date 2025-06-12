import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { 
  Target, 
  Plus, 
  Minus, 
  Save, 
  Download, 
  Share2, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  Calculator,
  Beaker,
  FileText,
  Clock,
  DollarSign,
  Zap,
  Shield,
  Edit3,
  Trash2,
  Copy
} from 'lucide-react'
import { useFormula } from '@/contexts/FormulaContext.jsx'
import IngredientCard from '@/components/IngredientCard.jsx'

export default function CurrentFormula() {
  const {
    currentFormula,
    formulaName,
    formulaType,
    formulaDescription,
    targetMarket,
    complianceScore,
    totalPercentage,
    remainingPercentage,
    isFormulaComplete,
    complianceIssues,
    optimizationSuggestions,
    costAnalysis,
    stabilityData,
    regulatoryStatus,
    isAnalyzing,
    removeIngredient,
    updateIngredientPercentage,
    setFormulaName,
    setFormulaType,
    setFormulaDescription,
    setTargetMarket,
    aiOptimize,
    checkCompliance,
    generateReport,
    saveFormula,
    clearFormula
  } = useFormula()

  const [showDetails, setShowDetails] = useState(false)
  const [editingFormula, setEditingFormula] = useState(false)

  // Get compliance color
  const getComplianceColor = (score) => {
    if (score >= 90) return 'text-green-400'
    if (score >= 70) return 'text-yellow-400'
    return 'text-red-400'
  }

  // Get regulatory status color
  const getRegStatusColor = (status) => {
    switch (status) {
      case 'compliant': return 'bg-green-500/20 text-green-400 border-green-500/30'
      case 'review_needed': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
      case 'non_compliant': return 'bg-red-500/20 text-red-400 border-red-500/30'
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
  }

  if (currentFormula.length === 0) {
    return (
      <Card className="bg-black/20 backdrop-blur-md border-white/10">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-400" />
            Current Formula
          </CardTitle>
          <CardDescription className="text-gray-300">
            Build your cosmetic formulation by adding ingredients
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12">
            <Beaker className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No ingredients added yet</h3>
            <p className="text-gray-400 mb-6">
              Start building your formulation by searching and adding ingredients from the database
            </p>
            <div className="flex justify-center space-x-4">
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Add Ingredients
              </Button>
              <Button variant="outline" className="border-white/20">
                <FileText className="w-4 h-4 mr-2" />
                Load Template
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Formula Header */}
      <Card className="bg-black/20 backdrop-blur-md border-white/10">
        <CardHeader>
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {editingFormula ? (
                <div className="space-y-3">
                  <div>
                    <Label className="text-gray-400 text-sm">Formula Name</Label>
                    <Input
                      value={formulaName}
                      onChange={(e) => setFormulaName(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Enter formula name..."
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-400 text-sm">Formula Type</Label>
                      <Select value={formulaType} onValueChange={setFormulaType}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select type..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="serum">Serum</SelectItem>
                          <SelectItem value="cream">Cream</SelectItem>
                          <SelectItem value="lotion">Lotion</SelectItem>
                          <SelectItem value="cleanser">Cleanser</SelectItem>
                          <SelectItem value="toner">Toner</SelectItem>
                          <SelectItem value="mask">Mask</SelectItem>
                          <SelectItem value="sunscreen">Sunscreen</SelectItem>
                          <SelectItem value="foundation">Foundation</SelectItem>
                          <SelectItem value="lipstick">Lipstick</SelectItem>
                          <SelectItem value="powder">Powder</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-gray-400 text-sm">Target Market</Label>
                      <Select value={targetMarket} onValueChange={setTargetMarket}>
                        <SelectTrigger className="bg-white/10 border-white/20 text-white">
                          <SelectValue placeholder="Select market..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="global">Global</SelectItem>
                          <SelectItem value="us">United States</SelectItem>
                          <SelectItem value="eu">European Union</SelectItem>
                          <SelectItem value="asia">Asia Pacific</SelectItem>
                          <SelectItem value="canada">Canada</SelectItem>
                          <SelectItem value="australia">Australia</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-400 text-sm">Description</Label>
                    <Textarea
                      value={formulaDescription}
                      onChange={(e) => setFormulaDescription(e.target.value)}
                      className="bg-white/10 border-white/20 text-white"
                      placeholder="Describe your formula..."
                      rows={2}
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button size="sm" onClick={() => setEditingFormula(false)} className="bg-green-600 hover:bg-green-700">
                      <Save className="w-3 h-3 mr-1" />
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditingFormula(false)} className="border-white/20">
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-xl">{formulaName}</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setEditingFormula(true)}
                      className="text-gray-400 hover:text-white"
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {formulaType && (
                      <Badge variant="outline" className="text-blue-300 border-blue-600">
                        {formulaType}
                      </Badge>
                    )}
                    {targetMarket && (
                      <Badge variant="outline" className="text-purple-300 border-purple-600">
                        {targetMarket}
                      </Badge>
                    )}
                  </div>
                  {formulaDescription && (
                    <CardDescription className="text-gray-300 mt-2">
                      {formulaDescription}
                    </CardDescription>
                  )}
                </div>
              )}
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* Formula Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{currentFormula.length}</div>
              <div className="text-gray-400 text-sm">Ingredients</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${getComplianceColor(complianceScore)}`}>
                {complianceScore}%
              </div>
              <div className="text-gray-400 text-sm">Compliance</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-bold ${isFormulaComplete ? 'text-green-400' : 'text-yellow-400'}`}>
                {totalPercentage.toFixed(1)}%
              </div>
              <div className="text-gray-400 text-sm">Total</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                ${costAnalysis.totalCost.toFixed(2)}
              </div>
              <div className="text-gray-400 text-sm">Est. Cost</div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <Label className="text-gray-400 text-sm">Formula Completion</Label>
              <span className="text-gray-400 text-sm">
                {remainingPercentage.toFixed(1)}% remaining
              </span>
            </div>
            <Progress 
              value={totalPercentage} 
              className="h-3"
              style={{
                background: totalPercentage > 100 ? 'rgba(239, 68, 68, 0.2)' : 'rgba(75, 85, 99, 0.3)'
              }}
            />
            {totalPercentage > 100 && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Formula exceeds 100% - adjust ingredient percentages
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            <Button 
              onClick={aiOptimize}
              disabled={isAnalyzing}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Zap className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Optimizing...' : 'AI Optimize'}
            </Button>
            
            <Button 
              onClick={checkCompliance}
              disabled={isAnalyzing}
              className="bg-green-600 hover:bg-green-700"
            >
              <Shield className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Checking...' : 'Check Compliance'}
            </Button>
            
            <Button 
              onClick={generateReport}
              disabled={isAnalyzing}
              className="bg-purple-600 hover:bg-purple-700"
            >
              <FileText className="w-4 h-4 mr-2" />
              {isAnalyzing ? 'Generating...' : 'Generate Report'}
            </Button>

            <Button 
              onClick={saveFormula}
              variant="outline"
              className="border-white/20"
            >
              <Save className="w-4 h-4 mr-2" />
              Save Formula
            </Button>

            <Button 
              onClick={() => setShowDetails(!showDetails)}
              variant="outline"
              className="border-white/20"
            >
              <Info className="w-4 h-4 mr-2" />
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>

            <Button 
              onClick={clearFormula}
              variant="destructive"
              className="ml-auto"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Clear
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Information */}
      {showDetails && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Compliance Issues */}
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Shield className="w-5 h-5 mr-2 text-green-400" />
                Compliance Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Regulatory Status */}
              <div>
                <Label className="text-gray-400 text-sm">Regulatory Approval</Label>
                <div className="flex space-x-2 mt-2">
                  <Badge className={getRegStatusColor(regulatoryStatus.fda)}>
                    FDA: {regulatoryStatus.fda.replace('_', ' ')}
                  </Badge>
                  <Badge className={getRegStatusColor(regulatoryStatus.eu)}>
                    EU: {regulatoryStatus.eu.replace('_', ' ')}
                  </Badge>
                  <Badge className={getRegStatusColor(regulatoryStatus.california)}>
                    CA: {regulatoryStatus.california.replace('_', ' ')}
                  </Badge>
                </div>
              </div>

              {/* Issues */}
              {complianceIssues.length > 0 ? (
                <div>
                  <Label className="text-gray-400 text-sm">Issues Found</Label>
                  <div className="space-y-2 mt-2">
                    {complianceIssues.map((issue, index) => (
                      <div key={index} className={`p-3 rounded-lg border ${
                        issue.severity === 'high' ? 'bg-red-500/10 border-red-500/30' :
                        issue.severity === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30' :
                        'bg-blue-500/10 border-blue-500/30'
                      }`}>
                        <div className="flex items-start">
                          {issue.severity === 'high' ? (
                            <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 mr-2 flex-shrink-0" />
                          ) : issue.severity === 'medium' ? (
                            <AlertTriangle className="w-4 h-4 text-yellow-400 mt-0.5 mr-2 flex-shrink-0" />
                          ) : (
                            <Info className="w-4 h-4 text-blue-400 mt-0.5 mr-2 flex-shrink-0" />
                          )}
                          <div>
                            <p className="text-white text-sm font-medium">{issue.message}</p>
                            {issue.ingredient && (
                              <p className="text-gray-400 text-xs mt-1">Ingredient: {issue.ingredient}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4">
                  <CheckCircle className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-green-400 text-sm">No compliance issues found</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cost & Stability Analysis */}
          <Card className="bg-black/20 backdrop-blur-md border-white/10">
            <CardHeader>
              <CardTitle className="text-white text-lg flex items-center">
                <Calculator className="w-5 h-5 mr-2 text-blue-400" />
                Analysis
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Cost Analysis */}
              <div>
                <Label className="text-gray-400 text-sm">Cost Breakdown</Label>
                <div className="space-y-2 mt-2">
                  <div className="flex justify-between">
                    <span className="text-white text-sm">Total Cost:</span>
                    <span className="text-white font-medium">${costAnalysis.totalCost.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white text-sm">Cost per 100g:</span>
                    <span className="text-white font-medium">${costAnalysis.costPerUnit.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Stability Data */}
              <div>
                <Label className="text-gray-400 text-sm">Stability Profile</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <div>
                    <span className="text-gray-400 text-xs">pH Level</span>
                    <p className="text-white text-sm">{stabilityData.phLevel}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Viscosity</span>
                    <p className="text-white text-sm">{stabilityData.viscosity}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Shelf Life</span>
                    <p className="text-white text-sm">{stabilityData.shelfLife}</p>
                  </div>
                  <div>
                    <span className="text-gray-400 text-xs">Storage</span>
                    <p className="text-white text-sm">{stabilityData.storageConditions}</p>
                  </div>
                </div>
              </div>

              {/* Optimization Suggestions */}
              {optimizationSuggestions.length > 0 && (
                <div>
                  <Label className="text-gray-400 text-sm">AI Suggestions</Label>
                  <div className="space-y-2 mt-2">
                    {optimizationSuggestions.map((suggestion, index) => (
                      <div key={index} className="p-2 bg-blue-500/10 border border-blue-500/30 rounded-lg">
                        <p className="text-blue-300 text-sm">{suggestion}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Ingredients List */}
      <div className="space-y-4">
        <h3 className="text-white text-lg font-semibold">Formula Ingredients</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {currentFormula.map((ingredient) => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              isInFormula={true}
              onRemove={removeIngredient}
              showDetails={true}
            />
          ))}
        </div>
      </div>
    </div>
  )
}


