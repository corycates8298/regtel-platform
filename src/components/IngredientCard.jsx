import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Input } from '@/components/ui/input.jsx'
import { Label } from '@/components/ui/label.jsx'
import { Textarea } from '@/components/ui/textarea.jsx'
import { Progress } from '@/components/ui/progress.jsx'
import { 
  Plus, 
  Minus, 
  Info, 
  AlertTriangle, 
  CheckCircle, 
  Star,
  DollarSign,
  Leaf,
  Shield,
  Zap,
  Eye,
  EyeOff,
  Edit3,
  Save,
  X
} from 'lucide-react'
import { useFormula } from '@/contexts/FormulaContext.jsx'
import { getStatusColor, getCategoryColor, getSafetyRating, getEfficacyRating, getCostRating } from '@/data/pcpcIngredients.js'

export default function IngredientCard({ ingredient, isInFormula = false, onAdd, onRemove, showDetails = false }) {
  const { updateIngredientPercentage, updateIngredient } = useFormula()
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    percentage: ingredient.percentage || 1,
    notes: ingredient.notes || '',
    supplier: ingredient.supplier || '',
    batchNumber: ingredient.batchNumber || ''
  })

  const handlePercentageChange = (value) => {
    const numValue = parseFloat(value) || 0
    setEditData(prev => ({ ...prev, percentage: numValue }))
    if (isInFormula) {
      updateIngredientPercentage(ingredient.id, numValue)
    }
  }

  const handleSaveEdit = () => {
    if (isInFormula) {
      updateIngredient(ingredient.id, {
        notes: editData.notes,
        supplier: editData.supplier,
        batchNumber: editData.batchNumber
      })
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditData({
      percentage: ingredient.percentage || 1,
      notes: ingredient.notes || '',
      supplier: ingredient.supplier || '',
      batchNumber: ingredient.batchNumber || ''
    })
    setIsEditing(false)
  }

  const safetyRating = getSafetyRating(ingredient.safetyRating || 3)
  const efficacyRating = getEfficacyRating(ingredient.efficacyRating || 3)
  const costRating = getCostRating(ingredient.costRating || 3)

  return (
    <Card className={`bg-black/20 backdrop-blur-md border-white/10 transition-all duration-200 hover:border-white/20 ${isInFormula ? 'ring-1 ring-blue-500/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <CardTitle className="text-white text-lg font-semibold flex items-center">
              {ingredient.name || ingredient.inci}
              {ingredient.status === 'restricted' && (
                <AlertTriangle className="w-4 h-4 ml-2 text-yellow-400" />
              )}
              {ingredient.status === 'banned' && (
                <X className="w-4 h-4 ml-2 text-red-400" />
              )}
              {ingredient.status === 'approved' && (
                <CheckCircle className="w-4 h-4 ml-2 text-green-400" />
              )}
            </CardTitle>
            <CardDescription className="text-gray-400 text-sm mt-1">
              {ingredient.inci && ingredient.inci !== ingredient.name && (
                <span className="block">INCI: {ingredient.inci}</span>
              )}
              <span>CAS: {ingredient.casNumber}</span>
            </CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Badge className={getStatusColor(ingredient.status)}>
              {ingredient.status}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-white"
            >
              {isExpanded ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-3">
          <Badge className={getCategoryColor(ingredient.category)}>
            {ingredient.category}
          </Badge>
          <Badge variant="outline" className="text-gray-300 border-gray-600">
            {ingredient.function}
          </Badge>
          {ingredient.origin && (
            <Badge variant="outline" className="text-gray-300 border-gray-600">
              {ingredient.origin}
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Description */}
        <p className="text-gray-300 text-sm leading-relaxed">
          {ingredient.description}
        </p>

        {/* Ratings */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Shield className="w-4 h-4 mr-1 text-blue-400" />
              <span className="text-xs text-gray-400">Safety</span>
            </div>
            <div className={`text-sm font-medium ${safetyRating.color}`}>
              {safetyRating.label}
            </div>
            <Progress value={ingredient.safetyRating * 20} className="h-1 mt-1" />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <Zap className="w-4 h-4 mr-1 text-purple-400" />
              <span className="text-xs text-gray-400">Efficacy</span>
            </div>
            <div className={`text-sm font-medium ${efficacyRating.color}`}>
              {efficacyRating.label}
            </div>
            <Progress value={ingredient.efficacyRating * 20} className="h-1 mt-1" />
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-1">
              <DollarSign className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-xs text-gray-400">Cost</span>
            </div>
            <div className={`text-sm font-medium ${costRating.color}`}>
              {costRating.label}
            </div>
            <Progress value={ingredient.costRating * 20} className="h-1 mt-1" />
          </div>
        </div>

        {/* Concentration and Percentage */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label className="text-gray-400 text-xs">Max Concentration</Label>
            <p className="text-white text-sm font-medium">{ingredient.concentration}</p>
          </div>
          {isInFormula && (
            <div>
              <Label className="text-gray-400 text-xs">Current %</Label>
              <div className="flex items-center space-x-2">
                <Input
                  type="number"
                  value={editData.percentage}
                  onChange={(e) => handlePercentageChange(e.target.value)}
                  className="bg-white/10 border-white/20 text-white text-sm h-8"
                  step="0.1"
                  min="0"
                  max="100"
                />
                <span className="text-gray-400 text-sm">%</span>
              </div>
            </div>
          )}
        </div>

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-4 pt-4 border-t border-white/10">
            {/* Restrictions */}
            {ingredient.restrictions && ingredient.restrictions !== 'None' && (
              <div>
                <Label className="text-gray-400 text-xs flex items-center">
                  <AlertTriangle className="w-3 h-3 mr-1" />
                  Restrictions
                </Label>
                <p className="text-yellow-300 text-sm mt-1">{ingredient.restrictions}</p>
              </div>
            )}

            {/* Regulatory Notes */}
            {ingredient.regulatoryNotes && (
              <div>
                <Label className="text-gray-400 text-xs">Regulatory Notes</Label>
                <p className="text-gray-300 text-sm mt-1">{ingredient.regulatoryNotes}</p>
              </div>
            )}

            {/* Compatibility */}
            <div className="grid grid-cols-2 gap-4">
              {ingredient.compatibleWith && ingredient.compatibleWith.length > 0 && (
                <div>
                  <Label className="text-gray-400 text-xs flex items-center">
                    <CheckCircle className="w-3 h-3 mr-1 text-green-400" />
                    Compatible With
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ingredient.compatibleWith.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-green-300 border-green-600">
                        {item}
                      </Badge>
                    ))}
                    {ingredient.compatibleWith.length > 3 && (
                      <Badge variant="outline" className="text-xs text-gray-400">
                        +{ingredient.compatibleWith.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}

              {ingredient.incompatibleWith && ingredient.incompatibleWith.length > 0 && ingredient.incompatibleWith[0] !== 'None known' && (
                <div>
                  <Label className="text-gray-400 text-xs flex items-center">
                    <X className="w-3 h-3 mr-1 text-red-400" />
                    Incompatible With
                  </Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {ingredient.incompatibleWith.slice(0, 3).map((item, index) => (
                      <Badge key={index} variant="outline" className="text-xs text-red-300 border-red-600">
                        {item}
                      </Badge>
                    ))}
                    {ingredient.incompatibleWith.length > 3 && (
                      <Badge variant="outline" className="text-xs text-gray-400">
                        +{ingredient.incompatibleWith.length - 3} more
                      </Badge>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Technical Details */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              {ingredient.phRange && (
                <div>
                  <Label className="text-gray-400 text-xs">pH Range</Label>
                  <p className="text-white">{ingredient.phRange}</p>
                </div>
              )}
              {ingredient.solubility && (
                <div>
                  <Label className="text-gray-400 text-xs">Solubility</Label>
                  <p className="text-white">{ingredient.solubility}</p>
                </div>
              )}
              {ingredient.molecularWeight && (
                <div>
                  <Label className="text-gray-400 text-xs">Molecular Weight</Label>
                  <p className="text-white">{ingredient.molecularWeight}</p>
                </div>
              )}
              {ingredient.sustainabilityRating && (
                <div>
                  <Label className="text-gray-400 text-xs flex items-center">
                    <Leaf className="w-3 h-3 mr-1 text-green-400" />
                    Sustainability
                  </Label>
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < ingredient.sustainabilityRating ? 'text-green-400 fill-current' : 'text-gray-600'}`}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Suppliers */}
            {ingredient.suppliers && ingredient.suppliers.length > 0 && (
              <div>
                <Label className="text-gray-400 text-xs">Suppliers</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {ingredient.suppliers.map((supplier, index) => (
                    <Badge key={index} variant="outline" className="text-xs text-blue-300 border-blue-600">
                      {supplier}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Formula-specific fields */}
            {isInFormula && (
              <div className="space-y-3 pt-3 border-t border-white/10">
                <div className="flex justify-between items-center">
                  <Label className="text-gray-400 text-sm">Formula Details</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsEditing(!isEditing)}
                    className="text-gray-400 hover:text-white"
                  >
                    {isEditing ? <X className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
                  </Button>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="text-gray-400 text-xs">Supplier</Label>
                      <Input
                        value={editData.supplier}
                        onChange={(e) => setEditData(prev => ({ ...prev, supplier: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white text-sm"
                        placeholder="Select supplier..."
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Batch Number</Label>
                      <Input
                        value={editData.batchNumber}
                        onChange={(e) => setEditData(prev => ({ ...prev, batchNumber: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white text-sm"
                        placeholder="Enter batch number..."
                      />
                    </div>
                    <div>
                      <Label className="text-gray-400 text-xs">Notes</Label>
                      <Textarea
                        value={editData.notes}
                        onChange={(e) => setEditData(prev => ({ ...prev, notes: e.target.value }))}
                        className="bg-white/10 border-white/20 text-white text-sm"
                        placeholder="Add notes about this ingredient..."
                        rows={2}
                      />
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" onClick={handleSaveEdit} className="bg-green-600 hover:bg-green-700">
                        <Save className="w-3 h-3 mr-1" />
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={handleCancelEdit} className="border-white/20">
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 text-sm">
                    {ingredient.supplier && (
                      <div>
                        <span className="text-gray-400">Supplier: </span>
                        <span className="text-white">{ingredient.supplier}</span>
                      </div>
                    )}
                    {ingredient.batchNumber && (
                      <div>
                        <span className="text-gray-400">Batch: </span>
                        <span className="text-white">{ingredient.batchNumber}</span>
                      </div>
                    )}
                    {ingredient.notes && (
                      <div>
                        <span className="text-gray-400">Notes: </span>
                        <span className="text-white">{ingredient.notes}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {isInFormula ? (
            <Button 
              size="sm" 
              variant="destructive"
              onClick={() => onRemove && onRemove(ingredient.id)}
              className="flex-1"
            >
              <Minus className="w-3 h-3 mr-1" />
              Remove
            </Button>
          ) : (
            <Button 
              size="sm" 
              onClick={() => onAdd && onAdd(ingredient)}
              className="flex-1 bg-green-600 hover:bg-green-700"
              disabled={ingredient.status === 'banned'}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add to Formula
            </Button>
          )}
          
          <Button 
            size="sm" 
            variant="outline"
            onClick={() => setIsExpanded(!isExpanded)}
            className="border-white/20"
          >
            <Info className="w-3 h-3" />
          </Button>
        </div>

        {/* Last Updated */}
        {ingredient.lastUpdated && (
          <p className="text-xs text-gray-500 text-center pt-2 border-t border-white/5">
            Updated: {new Date(ingredient.lastUpdated).toLocaleDateString()}
          </p>
        )}
      </CardContent>
    </Card>
  )
}


