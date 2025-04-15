# Estágio de build
FROM node:20-alpine AS build

# Definir argumentos de build
ARG NODE_ENV=production
ARG VITE_API_URL=/api
# Adicione outros argumentos conforme necessário

# Definir variáveis de ambiente para o build
ENV NODE_ENV=${NODE_ENV}
ENV VITE_API_URL=${VITE_API_URL}

# Criar usuário não-root
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

# Definir diretório de trabalho
WORKDIR /app

# Copiar arquivos de dependências primeiro para melhor caching
COPY package*.json ./
COPY bun.lockb ./

# Instalar dependências (usando ci para garantir o uso do package-lock.json)
RUN npm ci

# Mudar para usuário não-root
USER appuser

# Copiar o restante dos arquivos do projeto
COPY --chown=appuser:appgroup . .

# Construir a aplicação
RUN npm run build

# Estágio de produção
FROM nginx:alpine

# Copiar configuração personalizada do nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Garantir que apenas nossa configuração seja usada
RUN rm -f /etc/nginx/conf.d/default.conf.default 2>/dev/null || true

# Copiar script para injeção de variáveis de ambiente
COPY env.sh /docker-entrypoint.d/40-env-config.sh
RUN chmod +x /docker-entrypoint.d/40-env-config.sh

# Copiar arquivos de build da aplicação
COPY --from=build /app/dist /usr/share/nginx/html

# Garantir permissões corretas
RUN chown -R nginx:nginx /usr/share/nginx/html && \
    chmod -R 755 /usr/share/nginx/html

# Expor porta 80
EXPOSE 80

# Definir variáveis de ambiente padrão
ENV NODE_ENV=production
ENV API_URL=/api

# Iniciar nginx
CMD ["nginx", "-g", "daemon off;"]
