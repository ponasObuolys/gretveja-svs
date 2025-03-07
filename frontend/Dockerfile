FROM node:18-alpine

WORKDIR /app

# Kopijuojame package.json ir package-lock.json
COPY package*.json ./

# Įdiegiame priklausomybes
RUN npm install
# Įdiegiame recharts biblioteką
RUN npm install recharts

# Kopijuojame visus failus
COPY . .

# Patikriname, ar failai buvo nukopijuoti
RUN ls -la && ls -la src/

EXPOSE 3000

CMD ["npm", "start"] 