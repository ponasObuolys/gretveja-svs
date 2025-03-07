#!/bin/bash

# Ištrinti hardcoded tiekėją "UAB Padangų tiekėjas"
echo "Ieškomas hardcoded tiekėjas 'UAB Padangų tiekėjas'..."
SUPPLIER_ID=$(curl -s http://localhost:3001/api/suppliers | jq '.[] | select(.name=="UAB Padangų tiekėjas") | .id')

if [ ! -z "$SUPPLIER_ID" ]; then
  echo "Trinamas tiekėjas ID: $SUPPLIER_ID"
  curl -X DELETE http://localhost:3001/api/suppliers/$SUPPLIER_ID
  echo "Tiekėjas ištrintas."
else
  echo "Tiekėjas 'UAB Padangų tiekėjas' nerastas."
fi

# Ištrinti hardcoded produktą "Padangos"
echo "Ieškomas hardcoded produktas 'Padangos'..."
PRODUCT_ID=$(curl -s http://localhost:3001/api/products | jq '.[] | select(.name=="Padangos") | .id')

if [ ! -z "$PRODUCT_ID" ]; then
  echo "Trinamas produktas ID: $PRODUCT_ID"
  curl -X DELETE http://localhost:3001/api/products/$PRODUCT_ID
  echo "Produktas ištrintas."
else
  echo "Produktas 'Padangos' nerastas."
fi

# Įkelti produktus iš CSV failo
echo "Pradedamas produktų įkėlimas iš CSV failo..."

# Praleisti antraštės eilutę ir iteruoti per kiekvieną eilutę
tail -n +2 produktai.csv | while IFS=, read -r code name nameEn nameRu; do
  # Pašalinti kabutes, jei jos yra
  name=$(echo "$name" | sed 's/^"//;s/"$//')
  nameEn=$(echo "$nameEn" | sed 's/^"//;s/"$//')
  nameRu=$(echo "$nameRu" | sed 's/^"//;s/"$//')
  
  echo "Įkeliamas produktas: $code - $name"
  
  # Sukurti JSON objektą ir išsiųsti POST užklausą
  JSON_DATA=$(jq -n \
    --arg code "$code" \
    --arg name "$name" \
    --arg nameEn "$nameEn" \
    --arg nameRu "$nameRu" \
    --arg unit "vnt" \
    '{code: $code, name: $name, nameEn: $nameEn, nameRu: $nameRu, unit: $unit}')
  
  curl -X POST http://localhost:3001/api/products \
    -H "Content-Type: application/json" \
    -d "$JSON_DATA" \
    -s > /dev/null
done

echo "Produktų įkėlimas baigtas!" 