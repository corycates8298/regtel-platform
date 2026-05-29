# RegTel

**Cosmetics regulatory intelligence platform** -- formulation workspace with multi-jurisdiction compliance checking.

Built for cosmetics manufacturers and contract labs who need to answer one question fast: "Can I sell this formula in _this_ market?" RegTel checks ingredient-level restrictions across regulatory frameworks and flags problems before you file.

## What it covers

- **FDA / MoCRA** -- US cosmetics regulations under the Modernization of Cosmetics Regulation Act of 2022
- **EU Cosmetics Regulation (EC 1223/2009)** -- Annexes II-VI restricted/prohibited substance lists
- **Health Canada** -- Cosmetic Ingredient Hotlist and labeling requirements
- **ASEAN Cosmetic Directive** -- harmonized ingredient restrictions across Southeast Asian markets

## What's in this repo

Frontend prototype only. React single-page app for formula building, ingredient search, and compliance review.

```
src/
  components/
    CurrentFormula.jsx      # Active formula workspace
    IngredientCard.jsx      # Ingredient display with restriction flags
    IngredientSearch.jsx    # Search against PCPC database
    ui/                     # shadcn/ui component library
  contexts/
    FormulaContext.jsx      # Formula state management
  data/
    pcpcIngredients.js      # PCPC (Personal Care Products Council) ingredient database
  pages/
    Analytics.jsx           # Compliance analytics dashboard
    SupplyChain.jsx         # Supply chain view
```

No backend is included in this repository. The frontend runs standalone with the local PCPC ingredient dataset.

## Stack

- React 18 + Vite
- shadcn/ui (Radix primitives + Tailwind CSS)
- PCPC ingredient database (bundled)
- Railway deployment via nixpacks

## Running locally

```bash
npm install
npm run dev
```

## Status

MVP / frontend prototype. Formula builder and ingredient compliance checking work against the bundled PCPC dataset. Backend regulatory API, real-time monitoring, and multi-user features are not yet implemented.

## Architecture docs

Internal design documents are in the repo root:

- `regtel_architecture_design.md` -- system architecture and data model
- `regtel_implementation_guide.md` -- build plan and implementation notes

## Deployment

Currently deployed on Railway. See `nixpacks.toml` for build configuration.
