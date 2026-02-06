# Usar uma versão estável do Node no Alpine
FROM node:22-alpine

# Instalar dependências necessárias para o Chromium e Prisma (OpenSSL)
# Adicionamos 'chromium' e as bibliotecas que o Puppeteer exige no Alpine
RUN apk add --no-cache \
    openssl \
    chromium \
    nss \
    freetype \
    harfbuzz \
    ca-certificates \
    ttf-freefont

# Variáveis de ambiente para o Puppeteer encontrar o Chromium do Alpine
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium-browser

WORKDIR /app

# Copiar arquivos de dependências
COPY package*.json ./
COPY prisma ./prisma/

# Instalar dependências (omitindo o download do Chromium do npm para economizar espaço)
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
