# Gretvėja-SVS Roadmap

Šiame dokumente aprašomi projekto etapai, užduotys ir reikalavimai, kad sukurtume funkcionalų sandėlio valdymo įrankį.

---

## 1. Projekto tikslai ir apžvalga

- **Projekto pavadinimas**: Gretvėja-SVS
- **Pagrindinis tikslas**: Sukurti paprastą, patogų ir lengvai prižiūrimą sandėlio valdymo įrankį, kuris:
  1. Leistų fiksuoti pirkimus (Pirkimai).
  2. Leistų registruoti prekių išdavimus (Išdavimai) ir generuoti perdavimo aktus.
  3. Teiktų ataskaitas apie bendrą prekių balansą (Atidavimai/atsargos).

---

## 2. Projekto fazės

### 2.1 Planavimas (Project Setup) ✅
1. **Tech Stack pasirinkimas** ✅
   - Backend: Node.js (Express) su TypeScript.  
   - Duomenų bazė: PostgreSQL.  
   - ORM: Sequelize.  
   - Frontend: React su TypeScript.  
   - UI biblioteka: Bootstrap + React Bootstrap.  
   - PDF generavimas: pdfkit.  
   - Konteinerizacija: Docker + Docker Compose.  
2. **Projekto struktūros sukūrimas** ✅
   - /backend:  
     - server.ts  
     - /models  
     - /controllers  
     - /routes  
     - /utils  
   - /frontend:  
     - /src  
       - /components  
       - /pages  
       - /utils  
   - Docker failai, README, ROADMAP.  
3. **Versijavimo aplinka** ✅
   - Naudoti Git.  
4. **CI/CD integracija** (galima vėlesnėse fazėse).

---

### 2.2 Duomenų bazės modeliavimas ✅

1. **Pagrindinės lentelės**:  
   - **Products** (prekių sąrašas) ✅
   - **Suppliers** (tiekėjai) ✅
   - **Companies** (4 logistikos įmonės) ✅
   - **Trucks** (vilkikai) ✅
   - **Purchases** (pirkimai) ✅
   - **Issuances** (išdavimai) ✅
   - **Users** (jei reikalinga autentifikacija) ⏳

---

### 2.3 API kūrimas ✅

1. **Bendras REST API** ✅
   - Pirkimų API (`/api/purchases`) ✅
   - Išdavimų API (`/api/issuances`) ✅
   - Atsargų API (`/api/stocks`) ✅
   - Produktų API (`/api/products`) ✅
   - Tiekėjų API (`/api/suppliers`) ✅
   - Įmonių API (`/api/companies`) ✅
   - Vilkikų API (`/api/trucks`) ✅

2. **PDF generavimas** ✅
   - `GET /api/issuances/:id/pdf` – grąžina sugeneruotą PDF failą (perdavimo aktą) ✅

3. **Autentifikacija** (pasirinktinai) ⏳

---

### 2.4 Frontend kūrimas ⏳

1. **Puslapiai (pages)** ⏳
   - **Home** ✅
   - **Purchases** ✅
   - **Issuances** ✅
   - **Admin** ✅
   - **Stocks** ✅

2. **Komponentai (components)** ✅
   - **NavigationBar** ✅
   - **PurchaseForm** ✅
   - **InitialStockForm** ✅
   - **IssuanceForm** ✅
   - **StockTable** ✅

3. **Duomenų srautai** ✅
   - API servisai ✅

---

### 2.5 Testavimas ⏳

1. **Unit testai** ⏳
2. **Integration testai** ⏳
3. **E2E testai** ⏳

---

### 2.6 Diegimas (Deployment) ✅

1. **Docker Compose** ✅
   - `docker-compose.yml` ✅
   - `Dockerfile` (backend) ✅
   - `Dockerfile` (frontend) ✅
   - Docker diegimas ir konfigūracija ✅
2. **Debesijos paslaugų tiekėjas** ⏳
3. **CI/CD** ⏳

---

### 2.7 Galimos ateities plėtros kryptys ⏳

1. **Vartotojų rolės** ⏳
2. **Tiekėjų valdymas** ✅
3. **Vilkikų priežiūros modulis** ✅
4. **Papildomi sandėliai** ⏳
5. **Ataskaitos su grafine analize** ⏳
6. **Integracija su kitomis sistemomis** ⏳

---

## 3. Darbų sąrašas (Task Breakdown)

1. **Inicijuoti projektą** ✅
   - Sukurti Git repozitoriją ✅
   - Paruošti `package.json`, `tsconfig.json`, Docker failus ✅
2. **Įdiegti duomenų bazę** ✅
   - Sukurti DB schemas (Sequelize modelius) ✅
3. **Sukurti bazinius API maršrutus** ✅
   - Pirkimai (`/api/purchases`) ✅
   - Išdavimai (`/api/issuances`) ✅
   - Atsargos (`/api/stocks`) ✅
   - Produktai (`/api/products`) ✅
   - Tiekėjai (`/api/suppliers`) ✅
   - Įmonės (`/api/companies`) ✅
   - Vilkikai (`/api/trucks`) ✅
4. **Frontend pradinė versija** ✅
   - React + TypeScript konfigūracija ✅
   - Pagrindinės navigacijos struktūra ✅
   - Lentelių atvaizdavimas, formos duomenų įvedimui ✅
5. **PDF generavimas** ✅
   - Sukurti backend endpointą PDF generavimui ✅
6. **Testai** ⏳
7. **Docker Compose** ✅
   - Paleisti `backend`, `frontend` ir `db` konteinerius ✅
8. **Paruošti diegimui** ⏳
9. **Dokumentacija ir tobulinimas** ⏳

---

## 4. Terminai ir atsakomybės

- **Projekto vadovas**: priima galutinius sprendimus, peržiūri reikalavimus, tvarko biudžetą.  
- **Backend programuotojas**: kuria ir prižiūri serverio dalį, DB schemas, API.  
- **Frontend programuotojas**: kuria vartotojo sąsają, integruoja su API.  
- **Testuotojas**: atlieka testus, užtikrina kokybę.  
- **Sandėlininkas / verslo pusės atstovas**: pateikia reikalavimus, testuoja prototipą, duoda grįžtamąjį ryšį.  

---

## 5. Išvada

Įgyvendinus šiame **ROADMAP** nurodytus žingsnius, Gretvėja-SVS taps paprasta, tačiau funkcionali sandėlio valdymo sistema, kuri padės optimizuoti pirkimų, išdavimų ir atsargų apskaitą. Esant poreikiui, ateityje projektą bus lengva plėsti, integruoti su kitomis sistemomis ar pridėti papildomų funkcijų.

---

## 6. Progresas

### 2023-03-06
- ✅ Sėkmingai sukonfigūruotas ir paleistas backend serveris su TypeScript
- ✅ Sėkmingai sukonfigūruotas ir paleistas frontend serveris su React
- ✅ Sukurta pradinė vartotojo sąsaja
- ✅ Sėkmingai sukonfigūruota ir paleista PostgreSQL duomenų bazė
- ✅ Visi konteineriai veikia kartu naudojant Docker Compose
- ✅ Sukurtas Pirkimų puslapis su galimybe pridėti, redaguoti ir ištrinti pirkimus
- ✅ Pridėta galimybė įvesti pradinį likutį
- ✅ Įkelti visi tiekėjai į duomenų bazę
- ✅ Atnaujintas produktų modelis su kodais ir pavadinimais skirtingomis kalbomis
- ✅ Įkelti visi produktai (187) iš CSV failo į duomenų bazę 
- ✅ Patobulinti produktų pasirinkimo laukeliai, kad rodytų produkto kodą ir pavadinimą 
- ✅ Patobulinti produktų pasirinkimo laukelių stiliai, kad būtų matomi pilni produktų pavadinimai
- ✅ Ištaisyta produktų pasirinkimo laukelių problema, kad būtų matomi pilni produktų pavadinimai
- ✅ Sukurtas pasirinktinis produktų pasirinkimo laukelis su geresniais stiliais
- ✅ Sukurtas visiškai pasirinktinis produktų pasirinkimo komponentas su paieška
- ✅ Ištaisytos klaidos pasirinktiniame produktų pasirinkimo komponente
- ✅ Pridėtas funkcionalumas, kad produktų pasirinkimo sąrašas užsidarytų paspaudus bet kur kitur ekrane
- ✅ Ištestuotas pirkimų funkcionalumas:
  - ✅ Galima pridėti naujus pirkimus su dideliais kiekiais
  - ✅ Galima įvesti dideles ir mažas kainas
  - ✅ Galima registruoti pirkimus atgaline data
  - ✅ Pirkimai sėkmingai įrašomi į duomenų bazę
  - ✅ Galima atnaujinti ir ištrinti pirkimus 

### 2023-03-07
- ✅ Ištaisyta klaida su unitPrice konvertavimu į skaičių, kuri sukeldavo "unitPrice.toFixed is not a function" klaidą
- ✅ Patobulinti pirkimų ir pradinio likučio komponentai, užtikrinant, kad skaičiai būtų tinkamai konvertuojami prieš siunčiant į serverį 
- ✅ Sukurtas Išdavimų puslapis su galimybe pridėti, redaguoti ir ištrinti išdavimus
- ✅ Sukurta išdavimų forma su šiais laukais:
  - ✅ Produkto pasirinkimas su paieška
  - ✅ Išdavimo data
  - ✅ Kiekis (VNT)
  - ✅ Vairuotojo vardas
  - ✅ Vilkiko pasirinkimas
  - ✅ Automatinis įmonės nustatymas pagal vilkiką
  - ✅ Išduota? (checkbox)
  - ✅ Pastabos
- ✅ Pridėta galimybė atsisiųsti PDF perdavimo aktą
- ✅ Patobulintas Išdavimų puslapio stilius, kad atitiktų Pirkimų puslapio stilių:
  - ✅ Pavadinimas centruotas ir virš mygtuko
  - ✅ Mygtukas "Naujas išdavimas" dešinėje pusėje
  - ✅ Forma rodoma modaliniame lange, o ne puslapio apačioje
- ✅ Ištaisyta modalinio lango problema, kai forma buvo rodoma žemiau footer:
  - ✅ Pridėti z-index stiliai modaliniam langui
  - ✅ Pridėta dialogClassName modaliniam langui
  - ✅ Pridėti papildomi stiliai, kad modalinis langas būtų tinkamai rodomas 
- ✅ Ištaisyta modalinio lango formatavimo problema, kai jis buvo rodomas "ant viršaus kitų elementų":
  - ✅ Patobulinti modalinio lango stiliai
  - ✅ Pridėti papildomi stiliai, kad modalinis langas būtų tinkamai atvaizduojamas
  - ✅ Pridėta contentClassName savybė modaliniam langui
  - ✅ Pridėti papildomi stiliai body.modal-open klasei, kad būtų išvengta slinkties problemų
- ✅ Sukurtas trucks API, kad būtų galima gauti vilkikų sąrašą su jų įmonėmis:
  - ✅ Sukurtas trucks kontroleris su CRUD operacijomis
  - ✅ Sukurtas trucks maršrutų failas
  - ✅ Pridėtas trucks API maršrutas į server.ts failą 

### 2023-03-08
- ✅ Sukurtas .gitignore failas su taisyklėmis Node.js projektui:
  - ✅ Ignoruojami node_modules katalogai
  - ✅ Ignoruojami build ir dist katalogai
  - ✅ Ignoruojami .env failai
  - ✅ Ignoruojami log failai
  - ✅ Ignoruojami IDE specifiniai failai
  - ✅ Ignoruojami package-lock.json failai
  - ✅ Ignoruojami CSV failai
- ✅ Sukurtas import-trucks.sh skriptas vilkikų importavimui iš CSV failo:
  - ✅ Automatinis įmonių sukūrimas, jei jos neegzistuoja
  - ✅ Vilkikų importavimas su sąsaja su įmonėmis
  - ✅ Klaidos apdorojimas ir progreso rodymas
- ✅ Sukurtas Admin puslapis su administravimo funkcijomis:
  - ✅ Vilkikų valdymas (pridėjimas, redagavimas, ištrynimas)
  - ✅ Produktų valdymas (pridėjimas, redagavimas, ištrynimas)
  - ✅ Tiekėjų valdymas (pridėjimas, redagavimas, ištrynimas)
- ✅ Atnaujinta navigacija, pridėta nuoroda į administravimo puslapį
- ✅ Sukurti stiliai administravimo puslapiui:
  - ✅ Kortelių stiliai su šešėliais
  - ✅ Lentelių stiliai su geresniais antraštės stiliais
  - ✅ Formų stiliai su geresniu išdėstymu
  - ✅ Modalinių langų stiliai
  - ✅ Responsive dizainas mobiliems įrenginiams
- ✅ Įgyvendintas vilkikų sąrašas su įmonių informacija

### 2023-03-09
- ✅ Atliktas Admin puslapio refaktorinimas pagal MVC architektūrą:
  - ✅ Sukurta bendra utils/common.js biblioteka bendriems metodams
  - ✅ Sukurti modeliai (TruckModel, ProductModel, SupplierModel, CompanyModel)
  - ✅ Sukurti kontrolieriai (TruckController, ProductController, SupplierController)
  - ✅ Sukurti atskiri komponentai (view) kiekvienai komponentų grupei
  - ✅ Išskirti atskiri puslapiai (Vilkikai, Produktai, Tiekejai) kiekvienai funkcinei sričiai
  - ✅ Optimizuotas kodo pakartotinis naudojimas ir struktūra
  - ✅ Pagerinta klaidų apdorojimo sistema
  - ✅ Pagerinta dokumentacija ir kodo komentarai
  - ✅ Pritaikyti šiuolaikiniai JavaScript šablonai ir metodikos
- ✅ Optimizuoti duomenų užkrovimo procesai
- ✅ Patobulinta vartotojo sąsaja su geriau valdomomis funkcijomis
- ✅ Implementuotas labiau komponentinis požiūris į vartotojo sąsają

### 2023-03-10
- ✅ Sukurtos keturios įmonės duomenų bazėje:
  - ✅ "UAB Gretvėja" (ID: 1)
  - ✅ "Gwind" (ID: 3)
  - ✅ "Gretvėja, DE" (ID: 4)
  - ✅ "Parme Trans" (ID: 5)
- ✅ Sukurti vilkikai kiekvienai įmonei:
  - ✅ "UAB Gretvėja" - "LT001" (Volvo FH16)
  - ✅ "Gwind" - "GW001" (Scania R450)
  - ✅ "Gretvėja, DE" - "DE001" (Mercedes Actros)
  - ✅ "Parme Trans" - "PT001" (MAN TGX)
- ✅ Patikrinta, kad vilkikų API veikia tinkamai:
  - ✅ Galima gauti visų vilkikų sąrašą
  - ✅ Galima gauti vilkiką pagal ID su jo įmonės informacija
  - ✅ Galima sukurti naują vilkiką

### 2023-03-11
- ✅ Rankiniu būdu sukurti vilkikai kiekvienai įmonei:
  - ✅ "UAB Gretvėja" - "LT001" (Volvo FH16) - ID: 11
  - ✅ "Gwind" - "GW001" (Scania R450) - ID: 12
  - ✅ "Gretvėja, DE" - "DE001" (Mercedes Actros) - ID: 13
  - ✅ "Parme Trans" - "PT001" (MAN TGX) - ID: 14
- ✅ Patikrinta, kad vilkikų API veikia tinkamai ir galima gauti vilkiką su jo įmonės informacija
- ✅ Nustatyta, kad import-trucks.sh skriptas turi problemų su jq įrankiu, todėl vilkikai buvo sukurti rankiniu būdu

### 2023-03-12
- ✅ Sukurti papildomi vilkikai rankiniu būdu:
  - ✅ "UAB Gretvėja" - "MST384" (Volvo FH16) - ID: 16
  - ✅ "UAB Gretvėja" - "NHD562" (Volvo FH16) - ID: 20
  - ✅ "Gwind" - "BS2079C" (Scania R450) - ID: 18
  - ✅ "Gretvėja, DE" - "MIVG999" (Mercedes Actros) - ID: 17
  - ✅ "Parme Trans" - "LRO417" (MAN TGX) - ID: 19
- ✅ Patikrinta, kad vilkikų API veikia tinkamai ir galima gauti visų vilkikų sąrašą
- ✅ Nustatyta, kad import-trucks.sh skriptas turi problemas su kodavimu ir specialiais simboliais, todėl vilkikai buvo sukurti rankiniu būdu naudojant curl komandas 

### 2023-03-13
- ✅ Sėkmingai importuoti visi tiekėjai (13) į duomenų bazę
- ✅ Sėkmingai importuoti visi produktai (187) į duomenų bazę
- ✅ Sukurtas DB_INFO.md dokumentas su detalia informacija apie duomenų bazės struktūrą:
  - ✅ Aprašytos visos lentelės ir jų laukai
  - ✅ Dokumentuoti API endpoints
  - ✅ Aprašyti importavimo skriptai
  - ✅ Pateiktos naudingos komandos duomenų bazės valdymui
- ✅ Patikrinta, kad Admin puslapyje tinkamai rodomi tiekėjai ir produktai
- ✅ Patikrinta, kad API grąžina teisingus duomenis

### 2023-03-14
- ✅ Sukurtas Stocks puslapis su galimybe peržiūrėti atsargų informaciją:
  - ✅ Sukurtas StockTable komponentas, kuris atvaizduoja atsargų duomenis
  - ✅ Pridėta paieška pagal produkto pavadinimą arba ID
  - ✅ Pridėtas filtravimas pagal atsargų būseną (visi, turintys atsargų, neturintys atsargų)
  - ✅ Sukurti stiliai Stocks puslapiui ir StockTable komponentui
  - ✅ Atnaujintas App.js, kad įtrauktų naują Stocks puslapį į maršrutizavimą
  - ✅ Patikrinta, kad Stocks puslapis tinkamai atvaizduoja duomenis iš API 

### 2025-03-07
- ✅ Patobulintas pagrindinis (Home) puslapis:
  - ✅ Pakeista skritulinė diagrama į horizontalią stulpelinę diagramą, kuri rodo 10 populiariausių produktų
  - ✅ Patobulintas kortelių išdėstymas ir stilius, naudojant grid sistemą
  - ✅ Pridėta poraštė su atnaujintais metais (dinamiškai gaunami)
  - ✅ Pridėta kūrėjo atribucija (Aurimas Butvilauskas)
  - ✅ Patobulintas responsive dizainas mobiliems įrenginiams
  - ✅ Pridėti hover efektai kortelėms
  - ✅ Filtruojami tik produktai su teigiamu likučiu
  - ✅ Padidintas produktų pavadinimų ilgis diagramoje (iki 25 simbolių)

### 2025-03-08
- ✅ Sukurtas bendras Footer komponentas:
  - ✅ Pašalinta sena poraštė su 2023 metais
  - ✅ Sukurtas atskiras Footer.js komponentas su dinamiškai gaunamais metais
  - ✅ Pridėta kūrėjo atribucija (Aurimas Butvilauskas)
  - ✅ Atnaujintas App.js, kad naudotų naują Footer komponentą
  - ✅ Pašalinta dubliuota poraštė iš Home.js
  - ✅ Sukurti atskiri Footer.css stiliai
  - ✅ Užtikrintas vienodas poraštės atvaizdavimas visame projekte 

### 2025-03-09
- ✅ Ištaisyta poraštės pozicionavimo problema:
  - ✅ Pašalinti dubliuoti poraštės stiliai iš Home.css failo
  - ✅ Užtikrinta, kad poraštė rodoma tik puslapio apačioje, o ne viduryje tarp grafikų
  - ✅ Patikrinta, kad poraštė tinkamai rodoma visuose puslapiuose
  - ✅ Patikrintas poraštės responsive dizainas skirtinguose įrenginiuose 

### 2024-03-21
- ✅ Patobulintas administravimo puslapis:
  - ✅ Pridėta paieškos funkcija kiekvienai kategorijai (vilkikai, produktai, tiekėjai)
  - ✅ Įgyvendintas rūšiavimas pagal stulpelius kiekvienoje kategorijoje
  - ✅ Atnaujinta vartotojo sąsaja su moderniais stiliais
  - ✅ Optimizuotas duomenų atvaizdavimas ir filtravimas
  - ✅ Pagerintas mobilusis vaizdavimas
  - ✅ Pridėti vizualiniai patobulinimai (ikonos, šešėliai, animacijos)

### 2024-03-22
- ✅ Ištaisyta administravimo sąsajos navigacijos elementų problema:
  - ✅ Pakeisti navigacijos elementai iš sąrašo elementų į mygtukus
  - ✅ Pridėti stiliai, kad navigacijos elementai atrodytų kaip mygtukai ar kortelės
  - ✅ Pašalinti sąrašo ženkliukai (bullet points)
  - ✅ Pridėti hover efektai navigacijos elementams
  - ✅ Pridėti šešėliai ir apvalinti kampai navigacijos elementams
  - ✅ Patobulinta navigacijos elementų išvaizda mobiliuose įrenginiuose
  - ✅ Užtikrinta, kad Bootstrap CSS yra tinkamai importuotas į projektą

### 2024-03-23
- ✅ Atnaujinta pagrindinė navigacijos juosta:
  - ✅ Perkurta naudojant React Bootstrap komponentus
  - ✅ "Gretvėja-SVS" logotipas grąžintas į viršutinę navigacijos juostą
  - ✅ Visi navigacijos elementai išdėstyti horizontaliai
  - ✅ Pridėti hover efektai ir aktyvaus elemento indikatorius
  - ✅ Patobulinta išvaizda mobiliuose įrenginiuose
  - ✅ Pridėtas "hamburger" meniu mažesniuose ekranuose
  - ✅ Užtikrintas tinkamas turinio atstumas nuo fiksuotos navigacijos juostos
  - ✅ Pridėti šešėliai ir perėjimai navigacijos elementams

### 2024-03-24
- ✅ Patobulintas projekto diegimas į kitas sistemas:
  - ✅ Atnaujintas .gitignore failas, kad įtrauktų svarbius pradinius duomenų failus
  - ✅ Užtikrinta, kad visi reikalingi failai yra versijuojami:
    - ✅ package.json (frontend ir backend)
    - ✅ docker-compose.yml ir Dockerfile failai
    - ✅ .env.example su pavyzdinėmis konfigūracijomis
    - ✅ Pradiniai duomenų failai (produktai.csv, Vilkikai.csv, suppliers.json)
  - ✅ Dokumentuota diegimo procedūra:
    1. Projekto klonavimas iš GitHub
    2. .env failo sukūrimas pagal .env.example
    3. Docker konteinerių paleidimas
    4. Pradinių duomenų importavimas

### Planuojami darbai
- [ ] Pridėti duomenų eksportavimo funkcijas (CSV, Excel)
- [ ] Įgyvendinti duomenų importavimo funkcijas
- [ ] Pridėti išplėstinės paieškos galimybes
- [ ] Sukurti duomenų archyvavimo sistemą
- [ ] Įgyvendinti vartotojų teisių valdymą 