-- =====================================================
-- REGTEL DATABASE MIGRATION - UUID TO BIGINT FIX
-- This script handles the existing UUID table and converts it to BIGINT
-- =====================================================

-- Step 1: Drop existing foreign key constraints that are causing issues
DO $$ 
BEGIN
    -- Drop the problematic foreign key constraint if it exists
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'regulatory_change_sources_jurisdiction_id_fkey'
    ) THEN
        ALTER TABLE public.regulatory_change_sources 
        DROP CONSTRAINT regulatory_change_sources_jurisdiction_id_fkey;
    END IF;
    
    -- Drop other related foreign key constraints
    IF EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE constraint_name = 'regulatory_frameworks_jurisdiction_id_fkey'
    ) THEN
        ALTER TABLE public.regulatory_frameworks 
        DROP CONSTRAINT regulatory_frameworks_jurisdiction_id_fkey;
    END IF;
END $$;

-- Step 2: Backup existing jurisdiction data if table exists
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'jurisdictions') THEN
        -- Create backup table
        DROP TABLE IF EXISTS public.jurisdictions_backup;
        CREATE TABLE public.jurisdictions_backup AS SELECT * FROM public.jurisdictions;
        
        -- Drop the existing table
        DROP TABLE public.jurisdictions CASCADE;
    END IF;
END $$;

-- Step 3: Create the jurisdictions table with correct BIGINT data type
CREATE TABLE public.jurisdictions (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    code VARCHAR(10) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    region VARCHAR(100),
    regulatory_body VARCHAR(255),
    compliance_complexity INTEGER DEFAULT 1,
    api_endpoint TEXT,
    update_frequency INTEGER DEFAULT 24,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 4: Create regulatory_frameworks table with proper foreign key
DROP TABLE IF EXISTS public.regulatory_frameworks CASCADE;
CREATE TABLE public.regulatory_frameworks (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jurisdiction_id BIGINT REFERENCES public.jurisdictions(id),
    framework_name VARCHAR(255) NOT NULL,
    framework_code VARCHAR(50),
    effective_date DATE,
    description TEXT,
    requirements JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 5: Recreate regulatory_change_sources table with correct foreign key
DROP TABLE IF EXISTS public.regulatory_change_sources CASCADE;
CREATE TABLE public.regulatory_change_sources (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    jurisdiction_id BIGINT REFERENCES public.jurisdictions(id),
    source_name VARCHAR(255) NOT NULL,
    source_url TEXT,
    source_type VARCHAR(100),
    monitoring_frequency INTEGER DEFAULT 24,
    last_checked TIMESTAMPTZ,
    parsing_rules JSONB,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Step 6: Insert all jurisdiction data
INSERT INTO public.jurisdictions (code, name, region, regulatory_body, compliance_complexity, api_endpoint, update_frequency) VALUES
-- North America
('US', 'United States', 'North America', 'FDA', 8, 'https://api.fda.gov', 24),
('CA', 'Canada', 'North America', 'Health Canada', 6, 'https://health-products.canada.ca/api', 24),
('MX', 'Mexico', 'North America', 'COFEPRIS', 5, 'https://www.gob.mx/cofepris/api', 48),
('CA-CA', 'California', 'North America', 'California State', 10, 'https://oehha.ca.gov/api', 12),

-- Europe
('EU', 'European Union', 'Europe', 'European Commission', 9, 'https://ec.europa.eu/growth/tools-databases/cosing/api', 24),
('GB', 'United Kingdom', 'Europe', 'MHRA', 7, 'https://www.gov.uk/mhra/api', 24),
('CH', 'Switzerland', 'Europe', 'Swissmedic', 6, 'https://www.swissmedic.ch/api', 48),
('NO', 'Norway', 'Europe', 'Norwegian Medicines Agency', 5, 'https://legemiddelverket.no/api', 48),
('IS', 'Iceland', 'Europe', 'Icelandic Medicines Agency', 4, 'https://lyfjastofnun.is/api', 72),
('TR', 'Turkey', 'Europe', 'Turkish Medicines Agency', 6, 'https://www.titck.gov.tr/api', 48),
('RU', 'Russia', 'Europe', 'Roszdravnadzor', 7, 'https://roszdravnadzor.gov.ru/api', 48),
('UA', 'Ukraine', 'Europe', 'State Service of Ukraine', 5, 'https://www.dls.gov.ua/api', 72),

-- Asia-Pacific
('CN', 'China', 'Asia', 'NMPA', 9, 'https://www.nmpa.gov.cn/api', 24),
('JP', 'Japan', 'Asia', 'MHLW', 7, 'https://www.mhlw.go.jp/api', 24),
('KR', 'South Korea', 'Asia', 'K-FDA', 6, 'https://www.mfds.go.kr/api', 24),
('IN', 'India', 'Asia', 'CDSCO', 6, 'https://cdsco.gov.in/api', 48),
('AU', 'Australia', 'Oceania', 'TGA', 5, 'https://www.tga.gov.au/api', 24),
('NZ', 'New Zealand', 'Oceania', 'Medsafe', 4, 'https://www.medsafe.govt.nz/api', 48),
('SG', 'Singapore', 'Asia', 'HSA', 5, 'https://www.hsa.gov.sg/api', 24),
('MY', 'Malaysia', 'Asia', 'NPRA', 4, 'https://www.npra.gov.my/api', 48),
('TH', 'Thailand', 'Asia', 'FDA Thailand', 4, 'https://www.fda.moph.go.th/api', 48),
('PH', 'Philippines', 'Asia', 'FDA Philippines', 4, 'https://www.fda.gov.ph/api', 48),
('ID', 'Indonesia', 'Asia', 'BPOM', 5, 'https://www.pom.go.id/api', 48),
('VN', 'Vietnam', 'Asia', 'MOH Vietnam', 4, 'https://moh.gov.vn/api', 72),
('TW', 'Taiwan', 'Asia', 'TFDA', 5, 'https://www.fda.gov.tw/api', 48),
('HK', 'Hong Kong', 'Asia', 'Department of Health', 4, 'https://www.dh.gov.hk/api', 48),

-- Middle East & Africa
('AE', 'United Arab Emirates', 'Middle East', 'MOHAP', 5, 'https://www.mohap.gov.ae/api', 48),
('SA', 'Saudi Arabia', 'Middle East', 'SFDA', 6, 'https://www.sfda.gov.sa/api', 48),
('IL', 'Israel', 'Middle East', 'Ministry of Health', 5, 'https://www.health.gov.il/api', 48),
('ZA', 'South Africa', 'Africa', 'SAHPRA', 5, 'https://www.sahpra.org.za/api', 72),
('EG', 'Egypt', 'Africa', 'EDA', 4, 'https://www.eda.mohp.gov.eg/api', 72),
('MA', 'Morocco', 'Africa', 'Ministry of Health', 4, 'https://www.sante.gov.ma/api', 72),
('NG', 'Nigeria', 'Africa', 'NAFDAC', 4, 'https://www.nafdac.gov.ng/api', 72),
('KE', 'Kenya', 'Africa', 'Pharmacy and Poisons Board', 3, 'https://web.pharmacyboardkenya.org/api', 72),

-- South America
('BR', 'Brazil', 'South America', 'ANVISA', 7, 'https://www.gov.br/anvisa/api', 24),
('AR', 'Argentina', 'South America', 'ANMAT', 5, 'https://www.argentina.gob.ar/anmat/api', 48),
('CL', 'Chile', 'South America', 'ISP', 4, 'https://www.ispch.cl/api', 48),
('CO', 'Colombia', 'South America', 'INVIMA', 4, 'https://www.invima.gov.co/api', 48),
('PE', 'Peru', 'South America', 'DIGEMID', 3, 'https://www.digemid.minsa.gob.pe/api', 72),
('UY', 'Uruguay', 'South America', 'MSP', 3, 'https://www.gub.uy/ministerio-salud-publica/api', 72),
('EC', 'Ecuador', 'South America', 'ARCSA', 3, 'https://www.controlsanitario.gob.ec/api', 72),

-- Additional Asian Markets
('BD', 'Bangladesh', 'Asia', 'DGDA', 3, 'https://www.dgda.gov.bd/api', 72),
('PK', 'Pakistan', 'Asia', 'DRAP', 3, 'https://www.drap.gov.pk/api', 72),
('LK', 'Sri Lanka', 'Asia', 'NMRA', 3, 'https://www.nmra.gov.lk/api', 72),
('MM', 'Myanmar', 'Asia', 'FDA Myanmar', 2, 'https://www.fda.gov.mm/api', 168),
('KH', 'Cambodia', 'Asia', 'DDF', 2, 'https://www.ddf.gov.kh/api', 168),
('LA', 'Laos', 'Asia', 'FDA Laos', 2, 'https://www.fdd.gov.la/api', 168),

-- European Additional Markets
('SE', 'Sweden', 'Europe', 'Medical Products Agency', 5, 'https://www.lakemedelsverket.se/api', 48),
('DK', 'Denmark', 'Europe', 'Danish Medicines Agency', 5, 'https://www.dkma.dk/api', 48),
('FI', 'Finland', 'Europe', 'Fimea', 5, 'https://www.fimea.fi/api', 48),
('NL', 'Netherlands', 'Europe', 'CBG-MEB', 6, 'https://www.cbg-meb.nl/api', 48),
('BE', 'Belgium', 'Europe', 'FAMHP', 5, 'https://www.famhp.be/api', 48),
('AT', 'Austria', 'Europe', 'AGES', 5, 'https://www.ages.at/api', 48),
('IT', 'Italy', 'Europe', 'AIFA', 6, 'https://www.aifa.gov.it/api', 48),
('ES', 'Spain', 'Europe', 'AEMPS', 6, 'https://www.aemps.gob.es/api', 48),
('FR', 'France', 'Europe', 'ANSM', 7, 'https://www.ansm.sante.fr/api', 48),
('DE', 'Germany', 'Europe', 'BfArM', 7, 'https://www.bfarm.de/api', 48),
('PL', 'Poland', 'Europe', 'Office for Registration', 5, 'https://www.urpl.gov.pl/api', 48),
('CZ', 'Czech Republic', 'Europe', 'SUKL', 4, 'https://www.sukl.cz/api', 48),
('HU', 'Hungary', 'Europe', 'OGYÉI', 4, 'https://www.ogyei.gov.hu/api', 48),
('RO', 'Romania', 'Europe', 'ANMDMR', 4, 'https://www.anm.ro/api', 72),
('BG', 'Bulgaria', 'Europe', 'BDA', 3, 'https://www.bda.bg/api', 72),
('HR', 'Croatia', 'Europe', 'HALMED', 4, 'https://www.halmed.hr/api', 72),
('SI', 'Slovenia', 'Europe', 'JAZMP', 4, 'https://www.jazmp.si/api', 72),
('SK', 'Slovakia', 'Europe', 'SIDC', 4, 'https://www.sukl.sk/api', 72);

-- Step 7: Insert regulatory frameworks
INSERT INTO public.regulatory_frameworks (jurisdiction_id, framework_name, framework_code, effective_date, description, requirements) VALUES
-- US Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'US'), 'Modernization of Cosmetics Regulation Act', 'MoCRA', '2022-12-29', 'Comprehensive cosmetics regulation requiring facility registration and product listing', 
'{"facility_registration": true, "product_listing": true, "safety_substantiation": true, "adverse_event_reporting": true, "labeling_requirements": true}'),

((SELECT id FROM public.jurisdictions WHERE code = 'US'), 'Federal Food Drug and Cosmetic Act', 'FD&C Act', '1938-06-25', 'Primary federal law governing cosmetics safety and labeling',
'{"safety_requirements": true, "labeling_standards": true, "color_additive_approval": true, "prohibited_ingredients": true}'),

-- California Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'CA-CA'), 'California Safe Cosmetics Act', 'SB 484', '2020-01-01', 'Requires disclosure of fragrance allergens in cosmetics',
'{"fragrance_disclosure": true, "allergen_labeling": true, "ingredient_transparency": true}'),

((SELECT id FROM public.jurisdictions WHERE code = 'CA-CA'), 'California Proposition 65', 'Prop 65', '1986-11-04', 'Requires warnings for products containing chemicals known to cause cancer or reproductive harm',
'{"warning_labels": true, "chemical_disclosure": true, "safe_harbor_levels": true}'),

((SELECT id FROM public.jurisdictions WHERE code = 'CA-CA'), 'California PFAS Ban', 'AB 2762', '2022-09-29', 'Prohibits PFAS in cosmetics starting January 1, 2025',
'{"pfas_prohibition": true, "testing_requirements": true, "compliance_certification": true}'),

-- EU Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'EU'), 'Cosmetics Regulation', 'EU 1223/2009', '2013-07-11', 'EU regulation on cosmetic products',
'{"cpnp_notification": true, "pif_requirements": true, "responsible_person": true, "safety_assessment": true, "labeling_requirements": true}'),

((SELECT id FROM public.jurisdictions WHERE code = 'EU'), 'REACH Regulation', 'EU 1907/2006', '2007-06-01', 'Registration, Evaluation, Authorization of Chemicals',
'{"chemical_registration": true, "safety_data_sheets": true, "authorization_requirements": true}'),

-- China Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'CN'), 'Cosmetic Supervision and Administration Regulation', 'CSAR', '2021-01-01', 'China cosmetics regulation framework',
'{"product_registration": true, "facility_licensing": true, "ingredient_approval": true, "animal_testing": true}'),

-- Japan Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'JP'), 'Pharmaceutical and Medical Device Act', 'PMDA', '2014-11-25', 'Japanese cosmetics regulation',
'{"product_notification": true, "ingredient_standards": true, "labeling_requirements": true, "manufacturing_standards": true}'),

-- South Korea Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'KR'), 'Cosmetics Act', 'K-Beauty Act', '2020-08-28', 'Korean cosmetics regulation',
'{"product_notification": true, "safety_standards": true, "functional_cosmetics": true, "labeling_requirements": true}'),

-- Brazil Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'BR'), 'ANVISA Cosmetics Regulation', 'RDC 07/2015', '2015-02-10', 'Brazilian cosmetics regulation',
'{"product_notification": true, "good_manufacturing_practices": true, "safety_assessment": true, "labeling_requirements": true}'),

-- Canada Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'CA'), 'Cosmetic Regulations', 'CRC c.869', '1987-01-01', 'Canadian cosmetics regulation under Food and Drugs Act',
'{"product_notification": true, "ingredient_restrictions": true, "labeling_requirements": true, "safety_assessment": true}'),

-- Australia Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'AU'), 'Therapeutic Goods Administration', 'TGA Guidelines', '1989-02-15', 'Australian cosmetics regulation',
'{"product_listing": true, "ingredient_approval": true, "labeling_requirements": true, "advertising_standards": true}'),

-- India Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'IN'), 'Drugs and Cosmetics Act', 'DCA 1940', '1940-04-10', 'Indian cosmetics regulation',
'{"manufacturing_license": true, "product_approval": true, "import_license": true, "labeling_requirements": true}'),

-- Singapore Frameworks
((SELECT id FROM public.jurisdictions WHERE code = 'SG'), 'Health Products Act', 'HPA', '2007-11-01', 'Singapore cosmetics regulation',
'{"product_notification": true, "safety_assessment": true, "labeling_requirements": true, "advertising_standards": true}');

-- Step 8: Insert regulatory monitoring sources
INSERT INTO public.regulatory_change_sources (jurisdiction_id, source_name, source_url, source_type, monitoring_frequency) VALUES
((SELECT id FROM public.jurisdictions WHERE code = 'US'), 'FDA Cosmetics Guidance', 'https://www.fda.gov/cosmetics/guidance-regulation-law-policy-cosmetics', 'website', 24),
((SELECT id FROM public.jurisdictions WHERE code = 'US'), 'Federal Register', 'https://www.federalregister.gov/agencies/food-and-drug-administration', 'rss', 12),
((SELECT id FROM public.jurisdictions WHERE code = 'EU'), 'EU CPNP Updates', 'https://ec.europa.eu/growth/tools-databases/cosing/', 'website', 24),
((SELECT id FROM public.jurisdictions WHERE code = 'EU'), 'European Commission Cosmetics', 'https://ec.europa.eu/growth/sectors/cosmetics/', 'website', 48),
((SELECT id FROM public.jurisdictions WHERE code = 'CN'), 'NMPA Announcements', 'https://www.nmpa.gov.cn/', 'website', 24),
((SELECT id FROM public.jurisdictions WHERE code = 'CA-CA'), 'OEHHA Prop 65', 'https://oehha.ca.gov/proposition-65', 'website', 12),
((SELECT id FROM public.jurisdictions WHERE code = 'CA-CA'), 'California Legislature', 'https://leginfo.legislature.ca.gov/', 'website', 24),
((SELECT id FROM public.jurisdictions WHERE code = 'JP'), 'MHLW Notifications', 'https://www.mhlw.go.jp/', 'website', 48),
((SELECT id FROM public.jurisdictions WHERE code = 'KR'), 'K-FDA Announcements', 'https://www.mfds.go.kr/', 'website', 48),
((SELECT id FROM public.jurisdictions WHERE code = 'BR'), 'ANVISA Updates', 'https://www.gov.br/anvisa/', 'website', 48),
((SELECT id FROM public.jurisdictions WHERE code = 'CA'), 'Health Canada Cosmetics', 'https://health-products.canada.ca/cosmetic/', 'website', 48),
((SELECT id FROM public.jurisdictions WHERE code = 'AU'), 'TGA Cosmetics', 'https://www.tga.gov.au/products/cosmetics', 'website', 48),
((SELECT id FROM public.jurisdictions WHERE code = 'IN'), 'CDSCO Notifications', 'https://cdsco.gov.in/', 'website', 72),
((SELECT id FROM public.jurisdictions WHERE code = 'SG'), 'HSA Updates', 'https://www.hsa.gov.sg/', 'website', 48);

-- Step 9: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_jurisdictions_code ON public.jurisdictions(code);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_region ON public.jurisdictions(region);
CREATE INDEX IF NOT EXISTS idx_jurisdictions_complexity ON public.jurisdictions(compliance_complexity);
CREATE INDEX IF NOT EXISTS idx_regulatory_frameworks_jurisdiction ON public.regulatory_frameworks(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_frameworks_code ON public.regulatory_frameworks(framework_code);
CREATE INDEX IF NOT EXISTS idx_regulatory_change_sources_jurisdiction ON public.regulatory_change_sources(jurisdiction_id);
CREATE INDEX IF NOT EXISTS idx_regulatory_change_sources_active ON public.regulatory_change_sources(is_active, last_checked);

-- Step 10: Verification
SELECT 
    'SUCCESS: Foreign key constraints created successfully' as status,
    COUNT(*) as jurisdiction_count
FROM public.jurisdictions;

SELECT 
    'SUCCESS: Regulatory frameworks linked' as status,
    COUNT(*) as framework_count
FROM public.regulatory_frameworks;

SELECT 
    'SUCCESS: Monitoring sources linked' as status,
    COUNT(*) as source_count
FROM public.regulatory_change_sources;

COMMIT;

