FROM node:22-alpine

WORKDIR /app

# Instalar dependências do sistema necessárias para o Prisma (OpenSSL)
RUN apk add --no-cache openssl

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências
RUN npm install

# Copiar o restante do código fonte
COPY . .

# Gerar o cliente Prisma
RUN npx prisma generate

# Build da aplicação TypeScript
RUN npm run build

# Expor a porta que a aplicação usa
EXPOSE 3333

# Comando para iniciar a aplicação
CMD ["npm", "start"]
