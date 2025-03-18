# Gretvėja-SVS
Gretvėja sandėlio valdymo sistema

## Projekto paleidimas

### Reikalavimai

1. Įsitikinkite, kad turite įdiegtą Node.js (rekomenduojama 16.x versija arba naujesnė).
2. Įsitikinkite, kad turite įdiegtą PostgreSQL duomenų bazę.
3. Sukurkite duomenų bazę `gretveja_svs`.

### Projekto paruošimas

1. Sukonfigūruokite `.env` failą `backend` kataloge (žr. `.env.example`).
2. Įdiekite visas reikalingas priklausomybes:

```bash
# Įdiegti visas priklausomybes (pagrindiniame projekto kataloge)
npm run install:all
```

Jei `install:all` komanda nesuveikė tinkamai, galite įdiegti priklausomybes rankiniu būdu:

```bash
# Pagrindiniame kataloge
npm install

# Frontend kataloge
cd frontend
npm install
cd ..

# Backend kataloge
cd backend
npm install
cd ..
```

### Projekto paleidimas

Paleiskite projektą naudodami šią komandą pagrindiniame projekto kataloge:

```bash
npm run dev:all
```

Ši komanda paleis tiek backend, tiek frontend serverius vienu metu.

Jei paleidžiant gaunate klaidą `command not found`, įdiekite trūkstamas priklausomybes globaliai:

```bash
npm install -g nodemon
npm install -g concurrently
```

### Atskiros paslaugos

Jei norite paleisti tik vieną iš serverių:

```bash
# Tik frontend (veiks adresu http://localhost:3000)
npm run dev:frontend

# Tik backend (veiks adresu http://localhost:3001)
npm run dev:backend
```

### Prisijungimas prie sistemos

Paleidus serverius, frontend aplikacija bus pasiekiama adresu http://localhost:3000, o backend API - http://localhost:3001.
