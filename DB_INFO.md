# Duomenų bazės informacija

## Lentelės ir jų struktūra

### Suppliers (Tiekėjai)
- **Lentelė**: `suppliers`
- **Modelis**: `Supplier.ts`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `name` - Tiekėjo pavadinimas
  - `contactPerson` - Kontaktinis asmuo
  - `phone` - Telefono numeris
  - `email` - El. pašto adresas
  - `createdAt` - Sukūrimo data
  - `updatedAt` - Atnaujinimo data
- **API Endpoint**: `http://localhost:3001/api/suppliers`
- **Importavimo skriptas**: `import-suppliers.sh`
- **Įrašų skaičius**: 13 tiekėjai

### Products (Produktai)
- **Lentelė**: `products`
- **Modelis**: `Product.ts`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `code` - Produkto kodas (pvz., GRT001)
  - `name` - Produkto pavadinimas lietuvių kalba
  - `nameEn` - Produkto pavadinimas anglų kalba
  - `nameRu` - Produkto pavadinimas rusų kalba
  - `description` - Produkto aprašymas (gali būti null)
  - `unit` - Matavimo vienetas (pvz., vnt)
  - `createdAt` - Sukūrimo data
  - `updatedAt` - Atnaujinimo data
- **API Endpoint**: `http://localhost:3001/api/products`
- **Importavimo skriptas**: `import-products.sh`
- **Įrašų skaičius**: 187 produktai

### Companies (Įmonės)
- **Lentelė**: `companies`
- **Modelis**: `Company.ts`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `name` - Įmonės pavadinimas
  - `createdAt` - Sukūrimo data
  - `updatedAt` - Atnaujinimo data
- **API Endpoint**: `http://localhost:3001/api/companies`
- **Įrašų skaičius**: 4 įmonės
  - "UAB Gretvėja" (ID: 1)
  - "Gwind" (ID: 3)
  - "Gretvėja, DE" (ID: 4)
  - "Parme Trans" (ID: 5)

### Trucks (Vilkikai)
- **Lentelė**: `trucks`
- **Modelis**: `Truck.ts`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `plateNumber` - Valstybinis numeris
  - `model` - Vilkiko modelis
  - `companyId` - Įmonės ID (FK į `companies` lentelę)
  - `createdAt` - Sukūrimo data
  - `updatedAt` - Atnaujinimo data
- **API Endpoint**: `http://localhost:3001/api/trucks`
- **Įrašų skaičius**: 9 vilkikai (sukurti rankiniu būdu)

### Purchases (Pirkimai)
- **Lentelė**: `purchases`
- **Modelis**: `Purchase.ts`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `productId` - Produkto ID (FK į `products` lentelę)
  - `supplierId` - Tiekėjo ID (FK į `suppliers` lentelę)
  - `quantity` - Kiekis
  - `unitPrice` - Vieneto kaina
  - `purchaseDate` - Pirkimo data
  - `invoiceNumber` - Sąskaitos faktūros numeris
  - `notes` - Pastabos
  - `createdAt` - Sukūrimo data
  - `updatedAt` - Atnaujinimo data
- **API Endpoint**: `http://localhost:3001/api/purchases`

### Issuances (Išdavimai)
- **Lentelė**: `issuances`
- **Modelis**: `Issuance.ts`
- **Laukai**:
  - `id` - Unikalus identifikatorius (PK)
  - `productId` - Produkto ID (FK į `products` lentelę)
  - `quantity` - Kiekis
  - `issuanceDate` - Išdavimo data
  - `driverName` - Vairuotojo vardas
  - `truckId` - Vilkiko ID (FK į `trucks` lentelę)
  - `companyId` - Įmonės ID (FK į `companies` lentelę)
  - `isIssued` - Ar išduota (boolean)
  - `notes` - Pastabos
  - `createdAt` - Sukūrimo data
  - `updatedAt` - Atnaujinimo data
- **API Endpoint**: `http://localhost:3001/api/issuances`
- **PDF generavimas**: `http://localhost:3001/api/issuances/:id/pdf`

## Importavimo skriptai

### import-suppliers.sh
Šis skriptas importuoja tiekėjus iš `suppliers.json` failo į duomenų bazę. Jis naudoja `curl` komandą, kad siųstų POST užklausas į API.

### import-products.sh
Šis skriptas importuoja produktus iš `produktai.csv` failo į duomenų bazę. Jis naudoja `curl` komandą, kad siųstų POST užklausas į API.

## Administravimo puslapis

Admin puslapyje (`/admin`) galima valdyti:
- Vilkikus (pridėti, redaguoti, ištrinti)
- Produktus (pridėti, redaguoti, ištrinti)
- Tiekėjus (pridėti, redaguoti, ištrinti)

## Duomenų bazės prisijungimo informacija

- **Duomenų bazės pavadinimas**: `gretveja_svs`
- **Vartotojo vardas**: `postgres`
- **Slaptažodis**: Nustatytas Docker aplinkoje
- **Hostas**: `postgres` (Docker tinkle) arba `localhost` (lokaliai)
- **Portas**: `5432`

## Naudingos komandos

### Patikrinti įrašų skaičių lentelėje
```bash
docker exec gretveja-svs-postgres psql -U postgres -d gretveja_svs -c "SELECT COUNT(*) FROM suppliers;"
docker exec gretveja-svs-postgres psql -U postgres -d gretveja_svs -c "SELECT COUNT(*) FROM products;"
docker exec gretveja-svs-postgres psql -U postgres -d gretveja_svs -c "SELECT COUNT(*) FROM trucks;"
```

### Gauti visus įrašus iš API
```bash
curl -s http://localhost:3001/api/suppliers
curl -s http://localhost:3001/api/products
curl -s http://localhost:3001/api/trucks
```

### Paleisti importavimo skriptus
```bash
chmod +x import-suppliers.sh && ./import-suppliers.sh
chmod +x import-products.sh && ./import-products.sh
``` 