# Duomenų bazės informacija

> **SVARBU**: Projektas buvo atnaujintas ir dabar naudoja tik Supabase duomenų bazę. Lokali PostgreSQL duomenų bazė nebėra naudojama.

## Supabase duomenų bazės struktūra

Šiame projekte naudojama Supabase duomenų bazė su šiomis lentelėmis:

### Companies (Įmonės)
- **Lentelė**: `companies`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `name` - Įmonės pavadinimas
  - `code` - Įmonės kodas
  - `vat_code` - PVM mokėtojo kodas
  - `created_at` - Sukūrimo data
  - `updated_at` - Atnaujinimo data

### Products (Produktai)
- **Lentelė**: `products`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `name` - Produkto pavadinimas lietuvių kalba
  - `name_en` - Produkto pavadinimas anglų kalba
  - `name_ru` - Produkto pavadinimas rusų kalba
  - `unit` - Matavimo vienetas
  - `created_at` - Sukūrimo data
  - `updated_at` - Atnaujinimo data

### Suppliers (Tiekėjai)
- **Lentelė**: `suppliers`
- **Laukai**:
  - `name` - Tiekėjo pavadinimas
  - `contact_person` - Kontaktinis asmuo
  - `phone` - Telefono numeris
  - `email` - El. pašto adresas
  - `created_at` - Sukūrimo data
  - `updated_at` - Atnaujinimo data

### Trucks (Vilkikai)
- **Lentelė**: `trucks`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `plate_number` - Valstybinis numeris
  - `company_id` - Įmonės ID (FK į `companies` lentelę)
  - `created_at` - Sukūrimo data
  - `updated_at` - Atnaujinimo data

### Purchases (Pirkimai)
- **Lentelė**: `purchases`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `invoice_number` - Sąskaitos faktūros numeris
  - `product_id` - Produkto ID (FK į `products` lentelę)
  - `supplier_id` - Tiekėjo ID (FK į `suppliers` lentelę)
  - `quantity` - Kiekis
  - `purchase_date` - Pirkimo data
  - `unit_price` - Vieneto kaina
  - `company_id` - Įmonės ID (FK į `companies` lentelę)
  - `total_amount` - Bendra suma
  - `created_at` - Sukūrimo data
  - `updated_at` - Atnaujinimo data

### Issuances (Išdavimai)
- **Lentelė**: `issuances`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `product_id` - Produkto ID (FK į `products` lentelę)
  - `is_issued` - Ar išduota (boolean)
  - `issuance_date` - Išdavimo data
  - `quantity` - Kiekis
  - `driver_name` - Vairuotojo vardas
  - `truck_id` - Vilkiko ID (FK į `trucks` lentelę)
  - `notes` - Pastabos
  - `created_at` - Sukūrimo data
  - `updated_at` - Atnaujinimo data

### Stocks (Atsargos)
- **Lentelė**: `stocks`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `product_id` - Produkto ID (FK į `products` lentelę)
  - `quantity` - Kiekis
  - `location` - Vieta
  - `last_updated` - Paskutinio atnaujinimo data

## API Endpointai

### Produktų API
- **GET /api/products** - Gauti visus produktus
- **GET /api/products/:id** - Gauti produktą pagal ID
- **POST /api/products** - Sukurti naują produktą
- **PUT /api/products/:id** - Atnaujinti produktą
- **DELETE /api/products/:id** - Ištrinti produktą

### Tiekėjų API
- **GET /api/suppliers** - Gauti visus tiekėjus
- **GET /api/suppliers/:id** - Gauti tiekėją pagal ID
- **POST /api/suppliers** - Sukurti naują tiekėją
- **PUT /api/suppliers/:id** - Atnaujinti tiekėją
- **DELETE /api/suppliers/:id** - Ištrinti tiekėją

### Įmonių API
- **GET /api/companies** - Gauti visas įmones
- **GET /api/companies/:id** - Gauti įmonę pagal ID
- **POST /api/companies** - Sukurti naują įmonę
- **PUT /api/companies/:id** - Atnaujinti įmonę
- **DELETE /api/companies/:id** - Ištrinti įmonę

### Vilkikų API
- **GET /api/trucks** - Gauti visus vilkikus
- **GET /api/trucks/:id** - Gauti vilkiką pagal ID
- **POST /api/trucks** - Sukurti naują vilkiką
- **PUT /api/trucks/:id** - Atnaujinti vilkiką
- **DELETE /api/trucks/:id** - Ištrinti vilkiką

### Pirkimų API
- **GET /api/purchases** - Gauti visus pirkimus
- **GET /api/purchases/:id** - Gauti pirkimą pagal ID
- **POST /api/purchases** - Sukurti naują pirkimą
- **PUT /api/purchases/:id** - Atnaujinti pirkimą
- **DELETE /api/purchases/:id** - Ištrinti pirkimą

### Išdavimų API
- **GET /api/issuances** - Gauti visus išdavimus
- **GET /api/issuances/:id** - Gauti išdavimą pagal ID
- **POST /api/issuances** - Sukurti naują išdavimą
- **PUT /api/issuances/:id** - Atnaujinti išdavimą
- **DELETE /api/issuances/:id** - Ištrinti išdavimą
- **GET /api/issuances/:id/pdf** - Generuoti išdavimo PDF 