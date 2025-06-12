// PCPC Ingredients Database
export const pcpcIngredients = [
  {
    id: 1,
    name: "WATER",
    casNumber: "7732-18-5",
    function: "Solvent",
    status: "approved",
    description: "Universal solvent, base for most cosmetic formulations",
    restrictions: "None",
    concentration: "Up to 100%",
    category: "Base"
  },
  {
    id: 2,
    name: "GLYCERIN",
    casNumber: "56-81-5",
    function: "Humectant",
    status: "approved",
    description: "Moisturizing agent, helps retain skin moisture",
    restrictions: "None",
    concentration: "Up to 20%",
    category: "Moisturizer"
  },
  {
    id: 3,
    name: "CETYL ALCOHOL",
    casNumber: "36653-82-4",
    function: "Emollient",
    status: "approved",
    description: "Fatty alcohol, provides texture and moisturizing properties",
    restrictions: "None",
    concentration: "Up to 10%",
    category: "Emollient"
  },
  {
    id: 4,
    name: "CYCLOPENTASILOXANE",
    casNumber: "541-02-6",
    function: "Emollient",
    status: "restricted",
    description: "Silicone, provides smooth application and feel",
    restrictions: "EU restrictions apply - environmental concerns",
    concentration: "Up to 5%",
    category: "Silicone"
  },
  {
    id: 5,
    name: "RETINOL",
    casNumber: "68-26-8",
    function: "Anti-aging",
    status: "restricted",
    description: "Vitamin A derivative, anti-aging properties",
    restrictions: "Pregnancy warnings required, concentration limits",
    concentration: "Up to 1%",
    category: "Active"
  },
  {
    id: 6,
    name: "HYALURONIC ACID",
    casNumber: "9067-32-7",
    function: "Humectant",
    status: "approved",
    description: "Powerful moisturizing agent, holds up to 1000x its weight in water",
    restrictions: "None",
    concentration: "Up to 2%",
    category: "Active"
  },
  {
    id: 7,
    name: "NIACINAMIDE",
    casNumber: "98-92-0",
    function: "Anti-aging",
    status: "approved",
    description: "Vitamin B3, improves skin texture and reduces pore appearance",
    restrictions: "None",
    concentration: "Up to 10%",
    category: "Active"
  },
  {
    id: 8,
    name: "SALICYLIC ACID",
    casNumber: "69-72-7",
    function: "Exfoliant",
    status: "approved",
    description: "Beta hydroxy acid, exfoliates and unclogs pores",
    restrictions: "pH restrictions, concentration limits",
    concentration: "Up to 2%",
    category: "Active"
  },
  {
    id: 9,
    name: "TITANIUM DIOXIDE",
    casNumber: "13463-67-7",
    function: "UV Filter",
    status: "approved",
    description: "Mineral sunscreen, provides broad spectrum protection",
    restrictions: "Nano-particle labeling required",
    concentration: "Up to 25%",
    category: "UV Filter"
  },
  {
    id: 10,
    name: "ZINC OXIDE",
    casNumber: "1314-13-2",
    function: "UV Filter",
    status: "approved",
    description: "Mineral sunscreen, provides broad spectrum protection",
    restrictions: "Nano-particle labeling required",
    concentration: "Up to 25%",
    category: "UV Filter"
  },
  {
    id: 11,
    name: "PHENOXYETHANOL",
    casNumber: "122-99-6",
    function: "Preservative",
    status: "approved",
    description: "Broad spectrum preservative, prevents microbial growth",
    restrictions: "Concentration limits",
    concentration: "Up to 1%",
    category: "Preservative"
  },
  {
    id: 12,
    name: "TOCOPHEROL",
    casNumber: "59-02-9",
    function: "Antioxidant",
    status: "approved",
    description: "Vitamin E, antioxidant properties, prevents rancidity",
    restrictions: "None",
    concentration: "Up to 1%",
    category: "Antioxidant"
  }
];

export const ingredientCategories = [
  "All",
  "Base",
  "Active",
  "Emollient", 
  "Moisturizer",
  "UV Filter",
  "Preservative",
  "Antioxidant",
  "Silicone"
];

export const ingredientStatuses = [
  "All",
  "approved",
  "restricted",
  "banned"
];

