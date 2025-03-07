#!/bin/bash

# Importuoja vilkikus iš CSV failo į duomenų bazę naudojant curl komandas

# Nustatome kintamuosius
CSV_FILE="Vilkikai.csv"
API_URL="http://localhost:3001/api/trucks"

# Tikriname, ar CSV failas egzistuoja
if [ ! -f "$CSV_FILE" ]; then
  echo "Klaida: Failas $CSV_FILE nerastas."
  exit 1
fi

# Tikriname, ar API pasiekiamas
if ! curl -s --head "$API_URL" > /dev/null; then
  echo "Klaida: API $API_URL nepasiekiamas. Įsitikinkite, kad serveris veikia."
  exit 1
fi

# Nustatome įmonių ID
UAB_GRETVEJA_ID=1
GWIND_ID=3
GRETVEJA_DE_ID=4
PARME_TRANS_ID=5

# Skaitome CSV failą ir importuojame vilkikus
echo "Pradedamas vilkikų importavimas..."
count=0
failed=0
total=$(wc -l < "$CSV_FILE")

# Naudojame Python skriptą CSV failui apdoroti
python3 -c '
import csv
import sys

with open("'"$CSV_FILE"'", "r") as file:
    reader = csv.reader(file)
    for row in reader:
        if len(row) >= 2:
            plate = row[0].strip()
            company = row[1].strip()
            print(f"{plate},{company}")
' | while IFS=, read -r plate_number company_name; do
  # Nustatome įmonės ID pagal pavadinimą
  company_id=""
  if [[ "$company_name" == "UAB Gretvėja" ]]; then
    company_id=$UAB_GRETVEJA_ID
  elif [[ "$company_name" == "Gwind" ]]; then
    company_id=$GWIND_ID
  elif [[ "$company_name" == "Gretveja, DE" || "$company_name" == "Gretvėja, DE" ]]; then
    company_id=$GRETVEJA_DE_ID
  elif [[ "$company_name" == "Parme Trans" ]]; then
    company_id=$PARME_TRANS_ID
  fi
  
  # Tikriname, ar įmonė rasta
  if [ -n "$company_id" ]; then
    # Sukuriame vilkiką (tik su valstybinių numeriu ir įmonės ID)
    response=$(curl -s -X POST "$API_URL" \
      -H "Content-Type: application/json" \
      -d "{\"plateNumber\": \"$plate_number\", \"companyId\": $company_id}")
    
    # Tikriname, ar pavyko sukurti vilkiką
    if echo "$response" | grep -q "id"; then
      count=$((count + 1))
      echo "[$count/$total] Sukurtas vilkikas: $plate_number (Įmonė: $company_name, ID: $company_id)"
    else
      failed=$((failed + 1))
      echo "Klaida kuriant vilkiką $plate_number: $response"
    fi
  else
    failed=$((failed + 1))
    echo "Klaida: Nežinoma įmonė '$company_name'. Praleistas vilkikas: $plate_number"
  fi
done

echo "Importavimas baigtas. Iš viso importuota: $count vilkikų. Nepavyko importuoti: $failed vilkikų." 