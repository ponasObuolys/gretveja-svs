FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Patikriname, ar tsconfig.json egzistuoja
RUN ls -la && echo "Checking tsconfig.json" && cat tsconfig.json

# Kompiliuojame TypeScript failus ir patikriname rezultatą
RUN npx tsc --project tsconfig.json && echo "TypeScript compilation completed" && ls -la dist/

EXPOSE 3001

CMD ["npm", "start"] 