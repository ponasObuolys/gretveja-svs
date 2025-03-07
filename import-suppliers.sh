#!/bin/bash

# Nuskaitome tiekėjų sąrašą iš JSON failo
suppliers=$(cat suppliers.json)

# Iteruojame per kiekvieną tiekėją ir siunčiame POST užklausą į API
for row in $(echo "${suppliers}" | jq -r '.[] | @base64'); do
    _jq() {
        echo ${row} | base64 --decode | jq -r ${1}
    }
    
    name=$(_jq '.name')
    
    # Siunčiame POST užklausą į API
    echo "Įkeliamas tiekėjas: $name"
    curl -X POST http://localhost:3001/api/suppliers \
        -H "Content-Type: application/json" \
        -d "{\"name\": \"$name\", \"contactPerson\": \"\", \"phone\": \"\", \"email\": \"\"}" \
        -s | jq .
done

echo "Tiekėjų įkėlimas baigtas!" 