import React, { createContext, useContext, useState, useEffect } from 'react';
import toast from 'react-hot-toast';

const FormulaContext = createContext();

export const useFormula = () => {
  const context = useContext(FormulaContext);
  if (!context) {
    throw new Error('useFormula must be used within a FormulaProvider');
  }
  return context;
};

export const FormulaProvider = ({ children }) => {
  const [currentFormula, setCurrentFormula] = useState([]);
  const [formulaName, setFormulaName] = useState('Untitled Formula');
  const [formulaType, setFormulaType] = useState('');
  const [complianceScore, setComplianceScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Calculate total percentage
  const totalPercentage = currentFormula.reduce((sum, ingredient) => sum + ingredient.percentage, 0);

  // Add ingredient to formula
  const addIngredient = (ingredient, percentage = 1) => {
    const existingIndex = currentFormula.findIndex(item => item.id === ingredient.id);
    
    if (existingIndex >= 0) {
      toast.error('Ingredient already in formula');
      return;
    }

    if (totalPercentage + percentage > 100) {
      toast.error('Total percentage cannot exceed 100%');
      return;
    }

    const newIngredient = {
      ...ingredient,
      percentage: percentage,
      addedAt: new Date().toISOString()
    };

    setCurrentFormula(prev => [...prev, newIngredient]);
    toast.success(`${ingredient.name} added to formula`);
    
    // Recalculate compliance score
    calculateComplianceScore([...currentFormula, newIngredient]);
  };

  // Remove ingredient from formula
  const removeIngredient = (ingredientId) => {
    const ingredient = currentFormula.find(item => item.id === ingredientId);
    setCurrentFormula(prev => prev.filter(item => item.id !== ingredientId));
    
    if (ingredient) {
      toast.success(`${ingredient.name} removed from formula`);
      calculateComplianceScore(currentFormula.filter(item => item.id !== ingredientId));
    }
  };

  // Update ingredient percentage
  const updateIngredientPercentage = (ingredientId, newPercentage) => {
    const updatedFormula = currentFormula.map(ingredient => {
      if (ingredient.id === ingredientId) {
        return { ...ingredient, percentage: parseFloat(newPercentage) || 0 };
      }
      return ingredient;
    });

    const newTotal = updatedFormula.reduce((sum, ingredient) => sum + ingredient.percentage, 0);
    
    if (newTotal > 100) {
      toast.error('Total percentage cannot exceed 100%');
      return;
    }

    setCurrentFormula(updatedFormula);
    calculateComplianceScore(updatedFormula);
  };

  // Calculate compliance score based on ingredients
  const calculateComplianceScore = (formula) => {
    if (formula.length === 0) {
      setComplianceScore(0);
      return;
    }

    let score = 100;
    let issues = [];

    formula.forEach(ingredient => {
      // Check for restricted ingredients
      if (ingredient.status === 'restricted') {
        score -= 10;
        issues.push(`${ingredient.name} is restricted`);
      }
      
      // Check for banned ingredients
      if (ingredient.status === 'banned') {
        score -= 30;
        issues.push(`${ingredient.name} is banned`);
      }

      // Check concentration limits
      if (ingredient.concentration) {
        const maxConc = parseFloat(ingredient.concentration.replace(/[^\d.]/g, ''));
        if (ingredient.percentage > maxConc) {
          score -= 15;
          issues.push(`${ingredient.name} exceeds maximum concentration`);
        }
      }
    });

    // Check total percentage
    const total = formula.reduce((sum, ingredient) => sum + ingredient.percentage, 0);
    if (total > 100) {
      score -= 20;
      issues.push('Total percentage exceeds 100%');
    }

    setComplianceScore(Math.max(0, score));
    return { score: Math.max(0, score), issues };
  };

  // AI Optimize function
  const aiOptimize = async () => {
    if (currentFormula.length === 0) {
      toast.error('Add ingredients to formula first');
      return;
    }

    setIsAnalyzing(true);
    toast.loading('AI optimizing formula...', { id: 'optimize' });

    try {
      // Simulate AI optimization
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Optimize percentages to reach 100% total
      const optimizedFormula = currentFormula.map((ingredient, index) => {
        let optimizedPercentage;
        
        if (ingredient.function === 'Solvent') {
          // Water should be the remainder
          optimizedPercentage = Math.max(1, 100 - currentFormula.filter(ing => ing.function !== 'Solvent').reduce((sum, ing) => sum + ing.percentage, 0));
        } else if (ingredient.function === 'Active') {
          // Actives should be optimized within safe ranges
          optimizedPercentage = Math.min(ingredient.percentage * 1.2, 5);
        } else {
          // Other ingredients get balanced percentages
          optimizedPercentage = Math.min(ingredient.percentage * 1.1, 10);
        }

        return {
          ...ingredient,
          percentage: Math.round(optimizedPercentage * 100) / 100
        };
      });

      setCurrentFormula(optimizedFormula);
      calculateComplianceScore(optimizedFormula);
      
      toast.success('Formula optimized by AI!', { id: 'optimize' });
    } catch (error) {
      toast.error('Optimization failed', { id: 'optimize' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Check compliance
  const checkCompliance = async () => {
    if (currentFormula.length === 0) {
      toast.error('Add ingredients to formula first');
      return;
    }

    setIsAnalyzing(true);
    toast.loading('Checking compliance...', { id: 'compliance' });

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const result = calculateComplianceScore(currentFormula);
      
      if (result.score >= 90) {
        toast.success(`Compliance check passed! Score: ${result.score}%`, { id: 'compliance' });
      } else if (result.score >= 70) {
        toast.error(`Compliance issues found. Score: ${result.score}%`, { id: 'compliance' });
      } else {
        toast.error(`Major compliance issues! Score: ${result.score}%`, { id: 'compliance' });
      }

      return result;
    } catch (error) {
      toast.error('Compliance check failed', { id: 'compliance' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate report
  const generateReport = async () => {
    if (currentFormula.length === 0) {
      toast.error('Add ingredients to formula first');
      return;
    }

    setIsAnalyzing(true);
    toast.loading('Generating report...', { id: 'report' });

    try {
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      const report = {
        formulaName,
        formulaType,
        ingredients: currentFormula,
        totalPercentage,
        complianceScore,
        generatedAt: new Date().toISOString(),
        recommendations: [
          'Consider adding preservative system',
          'Verify pH compatibility',
          'Test stability at various temperatures'
        ]
      };

      // In a real app, this would download or open the report
      console.log('Generated Report:', report);
      toast.success('Report generated successfully!', { id: 'report' });
      
      return report;
    } catch (error) {
      toast.error('Report generation failed', { id: 'report' });
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Clear formula
  const clearFormula = () => {
    setCurrentFormula([]);
    setFormulaName('Untitled Formula');
    setFormulaType('');
    setComplianceScore(0);
    toast.success('Formula cleared');
  };

  const value = {
    // State
    currentFormula,
    formulaName,
    formulaType,
    complianceScore,
    totalPercentage,
    isAnalyzing,

    // Actions
    addIngredient,
    removeIngredient,
    updateIngredientPercentage,
    setFormulaName,
    setFormulaType,
    aiOptimize,
    checkCompliance,
    generateReport,
    clearFormula,
    calculateComplianceScore
  };

  return (
    <FormulaContext.Provider value={value}>
      {children}
    </FormulaContext.Provider>
  );
};

export default FormulaContext;
