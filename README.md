# gretveja-svs
 Gretveja sandelio valdymo sistema

## Projekto paleidimas

### Paleidimas naudojant Docker

1. Įsitikinkite, kad turite įdiegtą Docker.
2. Projekto kataloge paleiskite komandą:

```bash
docker-compose up --build
```

### Paleidimas be Docker

1. Įsitikinkite, kad turite įdiegtą PostgreSQL duomenų bazę.
2. Sukurkite duomenų bazę `gretveja_svs`.
3. Sukonfigūruokite .env failą backend kataloge (žr. .env.example).
4. Įdiekite priklausomybes ir paleiskite visas paslaugas:

```bash
# Įdiegti visas priklausomybes
npm run install:all

# Paleisti vienu metu backend ir frontend
npm run dev:all
```

## Atskiros paslaugos:

```bash
# Tik frontend
npm run dev:frontend

# Tik backend
npm run dev:backend
```
