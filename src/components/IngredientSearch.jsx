import React, { useState, useEffect, useMemo } from 'react'
import { Input } from '@/components/ui/input.jsx'
import { Button } from '@/components/ui/button.jsx'
import { Badge } from '@/components/ui/badge.jsx'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select.jsx'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card.jsx'
import { 
  Search, 
  Filter, 
  X, 
  SlidersHorizontal,
  ChevronDown,
  ChevronUp,
  RotateCcw
} from 'lucide-react'
import { 
  pcpcIngredients, 
  ingredientCategories, 
  ingredientStatuses, 
  ingredientFunctions,
  ingredientOrigins,
  searchIngredients,
  getIngredientsByCategory,
  getIngredientsByStatus,
  getIngredientsByFunction
} from '@/data/pcpcIngredients.js'

export default function IngredientSearch({ 
  onIngredientsChange, 
  selectedIngredients = [],
  showFilters = true,
  placeholder = "Search by INCI name, CAS number, or function..."
}) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedFunction, setSelectedFunction] = useState('All Functions')
  const [selectedOrigin, setSelectedOrigin] = useState('All Origins')
  const [sortBy, setSortBy] = useState('name')
  const [sortOrder, setSortOrder] = useState('asc')
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false)
  const [minSafetyRating, setMinSafetyRating] = useState(1)
  const [maxCostRating, setMaxCostRating] = useState(5)
  const [sustainabilityFilter, setSustainabilityFilter] = useState(1)

  // Filtered and sorted ingredients
  const filteredIngredients = useMemo(() => {
    let results = pcpcIngredients

    // Text search
    if (searchQuery.trim()) {
      results = searchIngredients(searchQuery.trim())
    }

    // Category filter
    if (selectedCategory !== 'all') {
      results = results.filter(ingredient => 
        ingredient.category.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    // Status filter
    if (selectedStatus !== 'all') {
      results = results.filter(ingredient => ingredient.status === selectedStatus)
    }

    // Function filter
    if (selectedFunction !== 'All Functions') {
      results = results.filter(ingredient => ingredient.function === selectedFunction)
    }

    // Origin filter
    if (selectedOrigin !== 'All Origins') {
      results = results.filter(ingredient => ingredient.origin === selectedOrigin)
    }

    // Advanced filters
    if (showAdvancedFilters) {
      results = results.filter(ingredient => {
        const safetyOk = (ingredient.safetyRating || 3) >= minSafetyRating
        const costOk = (ingredient.costRating || 3) <= maxCostRating
        const sustainabilityOk = (ingredient.sustainabilityRating || 3) >= sustainabilityFilter
        return safetyOk && costOk && sustainabilityOk
      })
    }

    // Exclude already selected ingredients
    if (selectedIngredients.length > 0) {
      const selectedIds = selectedIngredients.map(ing => ing.id)
      results = results.filter(ingredient => !selectedIds.includes(ingredient.id))
    }

    // Sort results
    results.sort((a, b) => {
      let aValue, bValue

      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
          break
        case 'category':
          aValue = a.category.toLowerCase()
          bValue = b.category.toLowerCase()
          break
        case 'function':
          aValue = a.function.toLowerCase()
          bValue = b.function.toLowerCase()
          break
        case 'safety':
          aValue = a.safetyRating || 3
          bValue = b.safetyRating || 3
          break
        case 'cost':
          aValue = a.costRating || 3
          bValue = b.costRating || 3
          break
        case 'sustainability':
          aValue = a.sustainabilityRating || 3
          bValue = b.sustainabilityRating || 3
          break
        default:
          aValue = a.name.toLowerCase()
          bValue = b.name.toLowerCase()
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0
      }
    })

    return results
  }, [
    searchQuery, 
    selectedCategory, 
    selectedStatus, 
    selectedFunction, 
    selectedOrigin,
    sortBy, 
    sortOrder, 
    selectedIngredients,
    showAdvancedFilters,
    minSafetyRating,
    maxCostRating,
    sustainabilityFilter
  ])

  // Update parent component when filtered ingredients change
  useEffect(() => {
    if (onIngredientsChange) {
      onIngredientsChange(filteredIngredients)
    }
  }, [filteredIngredients, onIngredientsChange])

  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setSelectedStatus('all')
    setSelectedFunction('All Functions')
    setSelectedOrigin('All Origins')
    setSortBy('name')
    setSortOrder('asc')
    setMinSafetyRating(1)
    setMaxCostRating(5)
    setSustainabilityFilter(1)
    setShowAdvancedFilters(false)
  }

  // Get active filter count
  const activeFilterCount = useMemo(() => {
    let count = 0
    if (searchQuery.trim()) count++
    if (selectedCategory !== 'all') count++
    if (selectedStatus !== 'all') count++
    if (selectedFunction !== 'All Functions') count++
    if (selectedOrigin !== 'All Origins') count++
    if (showAdvancedFilters && (minSafetyRating > 1 || maxCostRating < 5 || sustainabilityFilter > 1)) count++
    return count
  }, [searchQuery, selectedCategory, selectedStatus, selectedFunction, selectedOrigin, showAdvancedFilters, minSafetyRating, maxCostRating, sustainabilityFilter])

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <Input
          type="text"
          placeholder={placeholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-white/10 border-white/20 text-white placeholder-gray-400"
        />
        {searchQuery && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>

      {/* Filter Controls */}
      {showFilters && (
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardHeader className="pb-3">
            <div className="flex justify-between items-center">
              <CardTitle className="text-white text-sm flex items-center">
                <Filter className="w-4 h-4 mr-2" />
                Filters
                {activeFilterCount > 0 && (
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeFilterCount}
                  </Badge>
                )}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className="text-gray-400 hover:text-white"
                >
                  <SlidersHorizontal className="w-4 h-4 mr-1" />
                  Advanced
                  {showAdvancedFilters ? (
                    <ChevronUp className="w-3 h-3 ml-1" />
                  ) : (
                    <ChevronDown className="w-3 h-3 ml-1" />
                  )}
                </Button>
                {activeFilterCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={resetFilters}
                    className="text-gray-400 hover:text-white"
                  >
                    <RotateCcw className="w-4 h-4 mr-1" />
                    Reset
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-4">
            {/* Basic Filters */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientCategories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label} ({category.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1 block">Status</label>
                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientStatuses.map((status) => (
                      <SelectItem key={status.value} value={status.value}>
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-2 ${
                            status.color === 'green' ? 'bg-green-400' :
                            status.color === 'yellow' ? 'bg-yellow-400' :
                            status.color === 'red' ? 'bg-red-400' : 'bg-gray-400'
                          }`} />
                          {status.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1 block">Function</label>
                <Select value={selectedFunction} onValueChange={setSelectedFunction}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientFunctions.map((func) => (
                      <SelectItem key={func} value={func}>
                        {func}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1 block">Origin</label>
                <Select value={selectedOrigin} onValueChange={setSelectedOrigin}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ingredientOrigins.map((origin) => (
                      <SelectItem key={origin} value={origin}>
                        {origin}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Sort Controls */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-gray-400 text-xs mb-1 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="name">Name</SelectItem>
                    <SelectItem value="category">Category</SelectItem>
                    <SelectItem value="function">Function</SelectItem>
                    <SelectItem value="safety">Safety Rating</SelectItem>
                    <SelectItem value="cost">Cost Rating</SelectItem>
                    <SelectItem value="sustainability">Sustainability</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-gray-400 text-xs mb-1 block">Order</label>
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="asc">Ascending</SelectItem>
                    <SelectItem value="desc">Descending</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Advanced Filters */}
            {showAdvancedFilters && (
              <div className="space-y-4 pt-4 border-t border-white/10">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-gray-400 text-xs mb-2 block">
                      Min Safety Rating: {minSafetyRating}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={minSafetyRating}
                      onChange={(e) => setMinSafetyRating(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-2 block">
                      Max Cost Rating: {maxCostRating}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={maxCostRating}
                      onChange={(e) => setMaxCostRating(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-gray-400 text-xs mb-2 block">
                      Min Sustainability: {sustainabilityFilter}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      value={sustainabilityFilter}
                      onChange={(e) => setSustainabilityFilter(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Low</span>
                      <span>High</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Results Summary */}
      <div className="flex justify-between items-center text-sm">
        <span className="text-gray-400">
          {filteredIngredients.length} ingredient{filteredIngredients.length !== 1 ? 's' : ''} found
        </span>
        {selectedIngredients.length > 0 && (
          <span className="text-blue-400">
            {selectedIngredients.length} in formula
          </span>
        )}
      </div>

      {/* No Results */}
      {filteredIngredients.length === 0 && (
        <Card className="bg-black/20 backdrop-blur-md border-white/10">
          <CardContent className="text-center py-8">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-white text-lg font-semibold mb-2">No ingredients found</h3>
            <p className="text-gray-400 mb-4">
              Try adjusting your search criteria or filters
            </p>
            <Button onClick={resetFilters} variant="outline" className="border-white/20">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


